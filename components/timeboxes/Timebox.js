import { Pressable, View, Text, Modal } from "react-native"
import NormalTimebox from "./NormalTimebox";
import { useState } from "react";
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { filterTimeGridBasedOnSpace, getMarginFromTopOfTimebox, findSmallestTimeBoxLengthInSpace } from "../../modules/boxCalculations";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faDiagramPredecessor } from '@fortawesome/free-solid-svg-icons';

export default function Timebox(props) {
    const dispatch = useDispatch();
    const {headerWidth} = useSelector(state => state.overlayDimensions.value);
    const onDayView = useSelector(state => state.onDayView.value);
    const timeboxGrid = useSelector(state => state.timeboxGrid.value);
    const profile = useSelector(state => state.profile.value);
    const date = props.day.date+"/"+props.day.month;
    const dayName = props.day.name;
    let data;
    let marginFromTop = 0;
    let numberOfBoxesInSpace = 0;
    let boxesInsideSpace = [];

    if(timeboxGrid) { 
        if(timeboxGrid[date]) {
            boxesInsideSpace = filterTimeGridBasedOnSpace(timeboxGrid[date], profile.boxSizeUnit, profile.boxSizeNumber, props.time);
            numberOfBoxesInSpace = boxesInsideSpace.length;

            if(timeboxGrid[date][props.time]) {
                data = timeboxGrid[date][props.time];
            }else if(numberOfBoxesInSpace == 1) {
                if(onDayView) {
                    marginFromTop = getMarginFromTopOfTimebox(boxSizeUnit, boxSizeNumber, props.time, boxesInsideSpace[0], 60);
                }else{
                    marginFromTop = getMarginFromTopOfTimebox(boxSizeUnit, boxSizeNumber, props.time, boxesInsideSpace[0], 30);
                }
                data = timeboxGrid[date][boxesInsideSpace[0]];
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

    function expandSchedule() {
        let smallestTimeBoxLength = findSmallestTimeBoxLengthInSpace(timeboxGrid[date], boxesInsideSpace);
        if(smallestTimeboxLength % 60 == 0) {
            axios.post(serverIP+'/updateProfile', {...profile, boxSizeNumber: (smallestTimeboxLength / 60), boxSizeUnit: 'hr'}).catch(function(error) { console.log(error); });
            dispatch({type: 'profile/set', payload: {...profile, boxSizeNumber: smallestTimeBoxLength, boxSizeUnit: 'hr'}});
        }else{
            axios.post(serverIP+'/updateProfile', {...profile, boxSizeNumber: smallestTimeBoxLength, boxSizeUnit: 'min'}).catch(function(error) { console.log(error); });
            dispatch({type: 'profile/set', payload: {...profile, boxSizeNumber: smallestTimeBoxLength, boxSizeUnit: 'min'}});
        }
    }

    return (
    <View style={{borderWidth: 1, borderColor: 'black', width: onDayView ? headerWidth : 50.5, height: onDayView ? 60 : 30, zIndex: 998}}>
        {numberOfBoxesInSpace < 2 ? (
            <Pressable onPress={onPress}>
                {numberOfBoxesInSpace == 1 ? (<NormalTimebox marginFromTop={marginFromTop} data={data}></NormalTimebox>) : (<Text style={{width: '100%', height: '100%'}}></Text>)}
            </Pressable>
        ) : (
            <Pressable style={{alignContent: 'center', alignItems: 'center'}} onPress={expandSchedule}>
                <FontAwesomeIcon style={{width: '100%', height: '100%'}} icon={faDiagramPredecessor} size={onDayView ? 60 : 30} />
            </Pressable>
        )}
        
    </View>
    )
}