import { Pressable, View, Text, Modal } from "react-native"
import NormalTimebox from "./NormalTimebox";
import { useState } from "react";
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { filterTimeGridBasedOnSpace, getMarginFromTopOfTimebox } from "../../modules/boxCalculations";

export default function Timebox(props) {
    const dispatch = useDispatch();
    const {headerWidth} = useSelector(state => state.overlayDimensions.value);
    const onDayView = useSelector(state => state.onDayView.value);
    const timeboxGrid = useSelector(state => state.timeboxGrid.value);
    const {boxSizeNumber, boxSizeUnit} = useSelector(state => state.profile.value);
    const date = props.day.date+"/"+props.day.month;
    const dayName = props.day.name;
    let data;
    let marginFromTop = 0;
    let moreThanOneBoxesInSpace = false;

    if(timeboxGrid) { 
        if(timeboxGrid[date]) {
            let boxesInsideSpace = filterTimeGridBasedOnSpace(timeboxGrid[date], boxSizeUnit, boxSizeNumber, props.time);
            if(boxesInsideSpace.length > 1) {
                moreThanOneBoxesInSpace = true;
            }

            if(timeboxGrid[date][props.time]) {
                data = timeboxGrid[date][props.time];
            }else{
                marginFromTop = getMarginFromTopOfTimebox(boxSizeUnit, boxSizeNumber, props.time, boxesInsideSpace[0]);
            }
        }
    }

    function onPress() {
        if(data) {
            dispatch({type: 'modalVisible/set', payload: {visible: true, props: {data: data, date: date, time: props.time}}});
        }else{
            dispatch({type: 'modalVisible/set', payload: {visible: true, props: {dayName: dayName, date: date, time: props.time}}});
        }
    }

    return (
    <View style={{borderWidth: 1, borderColor: 'black', width: onDayView ? headerWidth : 50.5, height: onDayView ? 60 : 30, zIndex: 998}}>
        <Pressable onPress={onPress}>
            {data ? (<NormalTimebox marginFromTop={marginFromTop} data={data}></NormalTimebox>) : (<Text style={{width: '100%', height: '100%'}}></Text>)}
        </Pressable>
    </View>
    )
}