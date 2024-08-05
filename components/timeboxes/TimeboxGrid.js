import { useDispatch, useSelector } from "react-redux";
import { getArrayOfDayDateDayNameAndMonthForHeaders, getCurrentDay, ifEqualOrBeyondCurrentDay } from "../../modules/dateLogic";
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
import RecordedTimeBoxOverlay from "../overlay/RecordedTimeBoxOverlay";
import { styles } from "../../styles/styles";
import GridHeader from "./GridHeader";
import GridBody from "./GridBody";


export default function TimeboxGrid(props) {
    const selectedDate = useSelector(state => state.selectedDate.value);
    const selectedSchedule = useSelector(state => state.selectedSchedule.value);
    const schedule = props.data[selectedSchedule];
    const dayToName = getArrayOfDayDateDayNameAndMonthForHeaders(selectedDate); //get all info to make headers look nice
    const listOfTimes = returnTimesSeperatedForSchedule(schedule); //get times that go down each row
    useTimeboxGridRedux(schedule, selectedDate); //make a map for the timeboxes with another map inside it, makes lookup fast
    useScheduleSetter(schedule); //set schedule data to redux store (timeboxes, recordedTimeboxes, goals
    useActiveOverlay(schedule);
    return (
    <ScrollView>
        <View style={styles.overallView}>
            <View style={{flexDirection: 'row'}}>
                <GridHeader dayToName={dayToName}></GridHeader>
            </View>
            <View style={{flexDirection: 'column'}}>
                {listOfTimes.map((time, index) => {
                    return <GridBody key={index} time={time} dayToName={dayToName}></GridBody>
                })}
            </View>
            <View style={{position: 'absolute', transform: [{translateX: 50}], zIndex: 999}}>
            {dayToName.map((day, index) => {
                    return <RecordedTimeBoxOverlay key={index} index={index} day={day}></RecordedTimeBoxOverlay>
            })}
            </View>
        </View>
    </ScrollView>
    )
}