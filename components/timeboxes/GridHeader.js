import { Text, View } from "react-native";
import ActiveOverlay from "../overlay/ActiveOverlay";
import RecordingOverlay from "../overlay/RecordingOverlay";
import { ifCurrentDay, ifEqualOrBeyondCurrentDay } from "../../modules/dateLogic";
import Overlay from "../overlay/Overlay";
import { getCurrentDay } from "../../modules/dateLogic";
import { useState } from "react";
import { useSelector } from "react-redux";
import useOverlayDimensions from "../../hooks/useOverlayDimensions";
import { styles } from "../../styles/styles";

export default function GridHeader(props) {
    const [headerHeight, setHeaderHeight] = useState(0);
    const [headerWidth, setHeaderWidth] = useState(0);
    const onDayView = useSelector(state => state.onDayView.value);
    let dayToName = props.dayToName;
    let currentDay = getCurrentDay()
    let overridingStyles = [{}, {}];
    useOverlayDimensions(headerHeight, headerWidth); //calculate overlay dimensions

    if(onDayView) {
        dayToName = [dayToName[currentDay]]; 
        overridingStyles = [{width: 49}, {fontSize: 25}];
    } 

    return (<>
        <View style={{...styles.timeboxCell}}></View>
        {dayToName.map((day, index) => {
            return (<>
            
            <View key={day.day} style={{backgroundColor: ifCurrentDay(day.day, 'black', 'white'), ...styles.timeboxCell}}
                        onLayout={(event) => {
                            if(index == 0) {
                                setHeaderHeight(event.nativeEvent.layout.height);
                                setHeaderWidth(event.nativeEvent.layout.width);
                            }
                        }}>
                <Text style={{fontSize: 16, color: ifCurrentDay(day.day, 'white', 'black'), ...overridingStyles[1]}}>{day.name+" ("+day.date+"/"+day.month+")"}</Text>
                {ifCurrentDay(day.day, true, false) && <ActiveOverlay></ActiveOverlay>}
                {ifEqualOrBeyondCurrentDay(day.day, false, true) && <Overlay></Overlay>}
                <RecordingOverlay day={day}></RecordingOverlay>
            </View></>)
        })}
    </>)
}