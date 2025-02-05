import notifee, {EventType} from '@notifee/react-native';
import { Alert, NativeModules } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setActiveOverlayInterval, resetActiveOverlayInterval } from "../redux/activeOverlayInterval";
import axios from 'axios';
import { queryClient } from '../App';
import serverIP from "./serverIP";

export async function initialNotificationSetup() {
    await notifee.requestPermission()

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'boxoal',
      name: 'boxoal notification channel',
    });
}

export function recordIfNotificationPressed(dispatch, routeParams) {
    if(Object.hasOwn(routeParams, 'timeboxID')) {
        let { timeboxID, scheduleID, recordingStartTime } = routeParams;
        timeboxID = parseInt(timeboxID);
        scheduleID = parseInt(scheduleID);
        dispatch({type: 'timeboxRecording/set', payload: {timeboxID: -1, timeboxDate: 0, recordingStartTime: 0}});
        dispatch(setActiveOverlayInterval());
        axios.post(serverIP+'/createRecordedTimebox', 
            {recordedStartTime: recordingStartTime, recordedEndTime: new Date(), timeBox: {connect: {id: timeboxID}}, schedule: {connect: {id: scheduleID}}},
            {headers: { 'Origin': 'http://localhost:3000' }}
        ).then(() => {
            queryClient.refetchQueries();
            Alert.alert("Timebox", "Added recorded timebox");
        }).catch(function(error) {
            Alert.alert("Error", "An error occurred, please try again or contact the developer");
            console.log(error); 
        })
        NativeModules.BackgroundWorkManager.stopBackgroundWork(); 
    }
}