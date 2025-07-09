import axios from "axios";
import { Dialog, Button, Portal } from "react-native-paper";
import { useState } from "react";
import DatePicker from "react-native-date-picker";
import serverIP from "../../modules/serverIP";
import Alert from "../Alert";
import { queryClient } from '../../modules/queryClient.js';
import { useDispatch, useSelector } from "react-redux";
import { convertToTimeAndDate } from "../../modules/formatters.js";
import { styles } from "../../styles/styles.js";

import { useMutation } from "@tanstack/react-query";
import uuid from 'react-native-uuid';

export default function ManualEntryTimeModal(props) {
    const [recordedStartTime, setRecordedStartTime] = useState(new Date(props.data.startTime));
    const [recordedEndTime, setRecordedEndTime] = useState(new Date(props.data.endTime));
    const [startTimePickerVisible, setStartTimePickerVisible] = useState(false);
    const [endTimePickerVisible, setEndTimePickerVisible] = useState(false);
    const [alert, setAlert] = useState({open: false, title: "", message: ""});
    const {scheduleIndex} = useSelector(state => state.profile.value);

    const createRecordingMutation = useMutation({
        mutationFn: (recordingData) => axios.post(serverIP+'/createRecordedTimebox', recordingData),
        onMutate: async (recordingData) => {
            await queryClient.cancelQueries(['schedule']); 
            
            const previousSchedule = queryClient.getQueryData(['schedule']);
            
            queryClient.setQueryData(['schedule'], (old) => {
                if (!old) return old;
                //recordedTimeBoxes in schedule
                let copyOfOld = JSON.parse(JSON.stringify(old));
                let recordingDataCopy = JSON.parse(JSON.stringify(recordingData));
                recordingDataCopy.timeBox = props.data
                copyOfOld[scheduleIndex].recordedTimeboxes.push(recordingDataCopy);

                //recordedTimeboxes in timeboxes
                let timeboxIndex = copyOfOld[scheduleIndex].timeboxes.findIndex(element => element.objectUUID == props.data.objectUUID);
                copyOfOld[scheduleIndex].timeboxes[timeboxIndex].recordedTimeBoxes.push(recordingDataCopy);

                //recordedTimeBoxes in goals
                let goalIndex = copyOfOld[scheduleIndex].goals.findIndex(element => element.id == Number(props.data.goalID));
                let timeboxGoalIndex = copyOfOld[scheduleIndex].goals[goalIndex].timeboxes.findIndex(element => element.objectUUID == props.data.objectUUID);
                
                copyOfOld[scheduleIndex].goals[goalIndex].timeboxes[timeboxGoalIndex].recordedTimeBoxes.push(recordingDataCopy);
                return copyOfOld;
            });
            
            
            return { previousSchedule };
        },
        onSuccess: () => {
            props.close()
            setAlert({
                open: true,
                title: "Timebox",
                message: "Added recorded timebox!"
            });
            queryClient.invalidateQueries(['schedule']); // Refetch to get real data
        },
        onError: (error, goalData, context) => {
            queryClient.setQueryData(['schedule'], context.previousSchedule);
            setAlert({ open: true, title: "Error", message: "An error occurred, please try again or contact the developer" });
            queryClient.invalidateQueries(['schedule']);
            
            props.close();
        }
    });

    function submitManualEntry() {
        let objectUUID = uuid.v4();
        let recordingData = {
            recordedStartTime: recordedStartTime, 
            recordedEndTime: recordedEndTime, 
            timeBox: { connect: { id: props.data.id, objectUUID: props.data.objectUUID } }, 
            schedule: { connect: { id: props.scheduleID } },
            objectUUID,
        };
        createRecordingMutation.mutate(recordingData);
        
        //confused as to what this codes does will test later
        let [date, time] = convertToTimeAndDate(props.data.startTime);
        let timeboxTitle = props.data.title;
        let timebox = {...props.data, recordedTimeBoxes: [{recordedStartTime, recordedEndTime, title: timeboxTitle}]};
        props.dispatch({type: 'modalVisible/set', payload: {visible: true, props: {data: timebox, date, time}}});
    }

    return (<Portal>
    <Dialog style={styles.forms.dialogStyle} visible={props.visible} onDismiss={props.close}>
        <Dialog.Title style={styles.forms.dialogTitleStyle}>Manual Entry Of Recorded Time</Dialog.Title>
        <Dialog.Content>
            <Button {...styles.forms.actionButton} style={{marginBottom: 2}} onPress={() => setStartTimePickerVisible(true)}>Pick Recorded Start Time</Button>
            <Button {...styles.forms.actionButton} mode="contained" onPress={() => setEndTimePickerVisible(true)}>Pick Recorded End Time</Button>
        </Dialog.Content>
        <Dialog.Actions>
            <Button {...styles.forms.actionButton} mode="contained" onPress={submitManualEntry}>Enter</Button>
            <Button {...styles.forms.nonActionButton} textColor="white" onPress={props.close}>Close</Button>
        </Dialog.Actions>
    </Dialog>
    <DatePicker modal mode="datetime" date={recordedStartTime}
        onDateChange={(date) => setRecordedStartTime(date)}
        open={startTimePickerVisible}
        onConfirm={(date) => 
            {
                setRecordedStartTime(date)
                setStartTimePickerVisible(false);
            }
        }
        onCancel={() => setStartTimePickerVisible(false)}>
    </DatePicker>
    <DatePicker modal mode="datetime" date={recordedEndTime}
        onDateChange={(date) => setRecordedEndTime(date)}
        open={endTimePickerVisible}
        onConfirm={(date) => 
            {
                setRecordedEndTime(date)
                setEndTimePickerVisible(false);
            }
        }
        onCancel={() => setEndTimePickerVisible(false)}>
    </DatePicker>
    {alert.open && <Alert visible={alert.open} close={() => setAlert({...alert, open: false})} title={alert.title} message={alert.message}/> }
    </Portal>)
}