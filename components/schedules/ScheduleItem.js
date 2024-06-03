import { faChevronDown, faChevronUp, faGear } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { Pressable } from "react-native";
import GoalAccordion from "./GoalAccordion";
import { Text, View } from "react-native";
import { useState } from "react";
import EditScheduleForm from "./EditScheduleForm";

export default function ScheduleItem(props) {
    const [accordionOpen, setAccordionOpen] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
            <View style={{backgroundColor: 'white', padding: 10, margin: 10}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{color: 'black', fontSize: 25}}>{props.schedule.name}</Text>
                    <View style={{flexDirection: 'row'}}>
                        <Pressable onPress={() => setModalVisible(true)}>
                            <FontAwesomeIcon icon={faGear} size={30} color="black" />
                        </Pressable>
                        <Pressable onPress={() => setAccordionOpen(!accordionOpen)}>
                            <FontAwesomeIcon icon={accordionOpen ? faChevronDown : faChevronUp} size={30} color="black" />
                        </Pressable>
                    </View>
                </View>
                {accordionOpen && props.schedule.goals.map((goal, index) => {
                    return <GoalAccordion key={index} goal={goal}></GoalAccordion>
                })}
            </View>
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => {setModalVisible(!modalVisible);}}>
                <View style={styles.modalContainer}>
                    <EditScheduleForm data={props.schedule} close={setModalVisible}></EditScheduleForm>
                </View>
            </Modal>
        </>
    )
}