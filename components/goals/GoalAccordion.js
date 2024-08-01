import { IconButton, List, Text, TouchableRipple, Surface } from "react-native-paper";
import EditGoalForm from "./EditGoalForm";
import { useState } from "react";
import { View } from "react-native";
import TimeboxAsListItem from "../timeboxes/TimeboxAsListItem";
import GoalProgressIndicator from "./GoalProgressIndicator";

export default function GoalAccordion(props) {
    const [editGoalFormVisible, setEditGoalFormVisible] = useState(false);
    const [accordionOpen, setAccordionOpen] = useState(false);
    return (
    <>
        <Surface style={{flexDirection: 'row', width: '100%', backgroundColor: 'white', borderRadius: 0}} elevation={accordionOpen ? 1 : 0}>
            <GoalProgressIndicator goal={props.goal}></GoalProgressIndicator>         
            <TouchableRipple onPress={() => setAccordionOpen(!accordionOpen)}>
                <Text style={{color: 'black', fontSize: 20, width: 215, paddingTop: 15}}>{props.goal.title}</Text>
            </TouchableRipple>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: -25}}>
                <IconButton size={35} icon="cog" onPress={() => setEditGoalFormVisible(true)} />
                <IconButton size={35} icon={accordionOpen ? 'chevron-down' : 'chevron-up'} onPress={() => setAccordionOpen(!accordionOpen)} />
            </View>
        </Surface>
        {accordionOpen && props.goal.timeboxes.map((timebox, index) => {
            return <TimeboxAsListItem key={index} timebox={timebox}></TimeboxAsListItem>
        })}          
        <EditGoalForm data={props.goal} visible={editGoalFormVisible} close={() => setEditGoalFormVisible(false)}></EditGoalForm>
    </>
    )
}