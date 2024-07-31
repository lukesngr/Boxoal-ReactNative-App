import { IconButton, List, Text, TouchableRipple } from "react-native-paper";
import EditGoalForm from "./EditGoalForm";
import { useState } from "react";
import { View } from "react-native";
import TimeboxItem from "../timeboxes/TimeboxItem";

export default function GoalExpandable(props) {
    const [editGoalFormVisible, setEditGoalFormVisible] = useState(false);
    const [accordionOpen, setAccordionOpen] = useState(false);
    return (
    <>
        <View style={{marginLeft: 40, flexDirection: 'row'}}>
            <TouchableRipple onPress={() => setAccordionOpen(!accordionOpen)}>
                <Text style={{color: accordionOpen ? '#C5C27C' : 'black', fontSize: 20, width: 215, paddingTop: 15}}>{props.goal.title}</Text>
            </TouchableRipple>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: -25}}>
                <IconButton size={35} icon="cog" onPress={() => setEditGoalFormVisible(true)} />
                <IconButton size={35} icon={accordionOpen ? 'chevron-down' : 'chevron-up'} onPress={() => setAccordionOpen(!accordionOpen)} />
            </View>
        </View>
        {accordionOpen && props.goal.timeboxes.map((timebox, index) => {
            return <TimeboxItem key={index} timebox={timebox}></TimeboxItem>
        })}   
        <EditGoalForm data={props.goal} visible={editGoalFormVisible} close={() => setEditGoalFormVisible(false)}></EditGoalForm>
    </>
    )
}