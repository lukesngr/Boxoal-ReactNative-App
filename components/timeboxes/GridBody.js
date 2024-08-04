import { Text, View } from "react-native";
import Timebox from "./Timebox";
import { getCurrentDay } from "../../modules/dateLogic";

export default function GridHeader(props) {
    const onDayView = useSelector(state => state.onDayView.value);
    let {dayToName, time} = props;
    let height = 30;

    if(onDayView) {
        dayToName = [dayToName[getCurrentDay()]]; 
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