import { Pressable, View, Text, Modal } from "react-native"
import NormalTimebox from "./NormalTimebox";
import { useState } from "react";
import { useSelector } from 'react-redux';
import CreateTimeboxForm from "./CreateTimeboxForm";
import TimeboxActionsForm from "./TimeboxActionsForm";
import { styles } from "../../styles/styles";
import onDayView from "../../redux/onDayView";

export default function Timebox(props) {
    const {headerWidth, headerHeight} = useSelector(state => state.overlayDimensions.value);
    const onDayView = useSelector(state => state.onDayView.value);
    const [modalVisible, setModalVisible] = useState(false);
    const timeboxGrid = useSelector(state => state.timeboxGrid.value);

    let date = props.day.date+"/"+props.day.month;
    let dayName = props.day.name;
    let data;

    if(timeboxGrid) { 
        if(timeboxGrid[date]) {
            data = timeboxGrid[date][props.time];
        }
    }

    function onPress() {
        setModalVisible(!modalVisible);
    }

    return (
    <View style={{borderWidth: 1, borderColor: 'black', width: onDayView ? headerWidth : 50.5, height: onDayView ? 60 : 30, zIndex: 998}}>
        <Pressable onPress={onPress}>
            {data ? (<NormalTimebox data={data}></NormalTimebox>) : (<Text></Text>)}
        </Pressable>
        {data ? (
            <TimeboxActionsForm data={data} date={date} time={props.time} visible={modalVisible} close={() => setModalVisible(false)}></TimeboxActionsForm>
        ) : (
            <CreateTimeboxForm time={props.time} dayName={dayName} date={date} visible={modalVisible} close={() => setModalVisible(false)}></CreateTimeboxForm>
        )
        }
    </View>
    )
}