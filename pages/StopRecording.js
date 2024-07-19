import {useDispatch} from 'react-redux';
import axios from 'axios';
import {Text} from 'react-native';
import { recordIfNotificationPressed } from '../modules/coreLogic';

export default function StopRecording({ navigation, route }) {
    const { timeboxID, scheduleID, recordingStartTime } = route.params;
    recordIfNotificationPressed(timeboxID, scheduleID, recordingStartTime, useDispatch());
    navigation.navigate('FinalView');
    
    return <></>
}