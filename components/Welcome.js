import { Text } from "react-native"
import { useState } from "react";
import Button from "./timeboxes/Button";
import { Modal, View} from "react-native";
import CreateScheduleForm from "./schedules/CreateScheduleForm";

let styles = {
    title: {
        color: 'black',
        fontSize: 28,
        textAlign: 'center',
        marginTop: 10,
        padding: 10,
    },
    subtitle: {
        fontSize: 23,
        color: 'black',
        marginLeft: 10,
        marginTop: 50
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(128, 128, 128, 0.2)',
    },
    
    buttonOutlineStyle: {
        backgroundColor: '#7FFFD4',
        padding: 5,
        marginTop: 100,
        marginLeft: 10,
        marginRight: 10,
    },
    buttonTextStyle: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
    },
    
}
export default function Welcome() {
    
    const [modalVisible, setModalVisible] = useState(false);
    return (<>
        <Text style={styles.title}>Welcome to Boxoal</Text>
        <Text style={styles.subtitle}>Please create a schedule</Text>
        <Text style={styles.subtitle}>After this:</Text>
        <Text style={styles.subtitle}>- Add goal via schedules view</Text>
        <Text style={styles.subtitle}>- Add timeboxes via timeboxes view(click on desired box)</Text>
        <Text style={styles.subtitle}>- Record timebox via record button</Text>
        <Button textStyle={styles.buttonTextStyle} outlineStyle={styles.buttonOutlineStyle} title="Create A Schedule" onPress={() => setModalVisible(true)} />
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => {setModalVisible(!modalVisible);}}>
            <View style={styles.modalContainer}>
                <CreateScheduleForm close={setModalVisible}></CreateScheduleForm>
            </View>
        </Modal>
    </>)
}