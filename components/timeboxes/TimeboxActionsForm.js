import { addBoxesToTime, calculateXPPoints, convertToDateTime, recordingNotificationsSetup, thereIsNoRecording } from "../../modules/coreLogic";
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
import useCurrentUser from "../../hooks/useCurrentUser";

export default function TimeboxActionsForm(props) {
    const {data, date, time} = props;
    const [showEditTimeboxForm, setShowEditTimeboxForm] = useState(false);
    const [alert, setAlert] = useState({shown: false, title: "", message: ""});
    const timeboxRecording = useSelector(state => state.timeboxRecording.value);
    const schedule = useSelector(state => state.scheduleEssentials.value);
    const dispatch = useDispatch();
    let user
    const userID = useCurrentUser();
    console.log(userID);
    
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
        let xpGained = calculateXPPoints(data, recordedStartTime, new Date());
        
        axios.post(serverIP+'/addExperience', {points: xpGained, userUUID: userID}).catch(function(error) { console.log(error); });
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
    }
    
    return (
    <>
        {showEditTimeboxForm ? ( <EditTimeboxForm data={data} previousRecording={!noPreviousRecording} close={() => setShowEditTimeboxForm(false)}></EditTimeboxForm>) : (
        <Portal>
            <Dialog style={{backgroundColor: '#C5C27C'}} visible={props.visible} onDismiss={props.close}>
                <Dialog.Title style={{color: 'white'}}>{data.title}</Dialog.Title>
                <Dialog.Content>
                    <Paragraph style={{color: 'white'}}>Actions for "{data.title}" timebox</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button textColor="white" onPress={props.close}>Close</Button>
                    {noPreviousRecording && timeboxIsntRecording && <>
                        <Button textColor="black"  buttonColor="white" mode="contained" onPress={autoRecord}>Complete</Button> 
                        <Button textColor="black"  buttonColor="white" mode="contained" onPress={startRecording}>Record</Button>
                    </>}
                    {noPreviousRecording && timeboxIsRecording && 
                    <Button textColor="black"  buttonColor="white" mode="contained" onPress={stopRecording}>Stop Recording</Button>}
                    {timeboxIsntRecording && <Button textColor="black" style={{marginLeft: 2}} buttonColor="white" mode="contained" onPress={() => setShowEditTimeboxForm(true)}>Edit</Button>}
                    
                </Dialog.Actions>
            </Dialog>
            {alert.shown && <Alert visible={alert.shown} close={() => setAlert({...alert, shown: false})} title={alert.title} message={alert.message}/> }
        </Portal>)}
    </>);
}