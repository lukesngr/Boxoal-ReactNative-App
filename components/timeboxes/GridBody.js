import { Text, View } from "react-native";
import Timebox from "./Timebox";
import { useSelector } from "react-redux";
import { styles } from "../../styles/styles";

export default function GridBody(props) {
    const onDayView = useSelector(state => state.onDayView.value);
    const daySelected = useSelector(state => state.daySelected.value);
    let dayToName = onDayView ? [props.dayToName[daySelected]] : props.dayToName;
    let timeboxHeight = onDayView ? styles.enlargedTimeboxHeight : styles.normalTimeboxHeight;

    return (
    <View key={props.index} style={{flexDirection: 'row'}}>
        <View style={{borderWidth: 1, padding: 1, height: timeboxHeight}}>
            <Text style={{fontSize: 18, color: 'black', width: styles.timeTextWidth}}>{props.time}</Text>
        </View>
        {dayToName.map((day, index) => {
            return <Timebox key={index} day={day} time={props.time} index={index}></Timebox>
        })}
    </View>)
}