import { addBoxesToTime, calculateXPPoints, convertToDateTime, recordingNotificationsSetup, thereIsNoRecording } from "../../modules/coreLogic";
import axios from 'axios';
import { queryClient } from '../../modules/queryClient.js';
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveOverlayInterval, resetActiveOverlayInterval } from "../../redux/activeOverlayInterval";
import { NativeModules, Pressable } from "react-native";
import serverIP from "../../modules/serverIP";
import { Button } from "react-native-paper";
import EditTimeboxForm from "./EditTimeboxForm";
import Alert from "../Alert";
import { Dialog, Paragraph, Portal } from "react-native-paper";
import { useAuthenticator } from "@aws-amplify/ui-react-native";
import ManualEntryTimeModal from "../modals/ManualEntryTimeModal";
import { styles } from "../../styles/styles.js";

import { useMutation } from "@tanstack/react-query";
import uuid from 'react-native-uuid';
import TimelineRecording from "./TimelineRecording.js";

export default function TimeboxActionsForm(props) {
    const {data, date, time} = props;
    const [manualEntryModalShown, setManualEntryModalShown] = useState(false);
    const [showEditTimeboxForm, setShowEditTimeboxForm] = useState(false);
    const [alert, setAlert] = useState({shown: false, title: "", message: ""});
    const timeboxRecording = useSelector(state => state.timeboxRecording.value);
    const {boxSizeUnit, boxSizeNumber, scheduleID, scheduleIndex} = useSelector(state => state.profile.value);
    const dispatch = useDispatch();
    
    const noPreviousRecording = thereIsNoRecording(data.recordedTimeBoxes, data.reoccuring, date, time);
    const timeboxIsntRecording = timeboxRecording.timeboxID == -1;
    const timeboxIsRecording = timeboxRecording.timeboxID == data.id && timeboxRecording.timeboxDate == date;

    function closeModal() {
        dispatch({type: 'modalVisible/set', payload: {visible: false, props: {}}});
    }

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
                recordingDataCopy.timeBox = data
                copyOfOld[scheduleIndex].recordedTimeboxes.push(recordingDataCopy);

                //recordedTimeboxes in timeboxes
                let timeboxIndex = copyOfOld[scheduleIndex].timeboxes.findIndex(element => element.objectUUID == data.objectUUID);
                copyOfOld[scheduleIndex].timeboxes[timeboxIndex].recordedTimeBoxes.push(recordingDataCopy);

                //recordedTimeBoxes in goals
                let goalIndex = copyOfOld[scheduleIndex].goals.findIndex(element => element.id == Number(data.goalID));
                let timeboxGoalIndex = copyOfOld[scheduleIndex].goals[goalIndex].timeboxes.findIndex(element => element.objectUUID == data.objectUUID);
                
                copyOfOld[scheduleIndex].goals[goalIndex].timeboxes[timeboxGoalIndex].recordedTimeBoxes.push(recordingDataCopy);
                return copyOfOld;
            });
            
            
            return { previousSchedule };
        },
        onSuccess: () => {
            closeModal();
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
            
            closeModal();
        }
    });

    async function startRecording() {
        NativeModules.BackgroundWorkManager.startBackgroundWork(JSON.stringify(data), JSON.stringify({id: scheduleID, boxSizeNumber, boxSizeUnit}), new Date().toISOString());
        dispatch({type: 'timeboxRecording/set', payload: {timeboxID: data.id, timeboxDate: date, recordingStartTime: new Date().toISOString()}});
        dispatch(resetActiveOverlayInterval());
    }

    async function stopRecording() {
        NativeModules.BackgroundWorkManager.stopBackgroundWork();
        let recordedStartTime = new Date(timeboxRecording.recordingStartTime);
        dispatch({type: 'timeboxRecording/set', payload: {timeboxID: -1, timeboxDate: 0, recordingStartTime: 0}});
        dispatch(setActiveOverlayInterval());
        let recordingData = {
            recordedStartTime: recordedStartTime, 
            recordedEndTime: new Date(), 
            timeBox: { connect: { id: data.id, objectUUID: data.objectUUID } }, 
            schedule: { connect: { id: scheduleID } },
            objectUUID: uuid.v4(),
        };
        createRecordingMutation.mutate(recordingData);
    }
    
    return (
    <>
        {showEditTimeboxForm ? ( <EditTimeboxForm data={data} previousRecording={!noPreviousRecording} back={() => setShowEditTimeboxForm(false)}></EditTimeboxForm>) : (<>
        <Portal>
            <Dialog style={styles.forms.dialogStyle} visible={props.visible} onDismiss={closeModal}>
                <Dialog.Title style={styles.forms.dialogTitleStyle}>{data.title}</Dialog.Title>
                <Dialog.Content>
                    <Paragraph style={{color: 'white', fontFamily: 'KameronRegular', fontSize: 20}}>
                       {noPreviousRecording ? (`Actions for ${data.title} ${data.isTimeblock ? "timeblock" : "timebox"}`) :
                        ("Timebox and recording comparison")}
                    </Paragraph>
                    {!noPreviousRecording && <TimelineRecording timeboxStart={data.startTime}
                            timeboxEnd={data.endTime}
                            recordingStart={data.recordedTimeBoxes[0].recordedStartTime}
                            recordingEnd={data.recordedTimeBoxes[0].recordedEndTime}></TimelineRecording>}
                </Dialog.Content>
                <Dialog.Actions>
                    {noPreviousRecording && timeboxIsntRecording && <>
                        <Button {...styles.forms.actionButton} mode="contained" onPress={() => setManualEntryModalShown(true)}>Time Entry</Button> 
                        <Button {...styles.forms.actionButton} testID="recordButton" mode="contained" onPress={startRecording}>Record</Button>
                    </>}
                    {noPreviousRecording && timeboxIsRecording && 
                    <Button {...styles.forms.actionButton} mode="contained" onPress={stopRecording}>Stop Recording</Button>}
                    {timeboxIsntRecording && <Button textColor="black" {...styles.forms.actionButton} testID="editTimebox" buttonColor="white" mode="contained" onPress={() => setShowEditTimeboxForm(true)}>Edit</Button>}
                    <Button {...styles.forms.nonActionButton} onPress={closeModal}>Close</Button>
                </Dialog.Actions>
            </Dialog>
            
            {alert.shown && <Alert visible={alert.shown} close={() => setAlert({...alert, shown: false})} title={alert.title} message={alert.message}/> }
        </Portal>
        <ManualEntryTimeModal dispatch={dispatch} visible={manualEntryModalShown} close={() => setManualEntryModalShown(false)} data={data} scheduleID={scheduleID}></ManualEntryTimeModal>
        </>)}
    </>);
}