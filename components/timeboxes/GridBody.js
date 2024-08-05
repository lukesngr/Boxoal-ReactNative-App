import { Text, View } from "react-native";
import Timebox from "./Timebox";
import { getCurrentDay } from "../../modules/dateLogic";
import { useSelector } from "react-redux";

export default function GridBody(props) {
    let {dayToName, time, onDayView} = props;
    let height = 30;
    let currentDay = getCurrentDay();

    if(onDayView) {
        dayToName = [dayToName[currentDay]]; 
        height = 60;
    } 

    return (
    <View key={props.index} style={{flexDirection: 'row'}}>
        <View style={{borderWidth: 1, padding: 1, height: height}}>
            <Text style={{fontSize: 18, color: 'black', width: 46}}>{time}</Text>
        </View>
        {dayToName.map((day, index) => {
            return <Timebox key={index} day={day} time={time} index={index}></Timebox>
        })}
    </View>)
}