import { Text, View } from "react-native";
import { styles } from "../../styles/styles";
import { useSelector } from "react-redux";
import { useState } from "react";

export default function NormalTimebox(props) {
    const onDayView = useSelector(state => state.onDayView.value);
    let fontSize = onDayView ? 20 : 12;
    let timeboxHeight = onDayView ? styles.enlargedTimeboxHeight : styles.normalTimeboxHeight;
    let height = timeboxHeight*props.data.numberOfBoxes;

    return (
    <View style={{position: 'relative', height: height, backgroundColor: props.data.color, width: '100%'}}>
        <Text style={{fontSize: fontSize, color: 'black'}}>{props.data.title}</Text>
    </View>
    )
}