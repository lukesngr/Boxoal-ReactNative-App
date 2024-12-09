import { useSelector } from "react-redux";
import { getArrayOfDayDateDayNameAndMonthForHeaders } from "../../modules/dateCode";
import { getCurrentDay } from "../../modules/untestableFunctions";
import { returnTimesSeperatedForSchedule } from "../../modules/formatters";
import useTimeboxGridRedux from "../../hooks/useTimeboxGridRedux";
import { useScheduleSetter } from "../../hooks/useScheduleSetter";
import { View, ScrollView } from "react-native";
import useActiveOverlay from "../../hooks/useActiveOverlay";
import RecordedTimeBoxOverlay from "../overlay/RecordedTimeBoxOverlay";
import { styles } from "../../styles/styles";
import GridHeader from "./GridHeader";
import GridBody from "./GridBody";
import { useDaySelected } from "../../hooks/useDaySelected";
import CorrectModalDisplayer from "../modals/CorrectModalDisplayer";
import { filterTimeboxesBasedOnWeekRange } from "../../modules/dateCode";


export default function TimeboxGrid(props) {
    const selectedDate = useSelector(state => state.selectedDate.value);
    const selectedSchedule = useSelector(state => state.selectedSchedule.value);
    const profile = useSelector(state => state.profile.value);
    let schedule = props.data[selectedSchedule];
    schedule.timeboxes = filterTimeboxesBasedOnWeekRange(schedule.timeboxes, selectedDate); //filter timeboxes based on week range
    const dayToName = getArrayOfDayDateDayNameAndMonthForHeaders(selectedDate); //get all info to make headers look nice
    const listOfTimes = returnTimesSeperatedForSchedule(profile); //get times that go down each row
    let currentDay = getCurrentDay();
    useTimeboxGridRedux(schedule, selectedDate); //make a map for the timeboxes with another map inside it, makes lookup fast
    useScheduleSetter(schedule); //set schedule data to redux store (timeboxes, recordedTimeboxes, goals
    useActiveOverlay(schedule);
    useDaySelected(currentDay);

    return (
    <ScrollView>
        <View style={styles.overallView}>
            <GridHeader currentDay={currentDay} dayToName={dayToName}></GridHeader>
            <CorrectModalDisplayer></CorrectModalDisplayer>
            <View style={{flexDirection: 'column'}}>
                {listOfTimes.map((time, index) => {
                    return <GridBody key={index} currentDay={currentDay} time={time} dayToName={dayToName}></GridBody>
                })}
            </View>
            <RecordedTimeBoxOverlay currentDay={currentDay} dayToName={dayToName}></RecordedTimeBoxOverlay>
        </View>
    </ScrollView>
    )
}