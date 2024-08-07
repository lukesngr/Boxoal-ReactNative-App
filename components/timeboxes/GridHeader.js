import { Text, View } from "react-native";
import ActiveOverlay from "../overlay/ActiveOverlay";
import RecordingOverlay from "../overlay/RecordingOverlay";
import Overlay from "../overlay/Overlay";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useOverlayDimensions from "../../hooks/useOverlayDimensions";
import { styles } from "../../styles/styles";
import { goToDay } from "../../modules/coreLogic";
import { IconButton } from "react-native-paper";

export default function GridHeader(props) {
    const dispatch = useDispatch();
    const onDayView = useSelector(state => state.onDayView.value);
    const daySelected = useSelector(state => state.daySelected.value);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [headerWidth, setHeaderWidth] = useState(0);
    useOverlayDimensions(headerHeight, headerWidth, onDayView);
    let dayToName = onDayView ? [props.dayToName[daySelected]] : props.dayToName;
    let headerFontsize = onDayView ? 23 : 16;
    
    function getStyle(day) {
        if(!onDayView) {
            if(day.day == daySelected) {
                return {backgroundColor: 'black', color: 'white'};
            }else{
                return {backgroundColor: 'white', color: 'black'};
            }
        }else {
            return {backgroundColor: 'white', color: 'black'};
        }
    }

    return (
        <View style={{flexDirection: 'row'}}>
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
                    {onDayView && 
                    <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                        <IconButton icon="menu-left" size={40} onPress={() => goToDay(dispatch, daySelected, 'left')}></IconButton>
                        <Text style={{marginLeft: 20, marginRight: 20, fontSize: headerFontsize, color: getStyle(day).color}}>{day.name+" ("+day.date+"/"+day.month+")"}</Text>
                        <IconButton icon="menu-right" size={40} onPress={() => goToDay(dispatch, daySelected, 'right')}></IconButton>
                    </View>}
                    {!onDayView && <Text style={{fontSize: headerFontsize, color: getStyle(day).color}}>{day.name+" ("+day.date+"/"+day.month+")"}</Text>}
                    {day.day == props.currentDay && <ActiveOverlay></ActiveOverlay>}
                    {day.day < props.currentDay && <Overlay></Overlay>}
                    <RecordingOverlay day={day}></RecordingOverlay>
                </View></>)
            })}
        </View>)
}