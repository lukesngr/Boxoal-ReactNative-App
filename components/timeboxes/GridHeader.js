import { Text, View } from "react-native";
import ActiveOverlay from "../overlay/ActiveOverlay";
import RecordingOverlay from "../overlay/RecordingOverlay";
import { ifCurrentDay, ifEqualOrBeyondCurrentDay } from "../../modules/dateLogic";
import Overlay from "../overlay/Overlay";
import { getCurrentDay } from "../../modules/dateLogic";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useOverlayDimensions from "../../hooks/useOverlayDimensions";
import { styles } from "../../styles/styles";

export default function GridHeader(props) {
    const [headerHeight, setHeaderHeight] = useState(0);
    const [headerWidth, setHeaderWidth] = useState(0);
    const [dayToName, setDayToName] = useState(props.dayToName);
    const [headerFontsize, setHeaderFontsize] = useState(16);
    const onDayView = useSelector(state => state.onDayView.value);
    let currentDay = getCurrentDay();
    useOverlayDimensions(headerHeight, headerWidth, onDayView);

    function getStyle(day) {
        if(!onDayView) {
            if(day.day == currentDay) {
                return {backgroundColor: 'black', color: 'white'};
            }else{
                return {backgroundColor: 'white', color: 'black'};
            }
        }else {
            return {backgroundColor: 'white', color: 'black'};
        }
        
    }

    useEffect(() => {
        if(onDayView) {
            if(dayToName.length > 1) {setDayToName([dayToName[currentDay]]); }
            setHeaderFontsize(25);
        }else{
            setDayToName(props.dayToName);
            setHeaderFontsize(16);
        }
    }, [onDayView])
    

    return (<>
        <View style={{borderColor: onDayView ? 'white' : 'black', backgroundColor: 'white', borderWidth: 1, padding: 1, width: styles.timeTextOverallWidth}}></View>
        {dayToName.map((day, index) => {
            return (<>
            <View key={day.day} style={{...styles.timeboxCell, backgroundColor: getStyle(day).backgroundColor, }}
                        onLayout={(event) => {
                            if(index == 0) {
                                setHeaderHeight(event.nativeEvent.layout.height);
                                setHeaderWidth(event.nativeEvent.layout.width);
                            }
                        }}>
                <Text style={{fontSize: headerFontsize, color: getStyle(day).color}}>{day.name+" ("+day.date+"/"+day.month+")"}</Text>
                {day.day == currentDay && <ActiveOverlay></ActiveOverlay>}
                {day.day < currentDay && <Overlay></Overlay>}
                <RecordingOverlay day={day}></RecordingOverlay>
            </View></>)
        })}
    </>)
}