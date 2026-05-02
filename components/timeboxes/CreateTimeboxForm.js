import {useState, useEffect} from 'react';
import { convertToDayjs } from '../../modules/formatters';
import { addBoxesToTime, calculateMaxNumberOfBoxes } from '../../modules/boxCalculations';
import {Picker} from '@react-native-picker/picker';;
import { styles } from '../../styles/styles';
import { dayToName } from '../../modules/dateCode';
import { listOfColors } from '../../styles/styles';
import { Dialog, Portal, TextInput, Button, SegmentedButtons } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
var utc = require("dayjs/plugin/utc");
import dayjs from 'dayjs';
import useCreateBoxMut from '../../hooks/useCreateBoxMut.js'
import uuid from 'react-native-uuid';
import { fetchAuthSession } from "aws-amplify/auth";

dayjs.extend(utc);

export default function CreateTimeboxForm(props) {
    
    const dispatch = useDispatch();
    const {scheduleID, wakeupTime, boxSizeUnit, boxSizeNumber} = useSelector(state => state.profile.value);
    const {timeboxes, goals} = useSelector(state => state.scheduleData.value);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [numberOfBoxes, setNumberOfBoxes] = useState('1');
    const activeGoals = [...goals.k2ToValue.values()].filter(goal => goal.state == 'active');
    const [goalSelected, setGoalSelected] = useState(activeGoals.length == 0 ? -1 : activeGoals[0].id);
    
    const [moreOptionsVisible, setMoreOptionsVisible] = useState(false);
    const [isTimeblock, setIsTimeBlock] = useState(false);
    const [reoccuring, setReoccuring] = useState(false);
    const [startOfDayRange, setStartOfDayRange] = useState(0);
    const [endOfDayRange, setEndOfDayRange] = useState(6);
    
    let {time, date} = props;

    let maxNumberOfBoxes = calculateMaxNumberOfBoxes(wakeupTime, boxSizeUnit, boxSizeNumber, timeboxes, time, date);
    function closeModal() {
        dispatch({type: 'modalVisible/set', payload: {visible: false, props: {}}});
    }

    const createTimeboxMutation = useCreateBoxMut(goalSelected, closeModal);

   
    async function handleSubmit() {

        if(goalSelected == -1 && !isTimeblock) {
            dispatch({type: 'alert/set', payload: {open: true, title: "Error", message: "Please create a goal before creating a timebox"}});
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
                objectUUID: uuid.v4()
            }

            if (!isTimeblock) {
                data["goal"] = { connect: { id: goalSelected } };
            }

            if (reoccuring) {
                data["reoccuring"] = { create: { startOfDayRange, endOfDayRange } };
            }
            
            const session = await fetchAuthSession();
            const accessToken = session.tokens?.accessToken.toString();
            const headers = {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            };
            createTimeboxMutation.mutate({ timeboxData: data, headers });
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
                dispatch({type: 'alert/set', payload: {open: true, title: "Error", message: "You cannot create a timebox that exceeds the number of boxes in the schedule"}});
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
    </Portal>
    );
}
