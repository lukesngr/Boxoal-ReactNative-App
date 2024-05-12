import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";
import { calculatePixelsFromTopOfGridBasedOnTime } from "../../modules/coreLogic";

export default function RecordedTimeBoxOverlay(props) {
    const [recordedBoxes, setRecordedBoxes] = useState([]);
    const {wakeupTime, boxSizeUnit, boxSizeNumber} = useSelector(state => state.scheduleEssentials.value);
    const overlayDimensions = useSelector(state => state.overlayDimensions.value);
    const {recordedTimeboxes} = useSelector(state => state.scheduleData.value);

    let data = recordedTimeboxes.filter(function(obj) {
        let recordedStartTime = new Date(obj.recordedStartTime);
        return (recordedStartTime.getMonth()+1) == props.day.month && (recordedStartTime.getDate()) == props.day.date;
    })

    useEffect(() => {
        setRecordedBoxes([]) //so deleted recordings don't get stuck
        if(data.length > 0) {
            let normalArrayFromState = [...recordedBoxes];
            data.forEach(element => {
                let fieldsForCalculation = [wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions];
                let marginFromTop = calculatePixelsFromTopOfGridBasedOnTime(...fieldsForCalculation, new Date(element.recordedStartTime));
                let heightForBox = calculatePixelsFromTopOfGridBasedOnTime(...fieldsForCalculation, new Date(element.recordedEndTime)) - marginFromTop;
                if(heightForBox < 30) {
                    heightForBox = 30;
                }//reasonable value which alllows it is visible
                let notEitherZero = !(marginFromTop == 0 || heightForBox == 0); //due to overlay dimensions not being set at right time
                if(notEitherZero && !normalArrayFromState.some(item => item.id === element.id)) {
                    normalArrayFromState.push({timeBox: element.timeBox, id: element.id, heightForBox, marginFromTop, title: element.timeBox.title});
                }
            });
            setRecordedBoxes(normalArrayFromState);
        }
    }, [recordedTimeboxes]);
    
    return <>{recordedBoxes.map((recordedBoxes, index) => (
        <>
        <View key={index} style={{width: overlayDimensions[0], 
            height: recordedBoxes.heightForBox, 
            transform: [{translateY: recordedBoxes.marginFromTop}],
            backgroundColor: 'red',
            opacity: 0.7,
            zIndex: 999,
            position: 'absolute'}}>
        <Text>{recordedBoxes.title}</Text></View>
        </>
    ))}</>
}