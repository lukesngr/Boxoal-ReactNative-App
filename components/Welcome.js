import { Text } from "react-native"
import { useState } from "react";
import { Button } from "react-native-paper";
import { Modal, View} from "react-native";
import CreateScheduleForm from "./schedules/CreateScheduleForm";
import { styles } from "../styles/styles";
import { Avatar, Card, Paragraph } from "react-native-paper";
import Video from 'react-native-video';
import intro from '../assets/intro.mp4';

export default function Welcome() {
    
    const [modalVisible, setModalVisible] = useState(false);
    return (<>
        <View style={{backgroundColor: '#D9D9D9', width: '100%', height: '100%'}}>
            <Card style={{backgroundColor: 'white', margin: 10, marginTop: 50}} mode={'elevated'}>
                <Card.Title title="Welcome to Boxoal" subtitle="Tutorial video" left={(props) => <Avatar.Icon {...props} icon="information" />}/>
                <Video source={intro} style={{width: '100%', height: 500}} paused={false} repeat={true} controls={true}></Video>
                <Card.Title title="Instructions" subtitle="Create a schedule to get started"/>
                <Card.Actions>
                    <Button mode='contained' onPress={() => setModalVisible(true)}>Create Schedule</Button>
                </Card.Actions>
            </Card>
        </View>
        <CreateScheduleForm visible={modalVisible} close={setModalVisible}></CreateScheduleForm>
        </>)
}