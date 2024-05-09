import { useEffect, useState } from 'react';
import { calculateSizeOfRecordingOverlay } from '../../modules/coreLogic';
import { useSelector } from 'react-redux';
import { View } from 'react-native';

export default function RecordingOverlay() {
    const timeboxRecording = useSelector(state => state.timeboxRecording.value);
    const [recordingOverlayHeight, setRecordingOverlayHeight] = useState(0);
    const {wakeupTime, boxSizeUnit, boxSizeNumber} = useSelector(state => state.scheduleEssentials.value);
    const overlayDimensions = useSelector(state => state.overlayDimensions.value);
    const activeOverlayHeight = useSelector(state => state.activeOverlayHeight.value);

    let recordingOverlayStyle = {
        backgroundColor: 'red',
        opacity: 0.7,
        zIndex: 997,
        position: 'absolute',
        width: '100%',
        width: overlayDimensions[0]+"px", 
        height: recordingOverlayHeight,
        transform: `translate(-3px, ${activeOverlayHeight+3}px)`
    }

    useEffect(() => {
        if(timeboxRecording[0] != -1) {
            let recordingOverlayInterval = setInterval(() => {
                setRecordingOverlayHeight(calculateSizeOfRecordingOverlay(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions, activeOverlayHeight));
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