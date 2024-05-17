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
    const [marginFromTop, setMarginFromTop] = useState(activeOverlayHeight); 

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
    console.log(timeboxRecording);
    let startDate = timeboxRecording[2];

    useEffect(() => {
        if(timeboxRecording[0] != -1 && dayjs(timeboxRecording[2]).isSameOrBefore(currentDate)) {
            console.log("yes")
            let recordingOverlayInterval = setInterval(() => {
                const [overlayHeight, topMargin] = calculateSizeOfRecordingOverlay(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions, activeOverlayHeight, props.day, startDate);
                setRecordingOverlayHeight(overlayHeight);
                setMarginFromTop(topMargin);
            }, 5000);
        
            return () => {
                clearInterval(recordingOverlayInterval);
            };
        }else{
            setRecordingOverlayHeight("0px");
        }
    }, [timeboxRecording])

    return (
        <>
            {timeboxRecording[0] != -1 && 
            <View style={recordingOverlayStyle}></View>}
        </>
    )
}