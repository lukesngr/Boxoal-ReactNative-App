import { useEffect, useState } from 'react';
import { calculateSizeOfRecordingOverlay } from '../../modules/coreLogic';
import { useSelector } from 'react-redux';
import { View } from 'react-native';
import { set } from '../../redux/activeOverlayInterval';
import dayjs from 'dayjs';
var isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isSameOrBefore)

export default function RecordingOverlay(props) {
    const timeboxRecording = useSelector(state => state.timeboxRecording.value);
    const [recordingOverlayHeight, setRecordingOverlayHeight] = useState(0);
    const {wakeupTime, boxSizeUnit, boxSizeNumber} = useSelector(state => state.scheduleEssentials.value);
    const overlayDimensions = useSelector(state => state.overlayDimensions.value);
    const activeOverlayHeight = useSelector(state => state.activeOverlayHeight.value);
    const [marginFromTop, setMarginFromTop] = useState(overlayDimensions[3]+activeOverlayHeight); 

    let recordingOverlayStyle = {
        backgroundColor: 'red',
        opacity: 0.7,
        zIndex: 999,
        position: 'absolute',
        width: overlayDimensions[0], 
        height: recordingOverlayHeight,
        top: 0,
        transform: [{translateY: marginFromTop}]
    }
    let currentDate = dayjs().date(props.day.date).month(props.day.month-1);
    let startDate = timeboxRecording[2];

    function setRecordingOverlay() {
        const recordingOverlayArray = calculateSizeOfRecordingOverlay(
            wakeupTime, 
            boxSizeUnit, 
            boxSizeNumber, 
            overlayDimensions, 
            activeOverlayHeight, 
            props.day, 
            startDate
        );

        setRecordingOverlayHeight(recordingOverlayArray[0]);
        setMarginFromTop(recordingOverlayArray[1]);
    }

    //console.log(props.day, recordingOverlayHeight, marginFromTop);

    useEffect(() => {
        if(timeboxRecording[0] != -1 && dayjs(startDate).isSameOrBefore(currentDate)) {
            setRecordingOverlay();
            let recordingOverlayInterval = setInterval(() => {
                setRecordingOverlay();
            }, 5000);
        
            return () => {
                clearInterval(recordingOverlayInterval);
            };
        }else{
            setRecordingOverlayHeight("0px");
        }
    }, [timeboxRecording])

    return <View style={recordingOverlayStyle}></View>
}