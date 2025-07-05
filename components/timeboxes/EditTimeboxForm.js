import axios from "axios";
import { useState } from "react";
import serverIP from "../../modules/serverIP";
import { queryClient } from '../../modules/queryClient.js';
import { Portal, Dialog, TextInput, Button, SegmentedButtons } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { convertToTimeAndDate, convertToDayjs } from "../../modules/formatters.js";
import { addBoxesToTime, calculateMaxNumberOfBoxes } from "../../modules/boxCalculations.js";
import { useDispatch, useSelector } from "react-redux";
import { styles } from "../../styles/styles";
import Alert from "../Alert";
import { dayToName } from "../../modules/dateCode";
import * as Sentry from "@sentry/react-native";
import { useMutation } from "@tanstack/react-query";

export default function EditTimeboxForm(props) {
    const dispatch = useDispatch();
    const [title, setTitle] = useState(props.data.title);
    const [description, setDescription] = useState(props.data.description);
    const [numberOfBoxes, setNumberOfBoxes] = useState(String(props.data.numberOfBoxes));
    const [goalSelected, setGoalSelected] = useState(props.data.goalID);

    const [reoccuring, setReoccuring] = useState(props.data.reoccuring != null);
    const [startOfDayRange, setStartOfDayRange] = useState(props.data.reoccuring != null ? (props.data.reoccuring.startOfDayRange) : 0);
    const [endOfDayRange, setEndOfDayRange] = useState(props.data.reoccuring != null ? props.data.reoccuring.endOfDayRange : 0);
    const [isTimeblock, setIsTimeBlock] = useState(false);
    
    const [alert, setAlert] = useState({shown: false, title: "", message: ""});

    const {id, wakeupTime, boxSizeUnit, boxSizeNumber} = useSelector(state => state.profile.value);
    const {timeboxes, goals} = useSelector(state => state.scheduleData.value);
    const {scheduleIndex} = useSelector(state => state.profile.value);
    let [time, date] = convertToTimeAndDate(props.data.startTime);
    let maxNumberOfBoxes = calculateMaxNumberOfBoxes(wakeupTime, boxSizeUnit, boxSizeNumber, timeboxes, time, date);

    function closeModal() {
        dispatch({type: 'modalVisible/set', payload: {visible: false, props: {}}});
    }

    const updateTimeboxMutation = useMutation({
        mutationFn: (timeboxData) => axios.put(serverIP+'/updateTimeBox', timeboxData),
        onMutate: async (timeboxData) => {
            await queryClient.cancelQueries(['schedule']); 
            
            const previousSchedule = queryClient.getQueryData(['schedule']);
            
            queryClient.setQueryData(['schedule'], (old) => {
                if (!old) return old;
                let copyOfOld = structuredClone(old);
                let timeboxIndex = copyOfOld[scheduleIndex].timeboxes.findIndex(element => element.objectUUID == data.objectUUID);
                copyOfOld[scheduleIndex].timeboxes[timeboxIndex] = {...timeboxData, recordedTimeBoxes: []};
                let goalIndex = copyOfOld[scheduleIndex].goals.findIndex(element => element.id == Number(goalSelected));
                let timeboxGoalIndex = copyOfOld[scheduleIndex].goals[goalIndex].timeboxes.findIndex(element => element.objectUUID == data.objectUUID);
                copyOfOld[scheduleIndex].goals[goalIndex].timeboxes[timeboxGoalIndex] = {...timeboxData, recordedTimeBoxes: []};
                return copyOfOld;
            });
            
            
            return { previousSchedule };
        },
        onSuccess: () => {
            setAlert({
                    open: true,
                    title: "Timebox",
                    message: "Updated timebox!"
            });
            queryClient.invalidateQueries(['schedule']); // Refetch to get real data
        },
        onError: (error, goalData, context) => {
            queryClient.setQueryData(['schedule'], context.previousGoals);
            setAlert({ open: true, title: "Error", message: "An error occurred, please try again or contact the developer" });
            Sentry.captureException(error);
            queryClient.invalidateQueries(['schedule']);
        }
    });

    const deleteTimeboxMutation = useMutation({
        mutationFn: (objectUUID) => axios.post(serverIP+'/deleteTimebox', {objectUUID: objectUUID}),
        onMutate: async (objectUUID) => {
            await queryClient.cancelQueries(['schedule']); 
            
            const previousSchedule = queryClient.getQueryData(['schedule']);
            
            queryClient.setQueryData(['schedule'], (old) => {
                if (!old) return old;
                let copyOfOld = structuredClone(old);
                let timeboxIndex = copyOfOld[scheduleIndex].timeboxes.findIndex(element => element.objectUUID == objectUUID);
                copyOfOld[scheduleIndex].timeboxes.splice(timeboxIndex, 1);
                let goalIndex = copyOfOld[scheduleIndex].goals.findIndex(element => element.id == Number(goalSelected));
                let timeboxGoalIndex = copyOfOld[scheduleIndex].goals[goalIndex].timeboxes.findIndex(element => element.objectUUID == objectUUID);
                copyOfOld[scheduleIndex].goals[goalIndex].timeboxes.splice(timeboxGoalIndex, 1);
                return copyOfOld;
            });
            
            
            return { previousSchedule };
        },
        onSuccess: () => {
            setAlert({
                open: true,
                title: "Timebox",
                message: "Deleted timebox!"
            });
            queryClient.invalidateQueries(['schedule']); // Refetch to get real data
        },
        onError: (error, goalData, context) => {
            queryClient.setQueryData(['schedule'], context.previousGoals);
            Sentry.captureException(error);
            setAlert({ open: true, title: "Error", message: "An error occurred, please try again or contact the developer" });
            queryClient.invalidateQueries(['schedule']);
        }
    });

    function updateTimeBox() {
        let endTime = convertToDayjs(addBoxesToTime(boxSizeUnit, boxSizeNumber, time, numberOfBoxes), date).utc().format(); //add boxes to start time to get end time

        let data = {
            id: props.data.id,
            title, 
            description, 
            startTime: props.data.startTime, 
            endTime, 
            numberOfBoxes: parseInt(numberOfBoxes), 
            isTimeblock,
            objectUUID: props.data.objectUUID,
            color: props.data.color
        }

        if (!isTimeblock) {
            data["goal"] = { connect: { id: goalSelected } };
        }

        if(reoccuring) {
            updateData["reoccuring"] = { create: { startOfDayRange, endOfDayRange } };
        } 

        updateTimeboxMutation.mutate(data);
    }
    
    function deleteTimeBox() {
        deleteTimeboxMutation.mutate(props.data.objectUUID);
    }

    function clearRecording() {
        
        axios.post(serverIP+'/clearRecording', {
            id: props.data.id
        }).then(async () => {   
            setAlert({shown: true, title: "Timebox", message: "Cleared recording!"});
            await queryClient.refetchQueries();
        }).catch(function(error) {
            setAlert({shown: true, title: "Error", message: "An error occurred, please try again or contact the developer"});
            console.log(error); 
        });
    }

    function safeSetNumberOfBoxes(number) {
        let amountOfBoxes;
        try {
            amountOfBoxes = Number(number)
        }catch(e){
            amountOfBoxes = 1;
        }

        if(amountOfBoxes > maxNumberOfBoxes) {
            setNumberOfBoxes('1');
        }else {
            setNumberOfBoxes(String(amountOfBoxes));
        }
    }


    return (
    <Portal>
        <Dialog style={styles.forms.dialogStyle} visible={true} onDismiss={closeModal}>
            <Dialog.Title style={styles.forms.dialogTitleStyle}>Edit Timebox</Dialog.Title>
            <Dialog.Content>
                <SegmentedButtons
                    value={isTimeblock}
                    onValueChange={setIsTimeBlock}
                    style={{backgroundColor: 'white'}}
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
                    theme={styles.forms.segmentedButtonsTheme}
                />
                <TextInput label="Title" value={title} testID="editTitle" onChangeText={setTitle} {...styles.paperInput}/>
                <TextInput label="Description" value={description} onChangeText={setDescription} {...styles.paperInput}/>
                <TextInput label="Number of Boxes" value={numberOfBoxes} onChangeText={safeSetNumberOfBoxes} {...styles.paperInput}/>
                {!isTimeblock && <TextInput label="Goal" value={goalSelected} {...styles.paperInput}
                    render={(props) => (
                        <Picker style={styles.forms.pickerParentStyle} dropdownIconColor='black' selectedValue={goalSelected} onValueChange={setGoalSelected}>
                            {goals.map((goal, index) => {
                                if(goal.active) {
                                    return ( <Picker.Item key={index}  style={styles.forms.pickerItemStyle} label={goal.title} value={String(goal.id)} />)
                                }
                            })}
                        </Picker>
                    )}
                ></TextInput>}
                <TextInput label="Reoccurring" value={reoccuring ? "Yes" : "No"} {...styles.paperInput}
                        render={(props) => (
                            <Picker style={styles.forms.pickerParentStyle} dropdownIconColor='black' selectedValue={reoccuring} onValueChange={setReoccuring}>
                                <Picker.Item  style={styles.forms.pickerItemStyle} label="No" value={false} />
                                <Picker.Item  style={styles.forms.pickerItemStyle} label="Yes" value={true} />
                            </Picker>
                        )}
                    />
                    {reoccuring && <>
                        <TextInput label="Start Day"  value={dayToName[startOfDayRange]} {...styles.paperInput}
                            render={(props) => (
                                <Picker style={styles.forms.pickerParentStyle} dropdownIconColor='black' selectedValue={startOfDayRange} onValueChange={setStartOfDayRange}>
                                    {dayToName.map((day, index) => {
                                        return <Picker.Item  style={styles.forms.pickerItemStyle} key={index} label={day} value={index} />
                                    })}
                                </Picker>
                            )}
                        />
                        <TextInput label="End Day"  value={dayToName[endOfDayRange]} {...styles.paperInput}
                            render={(props) => (
                                <Picker style={styles.forms.pickerParentStyle} dropdownIconColor='black' selectedValue={endOfDayRange} onValueChange={setEndOfDayRange}>
                                    {dayToName.map((day, index) => {
                                        return <Picker.Item  style={styles.forms.pickerItemStyle} key={index} label={day} value={index} />
                                    })}
                                </Picker>
                            )}
                        />
                    </>}
            </Dialog.Content>
            <Dialog.Actions>
                <Button {...styles.forms.actionButton}  mode="contained" onPress={updateTimeBox}>Update</Button>
                {props.previousRecording && <Button testID="clearRecording" {...styles.forms.actionButton}  mode="contained" onPress={clearRecording}>Clear Recording</Button>}
                <Button {...styles.forms.actionButton} mode="contained" testID="deleteTimebox" onPress={deleteTimeBox}>Delete</Button>
                <Button {...styles.forms.nonActionButton} onPress={props.back}>Back</Button>
            </Dialog.Actions>
        </Dialog>
        {alert.shown && <Alert visible={alert.shown} close={() => setAlert({...alert, shown: false})} title={alert.title} message={alert.message}/> }
    </Portal>)
}