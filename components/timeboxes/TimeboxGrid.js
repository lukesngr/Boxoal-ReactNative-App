import { useSelector } from "react-redux";
import { getArrayOfDayDateDayNameAndMonthForHeaders } from "../../modules/dateLogic";
import { returnTimesSeperatedForSchedule } from "../../modules/timeLogic";
import useTimeboxGridRedux from "../../hooks/useTimeboxGridRedux";
import { useScheduleSetter } from "../../hooks/useScheduleSetter";
import { View, Text, ScrollView } from "react-native";
import Timebox from "./Timebox";

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
    return (
    <ScrollView>
        <View style={{marginLeft: 4, marginRight: 4}}>
            <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', borderColor: 'black', borderWidth: 1, padding: 1}}></View>
                {dayToName.map((day, index) => {
                    return <View key={index} style={{flex: 1, justifyContent: 'center', alignItems: 'center', borderColor: 'black', borderWidth: 1, padding: 1}}>
                        <Text style={{fontSize: 16, color: 'black'}}>{day.name+" ("+day.date+"/"+day.month+")"}</Text>
                    </View>
                })}
            </View>
            <View style={{flexDirection: 'column'}}>
                {listOfTimes.map((time, index) => {
                    return <View key={index} style={{flexDirection: 'row'}}>
                        <View style={{borderWidth: 1, padding: 1}}>
                            <Text style={{fontSize: 18, color: 'black', width: 46}}>{time}</Text>
                        </View>
                        {dayToName.map((day, index) => {
                            return <Timebox key={index} day={day} time={time}></Timebox>
                        })}
                    </View>
                })}
                
            </View>
        </View>
    </ScrollView>
    )
}