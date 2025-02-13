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

export default function TimeboxActionsForm(props) {
    const {data, date, time} = props;
    const [manualEntryModalShown, setManualEntryModalShown] = useState(false);
    const [showEditTimeboxForm, setShowEditTimeboxForm] = useState(false);
    const [alert, setAlert] = useState({shown: false, title: "", message: ""});
    const {user} = useAuthenticator();
    const timeboxRecording = useSelector(state => state.timeboxRecording.value);
    const {boxSizeUnit, boxSizeNumber, scheduleID} = useSelector(state => state.profile.value);
    const dispatch = useDispatch();
    
    const noPreviousRecording = thereIsNoRecording(data.recordedTimeBoxes, data.reoccuring, date, time);
    const timeboxIsntRecording = timeboxRecording.timeboxID == -1;
    const timeboxIsRecording = timeboxRecording.timeboxID == data.id && timeboxRecording.timeboxDate == date;

    function closeModal() {
        dispatch({type: 'modalVisible/set', payload: {visible: false, props: {}}});
    }

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
        axios.post(serverIP+'/createRecordedTimebox', {
            recordedStartTime: recordedStartTime, 
            recordedEndTime: new Date(), 
            timeBox: {connect: {id: data.id}}, 
            schedule: {connect: {id: scheduleID}}},
        ).then(async () => {
            closeModal();
            setAlert({shown: true, title: "Timebox", message: "Added recorded timebox!"});
            await queryClient.refetchQueries();
        }).catch(function(error) {
            closeModal();
            setAlert({shown: true, title: "Error", message: "An error occurred, please try again or contact the developer"});
            console.log(error); 
        })  
    }
    
    return (
    <>
        {showEditTimeboxForm ? ( <EditTimeboxForm data={data} previousRecording={!noPreviousRecording} close={closeModal}></EditTimeboxForm>) : (
        <Portal>
            <Dialog style={{backgroundColor: '#C5C27C'}} visible={props.visible} onDismiss={closeModal}>
                <Dialog.Title style={{color: 'white'}}>{data.title}</Dialog.Title>
                <Dialog.Content>
                    <Paragraph style={{color: 'white'}}>Actions for "{data.title}" timebox</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button textColor="white" onPress={closeModal}>Close</Button>
                    {noPreviousRecording && timeboxIsntRecording && <>
                        <Button textColor="black"  buttonColor="white" mode="contained" style={{marginRight: 2}} onPress={() => setManualEntryModalShown(true)}>Time Entry</Button> 
                        <Button textColor="black"  buttonColor="white" testID="recordButton" mode="contained" onPress={startRecording}>Record</Button>
                    </>}
                    {noPreviousRecording && timeboxIsRecording && 
                    <Button textColor="black"  buttonColor="white" mode="contained" onPress={stopRecording}>Stop Recording</Button>}
                    {timeboxIsntRecording && <Button textColor="black" style={{marginLeft: 2}} buttonColor="white" mode="contained" onPress={() => setShowEditTimeboxForm(true)}>Edit</Button>}
                    
                </Dialog.Actions>
            </Dialog>
            <ManualEntryTimeModal dispatch={dispatch} visible={manualEntryModalShown} close={() => setManualEntryModalShown(false)} data={data} scheduleID={scheduleID}></ManualEntryTimeModal>
            {alert.shown && <Alert visible={alert.shown} close={() => setAlert({...alert, shown: false})} title={alert.title} message={alert.message}/> }
        </Portal>)}
    </>);
}