import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";
import { calculatePixelsFromTopOfGridBasedOnTime } from "../../modules/coreLogic";
import dayjs from "dayjs";
import useRecordedBoxes from "../../hooks/useRecordedBoxes";

export default function RecordedTimeBoxOverlay(props) {
    const {headerWidth} = useSelector(state => state.overlayDimensions.value);
    const {recordedTimeboxes} = useSelector(state => state.scheduleData.value);
    let filteredRecordings = recordedTimeboxes.filter(filterRecordingBasedOnDay)
    let recordedBoxes = useRecordedBoxes(filteredRecordings);
    
    return <>{recordedBoxes.map((recordedBox, index) => (
        <View key={index} style={{
            width: headerWidth, 
            height: recordedBox.heightForBox, 
            transform: [{translateY: recordedBox.marginFromTop}, {translateX: headerWidth*props.index}],
            backgroundColor: 'red',
            opacity: 0.7,
            zIndex: 999,
            position: 'absolute'
        }}>
            <Text>{recordedBox.title}</Text>
        </View>
    ))}</>
}