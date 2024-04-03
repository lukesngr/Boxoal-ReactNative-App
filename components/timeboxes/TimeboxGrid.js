import { useSelector } from "react-redux";
import { getArrayOfDayDateDayNameAndMonthForHeaders } from "../../modules/dateLogic";
import { returnTimesSeperatedForSchedule } from "../../modules/timeLogic";
import useTimeboxGridRedux from "../../hooks/useTimeboxGridRedux";
import { useScheduleSetter } from "../../hooks/useScheduleSetter";

export default function TimeboxGrid(props) {
    const selectedDate = useSelector(state => state.selectedDate.value);
    const selectedSchedule = useSelector(state => state.selectedSchedule.value);
    console.log(props.data);
    const schedule = props.data[selectedSchedule];
    const dayToName = getArrayOfDayDateDayNameAndMonthForHeaders(selectedDate); //get all info to make headers look nice
    const listOfTimes = returnTimesSeperatedForSchedule(schedule); //get times that go down each row

    useTimeboxGridRedux(schedule, selectedDate); //make a map for the timeboxes with another map inside it, makes lookup fast
    useScheduleSetter(schedule); //set schedule data to redux store (timeboxes, recordedTimeboxes, goals
    console.log(schedule);
    return <></>
}