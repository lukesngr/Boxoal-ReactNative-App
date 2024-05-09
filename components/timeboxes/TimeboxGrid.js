import { useDispatch, useSelector } from "react-redux";
import { getArrayOfDayDateDayNameAndMonthForHeaders, ifEqualOrBeyondCurrentDay } from "../../modules/dateLogic";
import { returnTimesSeperatedForSchedule } from "../../modules/timeLogic";
import useTimeboxGridRedux from "../../hooks/useTimeboxGridRedux";
import { useScheduleSetter } from "../../hooks/useScheduleSetter";
import { View, Text, ScrollView } from "react-native";
import Timebox from "./Timebox";
import { ifCurrentDay } from "../../modules/dateLogic";
import { useState } from "react";
import useOverlayDimensions from "../../hooks/useOverlayDimensions";
import Overlay from "../overlay/Overlay";
import ActiveOverlay from "../overlay/ActiveOverlay";
import useActiveOverlay from "../../hooks/useActiveOverlay";
import RecordingOverlay from "../overlay/RecordingOverlay";

export default function TimeboxGrid(props) {
    const [headerHeight, setHeaderHeight] = useState(0);
    const [headerWidth, setHeaderWidth] = useState(0);
    const selectedDate = useSelector(state => state.selectedDate.value);
    const selectedSchedule = useSelector(state => state.selectedSchedule.value);
    const schedule = props.data[selectedSchedule];
    const dayToName = getArrayOfDayDateDayNameAndMonthForHeaders(selectedDate); //get all info to make headers look nice
    const listOfTimes = returnTimesSeperatedForSchedule(schedule); //get times that go down each row

    useTimeboxGridRedux(schedule, selectedDate); //make a map for the timeboxes with another map inside it, makes lookup fast
    useScheduleSetter(schedule); //set schedule data to redux store (timeboxes, recordedTimeboxes, goals
    useOverlayDimensions(headerHeight, headerWidth); //calculate overlay dimensions
    useActiveOverlay(schedule);
    return (
    <ScrollView>
        <View style={{marginLeft: 4, marginRight: 4}}>
            <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', borderColor: 'black', borderWidth: 1, padding: 1}}></View>
                {dayToName.map((day, index) => {
                    return (
                    <View key={index} style={{flex: 1, justifyContent: 'center', alignItems: 'center', borderColor: 'black', 
                        borderWidth: 1, padding: 1, backgroundColor: ifCurrentDay(index, 'black', 'white')}}
                                onLayout={(event) => {
                                    if(index == 0) {
                                        setHeaderHeight(event.nativeEvent.layout.height);
                                        setHeaderWidth(event.nativeEvent.layout.width);
                                    }
                                }}>
                        <Text style={{fontSize: 16, color: ifCurrentDay(index, 'white', 'black')}}>{day.name+" ("+day.date+"/"+day.month+")"}</Text>
                        {ifCurrentDay(index, true, false) ? (<>
                                <ActiveOverlay></ActiveOverlay>
                                <RecordingOverlay></RecordingOverlay>
                            </>) : (<Overlay notActive={ifEqualOrBeyondCurrentDay(index, true, false)}></Overlay>)}
                    </View>)
                })}
            </View>
            <View style={{flexDirection: 'column', elevation: 2}}>
                {listOfTimes.map((time, index) => {
                    return <View key={index} style={{flexDirection: 'row'}}>
                        <View style={{borderWidth: 1, padding: 1}}>
                            <Text style={{fontSize: 18, color: 'black', width: 46}}>{time}</Text>
                        </View>
                        {dayToName.map((day, index) => {
                            return <Timebox key={index} day={day} time={time} index={index}></Timebox>
                        })}
                    </View>
                })}
                
            </View>
        </View>
    </ScrollView>
    )
}