import { Text } from "react-native"
import { useState } from "react";
import { Button } from "react-native-paper";
import { Modal, View} from "react-native";
import CreateScheduleForm from "./schedules/CreateScheduleForm";
import { styles } from "../styles/styles";
import { Avatar, Card, Paragraph } from "react-native-paper";

export default function Welcome() {
    
    const [modalVisible, setModalVisible] = useState(false);
    return (<>
        <View style={{backgroundColor: '#D9D9D9', width: '100%', height: '100%'}}>
            <Card style={{backgroundColor: 'white', margin: 10, marginTop: 100}} mode={'elevated'}>
                <Card.Title title="Welcome to Boxoal" subtitle="Tutorial video" left={(props) => <Avatar.Icon {...props} icon="information" />}/>
                <Card.Cover style={{borderRadius: 0}}/>
                <Card.Title title="Instructions" subtitle="How to get started"/>
                <Card.Content style={{marginTop: 30}}>
                    <Paragraph variant="bodyMedium">
                        First start by creating a schedule with the button below, then create a goal, then add timeboxes to said goal
                    </Paragraph>
                </Card.Content>
                <Card.Actions>
                    <Button mode='contained' onPress={() => setModalVisible(true)}>Create Schedule</Button>
                </Card.Actions>
            </Card>
        </View>
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => {setModalVisible(!modalVisible);}}>
            <View style={styles.modalContainer}>
                <CreateScheduleForm close={setModalVisible}></CreateScheduleForm>
            </View>
        </Modal>
        </>)
}