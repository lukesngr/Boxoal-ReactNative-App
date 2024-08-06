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
import { set } from "../../redux/activeOverlayInterval";

export default function GridHeader(props) {
    const [headerHeight, setHeaderHeight] = useState(0);
    const [headerWidth, setHeaderWidth] = useState(0);
    const [dayToName, setDayToName] = useState(props.dayToName);
    const [headerFontsize, setHeaderFontsize] = useState(16);
    const onDayView = useSelector(state => state.onDayView.value);
    let currentDay = getCurrentDay();
    useOverlayDimensions(headerHeight, headerWidth);

    useEffect(() => {
        if(onDayView) {
            setDayToName([dayToName[currentDay]]); 
            setHeaderFontsize(18);
        }else{
            setDayToName(props.dayToName);
            setHeaderFontsize(16);
        }
    }, [onDayView])
    

    return (<>
        <View style={styles.timeboxCell}></View>
        {dayToName.map((day, index) => {
            return (<>
            <View key={day.day} style={{backgroundColor: day.day == currentDay ? 'black' :  'white', ...styles.timeboxCell}}
                        onLayout={(event) => {
                            if(index == 0) {
                                setHeaderHeight(event.nativeEvent.layout.height);
                                setHeaderWidth(event.nativeEvent.layout.width);
                            }
                        }}>
                <Text style={{fontSize: 16, color: day.day == currentDay ? 'black' :  'white'}}>{day.name+" ("+day.date+"/"+day.month+")"}</Text>
                {day.day == currentDay && <ActiveOverlay></ActiveOverlay>}
                {day.day < currentDay && <Overlay></Overlay>}
                <RecordingOverlay day={day}></RecordingOverlay>
            </View></>)
        })}
    </>)
}