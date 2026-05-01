import { IconButton, List, Text, TouchableRipple, Surface, Checkbox } from "react-native-paper";
import EditGoalForm from "./EditGoalForm";
import { useState } from "react";
import { View } from "react-native";
import TimeboxAsListItem from "../timeboxes/TimeboxAsListItem";
import axios from "axios";
import serverIP from "../../modules/serverIP";
import { useDispatch, useSelector } from "react-redux";
import { queryClient } from '../../modules/queryClient.js';
import { fetchAuthSession } from "aws-amplify/auth";

export default function GoalAccordion(props) {
    const [editGoalFormVisible, setEditGoalFormVisible] = useState(false);
    const [accordionOpen, setAccordionOpen] = useState(false);
    const [checked, setChecked] = useState(false);
    const dispatch = useDispatch();
    const timeboxesMap = useSelector(state => state.scheduleData.value.timeboxes);
    const timeboxesForGoal = timeboxesMap ? timeboxesMap.getFromK1(props.goal.id) : [];

    async function completeGoal() {
        const session = await fetchAuthSession();
        const accessToken = session.tokens?.accessToken.toString();
        const headers = {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        try {
            await axios.put(serverIP+'/updateGoal', {
                title: props.goal.title,
                priority: parseInt(props.goal.priority),
                targetDate: props.goal.targetDate, 
                id: props.goal.id,
                completed: true,
                completedOn: new Date().toISOString(),
                active: false,
                state: 'completed'
            }, headers);
            dispatch({type: 'alert/set', payload: {open: true, title: "Timebox", message: "Updated goal!"}});
            await queryClient.refetchQueries();
        } catch(error) {
            dispatch({type: 'alert/set', payload: {shown: true, title: "Error", message: "An error occurred, please try again or contact the developer"}});
            console.log(error);
        }

        try {
            await axios.get(serverIP+'/setNextGoalToActive', headers);
            await queryClient.refetchQueries();
        } catch(error) {
            console.log(error);
        }
    }

    return (!(props.goal.state == 'active') ? <></> : ( <>
        <View style={{flexDirection: 'row', width: '100%', backgroundColor: 'white', paddingHorizontal: 20}} elevation={accordionOpen ? 1 : 0}>
	    <View style={{flex: 1, flexDirection: 'row', borderColor: '#1A1A2E', borderWidth: 2, paddingBottom: 13}}>
	    <View style={{paddingTop: 13}}>
                <Checkbox color='black' testID="completeGoal" status={checked} style={{padding: 10}} onPress={() => {setChecked(true); completeGoal();}} />
            </View>
            <TouchableRipple onPress={() => setAccordionOpen(!accordionOpen)}>
                <Text testID={props.goal.title+"goalTitle"} style={{color: 'black', fontSize: 20, paddingTop: 15, width: 150}}>{props.goal.title}</Text>
            </TouchableRipple>
            <View style={{flexDirection: 'row', marginLeft: 70, marginTop: 10}}>
                
                <IconButton size={35} style={{ margin: 0, padding: 0, width: 33, height: 33 }} icon="cog" onPress={() => setEditGoalFormVisible(true)} />
                <IconButton size={35} style={{ margin: 0, padding: 0, width: 33, height: 33 }} icon={accordionOpen ? 'chevron-down' : 'chevron-up'} onPress={() => setAccordionOpen(!accordionOpen)} />
            </View>
	    </View>
        </View>
        {accordionOpen && timeboxesForGoal.map((timebox, index) => {
            return <TimeboxAsListItem key={index} timebox={timebox}></TimeboxAsListItem>
        })}          
        <EditGoalForm data={props.goal} visible={editGoalFormVisible} close={() => setEditGoalFormVisible(false)}></EditGoalForm>
        </>)
    )
}
