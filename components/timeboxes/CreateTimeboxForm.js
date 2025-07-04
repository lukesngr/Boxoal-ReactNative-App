import {useState, useEffect} from 'react';
import { convertToDayjs } from '../../modules/formatters';
import { addBoxesToTime, calculateMaxNumberOfBoxes } from '../../modules/boxCalculations';
import {Picker} from '@react-native-picker/picker';;
import axios from 'axios';
import { queryClient } from '../../modules/queryClient.js';
import serverIP from '../../modules/serverIP';
import { styles } from '../../styles/styles';
import { dayToName } from '../../modules/dateCode';
import { listOfColors } from '../../styles/styles';
import { Dialog, Portal, TextInput, Button, SegmentedButtons } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Alert from '../Alert';
var utc = require("dayjs/plugin/utc");
import dayjs from 'dayjs';
import * as Sentry from "@sentry/nextjs";

dayjs.extend(utc);

export default function CreateTimeboxForm(props) {
    
    const dispatch = useDispatch();
    const {scheduleID, wakeupTime, boxSizeUnit, boxSizeNumber} = useSelector(state => state.profile.value);
    const {timeboxes, goals} = useSelector(state => state.scheduleData.value);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [numberOfBoxes, setNumberOfBoxes] = useState('1');
    const activeGoals = goals.filter(goal => goal.active);
    const [goalSelected, setGoalSelected] = useState(activeGoals.length == 0 ? -1 : activeGoals[0].id);
    
    const [moreOptionsVisible, setMoreOptionsVisible] = useState(false);
    const [isTimeblock, setIsTimeBlock] = useState(false);
    const [reoccuring, setReoccuring] = useState(false);
    const [startOfDayRange, setStartOfDayRange] = useState(0);
    const [endOfDayRange, setEndOfDayRange] = useState(6);
    const {scheduleIndex} = useSelector(state => state.profile.value);
    const [alert, setAlert] = useState({shown: false, title: "", message: ""});

    
    let {time, date} = props;

    let maxNumberOfBoxes = calculateMaxNumberOfBoxes(wakeupTime, boxSizeUnit, boxSizeNumber, timeboxes, time, date);

    const createTimeboxMutation = useMutation({
        mutationFn: (timeboxData) => axios.post(serverIP+'/createTimebox', timeboxData),
        onMutate: async (timeboxData) => {
            await queryClient.cancelQueries(['schedule']); 
            
            const previousSchedule = queryClient.getQueryData(['schedule']);
            
            queryClient.setQueryData(['schedule'], (old) => {
                if (!old) return old;
                let copyOfOld = structuredClone(old);
                copyOfOld[scheduleIndex].timeboxes.push({...timeboxData, recordedTimeBoxes: []});
                let goalIndex = copyOfOld[scheduleIndex].goals.findIndex(element => element.id == Number(goalSelected));
                copyOfOld[scheduleIndex].goals[goalIndex].timeboxes.push({...timeboxData, recordedTimeBoxes: []})
                return copyOfOld;
            });
            
            
            return { previousSchedule };
        },
        onSuccess: () => {
            setAlert({
                open: true,
                title: "Timebox",
                message: "Added timebox!"
            });
            queryClient.invalidateQueries(['schedule']); // Refetch to get real data
            closeModal();
        },
        onError: (error, context) => {
            queryClient.setQueryData(['schedule'], context.previousGoals);
            Sentry.captureException(error);
            setAlert({ open: true, title: "Error", message: "An error occurred, please try again or contact the developer" });
            queryClient.invalidateQueries(['schedule']);
            closeModal();
        }
    });

    function closeModal() {
        dispatch({type: 'modalVisible/set', payload: {visible: false, props: {}}});
    }

    function handleSubmit() {

        if(goalSelected == -1 && !isTimeblock) {
            setAlert({shown: true, title: "Error", message: "Please create a goal before creating a timebox"});
            return;
        }else{

            let startTime = convertToDayjs(time, date).utc().format();
            let endTime = convertToDayjs(addBoxesToTime(boxSizeUnit, boxSizeNumber, time, numberOfBoxes), date).utc().format(); //add boxes to start time to get end time
            let color = isTimeblock ? ('black') : (listOfColors[Math.floor(Math.random() * listOfColors.length)]);    
            let data = {
                isTimeblock,
                title, 
                description, 
                startTime, 
                endTime, 
                numberOfBoxes: parseInt(numberOfBoxes), 
                color, 
                schedule: {connect: {id: scheduleID}}, 
                objectUUID: crypto.randomUUID()
            }

            if (!isTimeblock) {
                data["goal"] = { connect: { id: goalSelected } };
            }

            if (reoccuring) {
                data["reoccuring"] = { create: { startOfDayRange, endOfDayRange } };
            }
            
            createTimeboxMutation.mutate(data);
        }

    }

    function safeSetNumberOfBoxes(number) {
        let amountOfBoxes;
        if(number != '') {
            try {
                amountOfBoxes = Number(number)
            }catch(e){
                amountOfBoxes = 1;
            }
        
            if(amountOfBoxes > maxNumberOfBoxes) {
                setNumberOfBoxes('1');
                setAlert({shown: true, title: "Error", message: "You cannot create a timebox that exceeds the number of boxes in the schedule"});
            }else {
                setNumberOfBoxes(String(amountOfBoxes));
            }
        }else{
            setNumberOfBoxes('');
        }
    }

    

    return (
    <Portal>
        <Dialog style={styles.forms.dialogStyle} visible={props.visible} onDismiss={closeModal}>
            <Dialog.Title style={styles.forms.dialogTitleStyle}>Create Timebox</Dialog.Title>
            <Dialog.Content>
            <SegmentedButtons
                value={isTimeblock}
                theme={styles.forms.segmentedButtonsTheme}
                style={{backgroundColor: 'white'}}
                onValueChange={setIsTimeBlock}
                buttons={[
                {
                    value: false,
                    label: 'Timebox',
                },
                {
                    value: true,
                    label: 'Timeblock',
                },
                ]}
            />
                <TextInput label="Title" testID='createTimeboxTitle' value={title} onChangeText={setTitle} {...styles.paperInput}/>
                <TextInput label="Description" testID='createTimeboxDescription' value={description} onChangeText={setDescription} {...styles.paperInput}/>
                <TextInput label="Number of Boxes" testID='createTimeboxBoxes' value={numberOfBoxes} onChangeText={safeSetNumberOfBoxes} {...styles.paperInput}/>
                {!isTimeblock && <TextInput label="Goal" value={goalSelected} {...styles.paperInput}
                    render={(props) => (
                        <Picker style={styles.forms.pickerParentStyle} dropdownIconColor='black' selectedValue={goalSelected} onValueChange={setGoalSelected}>
                            {activeGoals.map((goal, index) => {
                                return <Picker.Item key={index} style={styles.forms.pickerItemStyle} label={goal.title} value={String(goal.id)} />
                            })}
                        </Picker>
                    )}
                ></TextInput>}
                {moreOptionsVisible && <>
                    <TextInput label="Reoccurring"  value={reoccuring ? "Yes" : "No"} {...styles.paperInput}
                        render={(props) => (
                            <Picker style={styles.forms.pickerParentStyle}  dropdownIconColor='black' selectedValue={reoccuring} onValueChange={setReoccuring}>
                                <Picker.Item label="No" style={styles.forms.pickerItemStyle} value={false} />
                                <Picker.Item label="Yes" style={styles.forms.pickerItemStyle} value={true} />
                            </Picker>
                        )}
                    />
                    {reoccuring && <>
                        <TextInput label="Start Day"  value={dayToName[startOfDayRange]} {...styles.paperInput}
                            render={(props) => (
                                <Picker style={styles.forms.pickerParentStyle}  dropdownIconColor='black' selectedValue={startOfDayRange} onValueChange={setStartOfDayRange}>
                                    {dayToName.map((day, index) => {
                                        return <Picker.Item style={styles.forms.pickerItemStyle} key={index} label={day} value={index} />
                                    })}
                                </Picker>
                            )}
                        />
                        <TextInput label="End Day" style={styles.forms.pickerParentStyle}  value={dayToName[endOfDayRange]} {...styles.paperInput}
                            render={(props) => (
                                <Picker style={{color: 'black', marginTop: 5}} dropdownIconColor='black' selectedValue={endOfDayRange} onValueChange={setEndOfDayRange}>
                                    {dayToName.map((day, index) => {
                                        return <Picker.Item style={styles.forms.pickerItemStyle} key={index} label={day} value={index} />
                                    })}
                                </Picker>
                            )}
                        />
                    </>}
                </>}
            </Dialog.Content>
            <Dialog.Actions>
                <Button {...styles.forms.actionButton} onPress={handleSubmit}>Create</Button>
                {!moreOptionsVisible && <Button {...styles.forms.nonActionButton} onPress={() => setMoreOptionsVisible(true)}>More Options</Button>}
                {moreOptionsVisible && <Button {...styles.forms.nonActionButton} onPress={() => setMoreOptionsVisible(false)}>Less Options</Button>}
                <Button {...styles.forms.nonActionButton} onPress={closeModal}>Exit</Button>
            </Dialog.Actions>
        </Dialog>
        {alert.shown && <Alert visible={alert.shown} close={() => setAlert({...alert, shown: false})} title={alert.title} message={alert.message}/> }
    </Portal>
    );
}