import ScheduleItem from "./ScheduleItem"
import { ScrollView, View, Modal } from "react-native"
import { useState } from "react";
import Button from "../timeboxes/Button";
import CreateScheduleForm from "./CreateScheduleForm";
import { styles } from "../../styles/styles";

export default function ScheduleAccordion(props) {
    const [modalVisible, setModalVisible] = useState(false);
    return <ScrollView> 
        {props.data.map((schedule, index) => {
            return <ScheduleItem key={index} schedule={schedule}></ScheduleItem>
        })}
        <Button textStyle={styles.buttonTextStyle} outlineStyle={styles.scheduleButtonOutlineStyle} title="Create Schedule" onPress={() => setModalVisible(true)} />
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => {setModalVisible(!modalVisible);}}>
            <View style={styles.modalContainer}>
                <CreateScheduleForm close={() => setModalVisible(false)}></CreateScheduleForm>
            </View>
        </Modal>
    </ScrollView>
}