import { View, Text } from "react-native";
import { useSelector } from "react-redux";
import useRecordedBoxes from "../../hooks/useRecordedBoxes";
import { filterRecordingBasedOnDay } from "../../modules/coreLogic";

export default function RecordedTimeBoxOverlay(props) {
    const onDayView = useSelector(state => state.onDayView.value);
    const {headerWidth} = useSelector(state => state.overlayDimensions.value);
    const {recordedTimeboxes} = useSelector(state => state.scheduleData.value);
    let recordedBoxesForWeek = [];
    let displayedRecordings = [];
    for(let day of props.dayToName) {
        let filteredRecordings = recordedTimeboxes.filter(filterRecordingBasedOnDay(day));
        let recordedBoxes = useRecordedBoxes(filteredRecordings);
        console.log(recordedBoxes, filteredRecordings);
        recordedBoxesForWeek.push(recordedBoxes);
    }

    if(onDayView) {
        displayedRecordings = recordedBoxesForWeek[props.currentDay];
    }else {
        displayedRecordings = recordedBoxesForWeek;
    }
    
    return <>
    {displayedRecordings.map((displayedRecording, index) => {
        let dayIndex = index;
        return (
        <>
            {displayedRecording.map((recordedBox, index) => (
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
        </>)
    })}</>
}