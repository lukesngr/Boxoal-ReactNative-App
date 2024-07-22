import { Text } from "react-native"
import { useState } from "react";
import Button from "./timeboxes/Button";
import { Modal, View} from "react-native";
import CreateScheduleForm from "./schedules/CreateScheduleForm";
import { styles } from "../styles/styles";

export default function Welcome() {
    
    const [modalVisible, setModalVisible] = useState(false);
    return (<>
        <Text style={styles.welcomeTitle}>Welcome to Boxoal</Text>
        <Text style={styles.welcomeSubtitle}>Please create a schedule</Text>
        <Text style={styles.welcomeSubtitle}>After this:</Text>
        <Text style={styles.welcomeSubtitle}>- Add goal via schedules view</Text>
        <Text style={styles.welcomeSubtitle}>- Add timeboxes via timeboxes view(click on desired box)</Text>
        <Text style={styles.welcomeSubtitle}>- Record timebox via record button</Text>
        <Button textStyle={styles.buttonTextStyle} outlineStyle={styles.welcomeButtonOutlineStyle} title="Create A Schedule" onPress={() => setModalVisible(true)} />
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => {setModalVisible(!modalVisible);}}>
            <View style={styles.modalContainer}>
                <CreateScheduleForm close={setModalVisible}></CreateScheduleForm>
            </View>
        </Modal>
    </>)
}