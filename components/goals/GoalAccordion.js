import { IconButton, List, Text, TouchableRipple, Surface, Checkbox } from "react-native-paper";
import EditGoalForm from "./EditGoalForm";
import { useState } from "react";
import { View } from "react-native";
import TimeboxAsListItem from "../timeboxes/TimeboxAsListItem";
import GoalProgressIndicator from "./GoalProgressIndicator";
import axios from "axios";
import serverIP from "../../modules/serverIP";

export default function GoalAccordion(props) {
    const [editGoalFormVisible, setEditGoalFormVisible] = useState(false);
    const [accordionOpen, setAccordionOpen] = useState(false);
    const [checked, setChecked] = useState(false);

    function completeGoal() {
        axios.put(serverIP+'/updateGoal', {
            title: props.goal.title,
            priority: parseInt(props.goal.priority), //damn thing won't convert auto even with number input
            targetDate: props.goal.targetDate, 
            id: props.goal.id,
            completed: true,
            completedOn: new Date().toISOString(),
            active: false
        }
        ).then(async () => {
            setAlert({shown: true, title: "Timebox", message: "Updated goal!"});
            await queryClient.refetchQueries();
        }).catch(function(error) {
            setAlert({shown: true, title: "Error", message: "An error occurred, please try again or contact the developer"});
            console.log(error);
        })

        axios.get(serverIP+'/setNextGoalToActive').then(async () => {
            await queryClient.refetchQueries();
        }).catch(function(error) {
            console.log(error);
        })
    }

    return (!props.goal.active ? <></> : ( <>
        <Surface style={{flexDirection: 'row', width: '100%', backgroundColor: 'white', borderRadius: 0}} elevation={accordionOpen ? 1 : 0}>
            <GoalProgressIndicator goal={props.goal}></GoalProgressIndicator>         
            <TouchableRipple onPress={() => setAccordionOpen(!accordionOpen)}>
                <Text style={{color: 'black', fontSize: 20, width: 180, paddingTop: 15}}>{props.goal.title}</Text>
            </TouchableRipple>
            <View style={{paddingTop: 15}}>
                <Checkbox color='black' status={checked} style={{padding: 10, marginTop: 20}} onPress={() => {setChecked(true); completeGoal();}} />
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: -25}}>
                
                <IconButton size={35} icon="cog" onPress={() => setEditGoalFormVisible(true)} />
                <IconButton size={35} icon={accordionOpen ? 'chevron-down' : 'chevron-up'} onPress={() => setAccordionOpen(!accordionOpen)} />
            </View>
        </Surface>
        {accordionOpen && props.goal.timeboxes.map((timebox, index) => {
            return <TimeboxAsListItem key={index} timebox={timebox}></TimeboxAsListItem>
        })}          
        <EditGoalForm data={props.goal} visible={editGoalFormVisible} close={() => setEditGoalFormVisible(false)}></EditGoalForm>
        </>)
    )
}