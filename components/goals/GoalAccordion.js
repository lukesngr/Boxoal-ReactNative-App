import { IconButton, List, Text, TouchableRipple, Surface } from "react-native-paper";
import EditGoalForm from "./EditGoalForm";
import { useState } from "react";
import { View } from "react-native";
import TimeboxAsListItem from "../timeboxes/TimeboxAsListItem";

export default function GoalAccordion(props) {
    const [editGoalFormVisible, setEditGoalFormVisible] = useState(false);
    const [accordionOpen, setAccordionOpen] = useState(false);
    return (
    <>
        <Surface style={{paddingLeft: 40, flexDirection: 'row', width: '100%', backgroundColor: 'white', borderRadius: 0}} elevation={accordionOpen ? 1 : 0}>
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
        <Surface style={{ backgroundColor: 'white', borderRadius: 25}} elevation={1}>
            <Text style={{fontSize: 25, color: 'black', textAlign: 'center', marginTop: 10, marginBottom: 10}}>15th</Text>
            <Text style={{fontSize: 20, color: 'black', textAlign: 'center', marginTop: 10, marginBottom: 10}}>Jul</Text>
        </Surface>                   
        <EditGoalForm data={props.goal} visible={editGoalFormVisible} close={() => setEditGoalFormVisible(false)}></EditGoalForm>
    </>
    )
}