import { addBoxesToTime, convertToDateTime, recordingNotificationsSetup, thereIsNoRecording } from "../../modules/coreLogic";
import axios from 'axios';
import { queryClient } from '../../App';
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveOverlayInterval, resetActiveOverlayInterval } from "../../redux/activeOverlayInterval";
import { NativeModules, Pressable } from "react-native";
import serverIP from "../../modules/serverIP";
import { Button } from "react-native-paper";
import EditTimeboxForm from "./EditTimeboxForm";
import Alert from "../Alert";
import { Dialog, Paragraph, Portal } from "react-native-paper";

export default function TimeboxActionsForm(props) {
    const {data, date, time} = props;
    const [showEditTimeboxForm, setShowEditTimeboxForm] = useState(false);
    const [alert, setAlert] = useState({shown: false, title: "", message: ""});
    const timeboxRecording = useSelector(state => state.timeboxRecording.value);
    const schedule = useSelector(state => state.scheduleEssentials.value);
    const dispatch = useDispatch();
    
    const noPreviousRecording = thereIsNoRecording(data.recordedTimeBoxes, data.reoccuring, date, time);
    const timeboxIsntRecording = timeboxRecording.timeboxID == -1;
    const timeboxIsRecording = timeboxRecording.timeboxID == data.id && timeboxRecording.timeboxDate == date;

    async function startRecording() {
        NativeModules.BackgroundWorkManager.startBackgroundWork(JSON.stringify(data), JSON.stringify(schedule), new Date().toISOString());
        dispatch({type: 'timeboxRecording/set', payload: {timeboxID: data.id, timeboxDate: date, recordingStartTime: new Date().toISOString()}});
        dispatch(resetActiveOverlayInterval());
    }

    function stopRecording() {
        NativeModules.BackgroundWorkManager.stopBackgroundWork();
        let recordedStartTime = new Date(timeboxRecording.recordingStartTime);
        dispatch({type: 'timeboxRecording/set', payload: {timeboxID: -1, timeboxDate: 0, recordingStartTime: 0}});
        dispatch(setActiveOverlayInterval());
        axios.post(serverIP+'/createRecordedTimebox', {
            recordedStartTime: recordedStartTime, 
            recordedEndTime: new Date(), 
            timeBox: {connect: {id: data.id}}, 
            schedule: {connect: {id: schedule.id}}},
        ).then(async () => {
            props.close();
            setAlert({shown: true, title: "Timebox", message: "Added recorded timebox!"});
            await queryClient.refetchQueries();
        }).catch(function(error) {
            props.close();
            setAlert({shown: true, title: "Error", message: "An error occurred, please try again or contact the developer"});
            console.log(error); 
        })  
    }

    function autoRecord() {
        axios.post(serverIP+'/createRecordedTimebox', {
            recordedStartTime: data.startTime, 
            recordedEndTime: data.endTime,
            timeBox: {connect: {id: data.id}}, 
            schedule: {connect: {id: schedule.id}}
        }).then(async () => {
            props.close();
            setAlert({shown: true, title: "Timebox", message: "Added recorded timebox!"});
            await queryClient.refetchQueries();
        }).catch(function(error) {
            props.close();
            setAlert({shown: true, title: "Error", message: "An error occurred, please try again or contact the developer"});
            console.log(error); 
        })  
    }// data={data} previousRecording={!noPreviousRecording}
    
    return (
    <>
        {showEditTimeboxForm ? ( <Pressable onPress={() => setShowEditTimeboxForm(false)}></Pressable>) : (
        <Portal>
            <Dialog style={{backgroundColor: '#C5C27C'}} visible={props.visible} onDismiss={props.close}>
                <Dialog.Title style={{color: 'white'}}>{data.title}</Dialog.Title>
                <Dialog.Content>
                    <Paragraph style={{color: 'white'}}>Actions for "{data.title}" timebox</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                    {noPreviousRecording && timeboxIsntRecording && <>
                        <Button textColor="white" onPress={autoRecord}>Complete</Button> 
                        <Button textColor="black"  buttonColor="white" mode="contained" onPress={startRecording}>Record</Button>
                    </>}
                    {noPreviousRecording && timeboxIsRecording && 
                    <Button textColor="black"  buttonColor="white" mode="contained" onPress={stopRecording}>Stop Recording</Button>}
                    {timeboxIsntRecording && <Button textColor="black"  buttonColor="white" mode="contained" onPress={() => setShowEditTimeboxForm(true)}>Edit</Button>}
                    
                </Dialog.Actions>
            </Dialog>
            {alert.shown && <Alert visible={alert.shown} close={() => setAlert({...alert, shown: false})} title={alert.title} message={alert.message}/> }
        </Portal>)}
    </>);
}