import { Text, View } from "react-native";
import Timebox from "./Timebox";
import { getCurrentDay } from "../../modules/dateLogic";
import { useSelector } from "react-redux";

export default function GridBody(props) {
    let {dayToName, time} = props;
    let currentDay = dayToName[getCurrentDay()];
    const onDayView = useSelector(state => state.onDayView.value);

    return (
    <View key={props.index} style={{flexDirection: 'row'}}>
        <View style={{borderWidth: 1, padding: 1, height: onDayView ? 60 : 30}}>
            <Text style={{fontSize: 18, color: 'black', width: 46}}>{time}</Text>
        </View>
        {onDayView && <Timebox day={currentDay} time={time} ></Timebox>}
        {!onDayView && dayToName.map((day, index) => (<Timebox key={index} day={day} time={time} index={index}></Timebox>))}
    </View>
    )
}