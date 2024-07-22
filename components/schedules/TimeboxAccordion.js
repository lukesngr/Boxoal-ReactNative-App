import { faChevronDown, faChevronUp, faGear } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { Pressable } from "react-native";
import { Text, View } from "react-native";
import { useState } from "react";
import { convertToTimeAndDate } from "../../modules/coreLogic";
import { Modal } from "react-native";
import TimeboxActionsForm from "../timeboxes/TimeboxActionsForm";
import { styles } from "../../styles/styles";

export default function TimeboxAccordion(props) {

    const [modalVisible, setModalVisible] = useState(false);
    let data = props.timebox;
    let [time, date] = convertToTimeAndDate(props.timebox.startTime);

    function onPress() {
        setModalVisible(true);
    }

    return (
        <View style={{backgroundColor: 'white', padding: 10, margin: 10}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{color: 'black', fontSize: 20, flexShrink: 1}}>{props.timebox.title}</Text>
                <Pressable onPress={onPress}>
                    <FontAwesomeIcon icon={faGear} size={30} color="black" />
                </Pressable>
            </View>
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => {setModalVisible(!modalVisible);}}>
                <View style={styles.modalContainer}>
                    <TimeboxActionsForm time={time} date={date} data={data} close={setModalVisible}></TimeboxActionsForm>
                </View>
            </Modal>
        </View>
    )
}