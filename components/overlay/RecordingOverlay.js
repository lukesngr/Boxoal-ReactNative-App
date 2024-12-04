import { useEffect, useState } from 'react';
import { calculateSizeOfRecordingOverlay } from '../../modules/coreLogic';
import { useSelector } from 'react-redux';
import { View } from 'react-native';
import { set } from '../../redux/activeOverlayInterval';
import dayjs from 'dayjs';
var isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isSameOrBefore)

export default function RecordingOverlay(props) {
    const {recordingStartTime, timeboxID} = useSelector(state => state.timeboxRecording.value);
    const {wakeupTime, boxSizeUnit, boxSizeNumber} = useSelector(state => state.scheduleEssentials.value);
    const overlayDimensions = useSelector(state => state.overlayDimensions.value);
    const activeOverlayHeight = useSelector(state => state.activeOverlayHeight.value);
    const [marginFromTop, setMarginFromTop] = useState(overlayDimensions.headerHeight+activeOverlayHeight); 
    const [recordingOverlayHeight, setRecordingOverlayHeight] = useState(0);
    let currentDate = dayjs();
    let overlayDate = currentDate.date(props.day.date).month(props.day.month-1);

    function setRecordingOverlay() {
        const recordingOverlayArray = calculateSizeOfRecordingOverlay(
            wakeupTime, 
            boxSizeUnit, 
            boxSizeNumber, 
            overlayDimensions, 
            activeOverlayHeight, 
            props.day, 
            recordingStartTime
        );

        setRecordingOverlayHeight(recordingOverlayArray[0]);
        setMarginFromTop(recordingOverlayArray[1]);
    }

    useEffect(() => {
        if(timeboxID != -1 && dayjs(recordingStartTime).isSameOrBefore(overlayDate) && overlayDate.isSameOrBefore(currentDate)) {
            setRecordingOverlay();
            let recordingOverlayInterval = setInterval(() => setRecordingOverlay(), 5000);
            return () => clearInterval(recordingOverlayInterval);
        }else{
            setRecordingOverlayHeight("0px");
        }
    }, [timeboxID]);

    return <View style={{
        backgroundColor: 'red',
        opacity: 0.7,
        zIndex: 999,
        position: 'absolute',
        width: overlayDimensions.headerWidth, 
        height: recordingOverlayHeight,
        top: 0,
        transform: [{translateY: marginFromTop}]}}>
        </View>
}