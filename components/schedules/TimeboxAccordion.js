import { faChevronDown, faChevronUp, faGear } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { Pressable } from "react-native";
import { Text, View } from "react-native";
import { useState } from "react";

const styles = {
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(128, 128, 128, 0.2)',
    }
}

export default function TimeboxAccordion(props) {

    function onPress() {
        setModalVisible(true);
        const timeboxGrid = useSelector(state => state.timeboxGrid.value);
    let date = props.day.date+"/"+props.day.month;
    let data;

    if(timeboxGrid) { 
        if(timeboxGrid[date]) {
            data = timeboxGrid[date][props.time];
        }
    }
    }

    const [modalVisible, setModalVisible] = useState(false);
    

    console.log(props.timebox);
    return (
        <View style={{backgroundColor: 'white', padding: 10, margin: 10}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{color: 'black', fontSize: 20, flexShrink: 1}}>{props.timebox.title}</Text>
                <FontAwesomeIcon icon={faGear} size={30} color="black" />
            </View>
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => {setModalVisible(!modalVisible);}}>
                <View style={styles.modalContainer}>
                    <TimeboxActionsForm time={props.time} date={date} data={data} close={setModalVisible}></TimeboxActionsForm>
                </View>
            </Modal>
        </View>
    )
}