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
    useOverlayDimensions(headerHeight, headerWidth); 
    let dayToName = props.dayToName;
    let currentDay = dayToName[getCurrentDay()];
    const onDayView = useSelector(state => state.onDayView.value);

    return (
    <>
        <View style={styles.timeboxCell}></View>
        {onDayView && 
            <View key={currentDay.day} style={{backgroundColor: 'black', ...styles.timeboxCell}} 
            onLayout={(event) => {setHeaderHeight(event.nativeEvent.layout.height); setHeaderWidth(event.nativeEvent.layout.width);}}>
                <Text style={{fontSize: 25, color: 'white'}}>{currentDay.name+" ("+currentDay.date+"/"+currentDay.month+")"}</Text>
                <ActiveOverlay></ActiveOverlay>
                <Overlay></Overlay>
                <RecordingOverlay day={currentDay}></RecordingOverlay>
            </View>
        }
        {!onDayView && dayToName.map((day, index) => 
            (<View key={day.day} style={{backgroundColor: ifCurrentDay(day.day, 'black', 'white'), ...styles.timeboxCell}}
                        onLayout={(event) => {
                            if(index == 0) {
                                setHeaderHeight(event.nativeEvent.layout.height);
                                setHeaderWidth(event.nativeEvent.layout.width);
                            }
                        }}>
                <Text style={{fontSize: 16, color: ifCurrentDay(day.day, 'white', 'black')}}>{day.name+" ("+day.date+"/"+day.month+")"}</Text>
                {ifCurrentDay(day.day, true, false) && <ActiveOverlay></ActiveOverlay>}
                {ifEqualOrBeyondCurrentDay(day.day, false, true) && <Overlay></Overlay>}
                <RecordingOverlay day={day}></RecordingOverlay>
            </View>)
        )}
    </>)
}