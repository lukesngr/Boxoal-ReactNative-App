import ScheduleItem from "./ScheduleItem"
import { ScrollView, View, Modal } from "react-native"
import { useState } from "react";
import Button from "../timeboxes/Button";
import CreateScheduleForm from "./CreateScheduleForm";

let styles = {
    buttonOutlineStyle: {
        backgroundColor: '#7FFFD4',
        padding: 5,
        marginLeft: 10,
        marginRight: 10,
    },
    buttonTextStyle: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(128, 128, 128, 0.2)',
    }
}

export default function ScheduleAccordion(props) {
    const [modalVisible, setModalVisible] = useState(false);
    return <ScrollView> 
        {props.data.map((schedule, index) => {
            return <ScheduleItem key={index} schedule={schedule}></ScheduleItem>
        })}
        <Button textStyle={styles.buttonTextStyle} outlineStyle={styles.buttonOutlineStyle} title="Create Schedule" onPress={() => setModalVisible(true)} />
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => {setModalVisible(!modalVisible);}}>
                <View style={styles.modalContainer}>
                    <CreateScheduleForm close={setModalVisible}></CreateScheduleForm>
                </View>
            </Modal>
    </ScrollView>
}