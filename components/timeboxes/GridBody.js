import { Text, View } from "react-native";
import Timebox from "./Timebox";
import { getCurrentDay } from "../../modules/dateLogic";
import { useSelector } from "react-redux";
import { styles } from "../../styles/styles";
import { useState, useEffect } from "react";

export default function GridBody(props) {
    const [dayToName, setDayToName] = useState(props.dayToName);
    const [timeboxHeight, setTimeboxHeight] = useState(styles.normalTimeboxHeight);
    const onDayView = useSelector(state => state.onDayView.value);
    let currentDay = getCurrentDay();

    useEffect(() => {
        if(onDayView) {
            if(dayToName.length > 1) {setDayToName([dayToName[currentDay]]); }
            setTimeboxHeight(styles.enlargedTimeboxHeight);
        }else{
            setDayToName(props.dayToName);
            setTimeboxHeight(styles.normalTimeboxHeight);
        }
    }, [onDayView])

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