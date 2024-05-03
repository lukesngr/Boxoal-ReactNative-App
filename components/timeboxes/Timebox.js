import { Pressable, View, Text, Modal } from "react-native"
import NormalTimebox from "./NormalTimebox";
import { useState } from "react";
import {useSelector, useDispatch} from 'react-redux';
import { ifEqualOrBeyondCurrentDay } from "../../modules/dateLogic";
import CreateTimeboxForm from "./CreateTimeboxForm";

const styles = {
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(128, 128, 128, 0.2)',
    }
}

export default function Timebox(props) {
    function onPress() {
        setModalVisible(true);
    }

    const [modalVisible, setModalVisible] = useState(false);
    const timeboxGrid = useSelector(state => state.timeboxGrid.value);
    const dispatch = useDispatch();

    let date = props.day.date+"/"+props.day.month;
    let dayName = props.day.name;
    let active = ifEqualOrBeyondCurrentDay(props.index, true, false)
    let data;

    if(timeboxGrid) { 
        if(timeboxGrid[date]) {
            data = timeboxGrid[date][props.time]; 
        }
    }

    return (
    <View style={{borderWidth: 1, padding: 1, borderColor: 'black', width: 50.5, height: 30}}>
        <Pressable onPress={onPress}>
            <Text></Text>
        </Pressable>
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
            <View style={styles.modalContainer}>
            {data ? (<NormalTimebox></NormalTimebox>) : (<CreateTimeboxForm time={props.time} dayName={dayName} date={date} close={setModalVisible}></CreateTimeboxForm>)}
            </View>
        </Modal>
    </View>
    )
}