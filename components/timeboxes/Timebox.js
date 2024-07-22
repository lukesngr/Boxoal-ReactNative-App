import { Pressable, View, Text, Modal } from "react-native"
import NormalTimebox from "./NormalTimebox";
import { useState } from "react";
import { useSelector } from 'react-redux';
import CreateTimeboxForm from "./CreateTimeboxForm";
import TimeboxActionsForm from "./TimeboxActionsForm";
import { styles } from "../../styles/styles";

export default function Timebox(props) {
    function onPress() {
        setModalVisible(true);
    }

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

    return (
    <View style={{borderWidth: 1, borderColor: 'black', width: 50.5, height: 30, zIndex: 998}}>
        <Pressable onPress={onPress}>
            {data ? (<NormalTimebox data={data}></NormalTimebox>) : (<Text></Text>)}
        </Pressable>
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
            <View style={styles.modalContainer}>
            {data ? (<TimeboxActionsForm time={props.time} date={date} data={data} close={setModalVisible}></TimeboxActionsForm>) : (
            <CreateTimeboxForm time={props.time} dayName={dayName} date={date} close={setModalVisible}></CreateTimeboxForm>)}
            </View>
        </Modal>
    </View>
    )
}