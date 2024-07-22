import { faChevronDown, faChevronUp, faGear } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { Pressable } from "react-native";
import GoalAccordion from "./GoalAccordion";
import { Text, View } from "react-native";
import { useState } from "react";
import EditScheduleForm from "./EditScheduleForm";
import { Modal } from "react-native";
import Button from "../timeboxes/Button";
import CreateScheduleForm from "./CreateScheduleForm";
import CreateGoalForm from "../goals/CreateGoalForm";
import { styles } from "../../styles/styles";
 
export default function ScheduleItem(props) {
    const [accordionOpen, setAccordionOpen] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);

    return (
        <>
            <View style={{backgroundColor: 'white', padding: 10, margin: 10, marginBottom: 0, paddingBottom: 5, paddingRight: 0}}>
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
            <Button textStyle={styles.buttonTextStyle} outlineStyle={styles.scheduleButtonOutlineStyle} title="Create Goal" onPress={() => setCreateModalVisible(true)} />
            <Modal animationType="slide" transparent={true} visible={createModalVisible} onRequestClose={() => {setCreateModalVisible(!createModalVisible);}}>
                <View style={styles.modalContainer}>
                    <CreateGoalForm id={props.schedule.id} close={() => setCreateModalVisible(false)}></CreateGoalForm>
                </View>
            </Modal>
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => {setModalVisible(!modalVisible);}}>
                <View style={styles.modalContainer}>
                    <EditScheduleForm data={props.schedule} close={() => setModalVisible(false)}></EditScheduleForm>
                </View>
            </Modal>
        </>
    )
}