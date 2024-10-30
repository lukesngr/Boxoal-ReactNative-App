import { View, Text } from "react-native";
import { useSelector } from "react-redux";
import useRecordedBoxes from "../../hooks/useRecordedBoxesForWeek";
import { filterRecordingBasedOnDay } from "../../modules/coreLogic";
import { useEffect, useMemo } from "react";

export default function RecordedTimeBoxOverlay(props) {
    const onDayView = useSelector(state => state.onDayView.value);
    const daySelected = useSelector(state => state.daySelected.value);
    const {headerWidth} = useSelector(state => state.overlayDimensions.value);
    const {recordedTimeboxes} = useSelector(state => state.scheduleData.value);
    let displayedRecordings = [];
    let recordedBoxesForWeek = useRecordedBoxes(props.dayToName, recordedTimeboxes);

    if(onDayView) {
        displayedRecordings = [recordedBoxesForWeek[daySelected]];
        
    }else {
        displayedRecordings = recordedBoxesForWeek;
    }
    
    
    return (
    <View style={{position: 'absolute', transform: [{translateX: 50}], zIndex: 999}}>
    {displayedRecordings.map((displayedRecording, index) => {
        let dayIndex = index;
        return (
        <View key={index}>
            {displayedRecording.length > 0 && displayedRecording.map((recordedBox, index) => (
                <View key={index} style={{
                    width: headerWidth, 
                    height: recordedBox.recordingBoxHeight, 
                    transform: [{translateY: recordedBox.marginToRecording}, {translateX: headerWidth*dayIndex}],
                    backgroundColor: 'red',
                    opacity: 0.7,
                    zIndex: 999,
                    position: 'absolute'
                }}>
                    <Text>{recordedBox.title}</Text>
                </View>
                ))
            }
        </View>)
    })}
    </View>)
}