import { Text } from "react-native";
import { View } from "react-native";
import { IconButton, FAB, Surface } from "react-native-paper";
import CreateScheduleForm from "../components/schedules/CreateScheduleForm";
import { useSelector } from "react-redux";
import { useState } from "react";
import EditScheduleForm from "../components/schedules/EditScheduleForm";
import GoalAccordion from "../components/goals/GoalAccordion";
import CreateGoalForm from "../components/goals/CreateGoalForm";
import GoalAccordion from "../components/goals/GoalAccordion";

export default function Goals(props) {
    const {selectedSchedule} = useSelector(state => state.settings.value);
    const [createScheduleVisible, setCreateScheduleVisible] = useState(false);
    const [editScheduleVisible, setEditScheduleVisible] = useState(false);
    const [createGoalVisible, setCreateGoalVisible] = useState(false);
    let schedule = props.data[Number(selectedSchedule)];

    return (<>
        <View style={{backgroundColor: '#D9D9D9', width: '100%', height: '100%', padding: 20, paddingLeft: 15, paddingRight: 15}}>
            <View style={{backgroundColor: 'white', width: '100%', height: '100%'}}>
                <Text style={{fontFamily: 'KameronRegular', fontSize: 35, color: 'black', textAlign: 'left', marginTop: 10, paddingLeft: 40}}>Goals</Text>
                <Surface style={{flexDirection: 'row', alignItems: 'center', paddingLeft: 40, backgroundColor: 'white'}}> 
                    <Text style={{fontSize: 25, color: 'black', textAlign: 'left', marginTop: 5, marginRight: 180}}>{schedule.title}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: -25}}>
                        <IconButton icon="cog" size={36} onPress={() => setEditScheduleVisible(true)}></IconButton>
                        <IconButton icon="plus" size={36} onPress={() => setCreateScheduleVisible(true)}></IconButton>
                    </View>
                </Surface>
                {schedule.goals.map((goal, index) => {
                    return <GoalAccordion scheduleID={schedule.id} goal={goal}></GoalAccordion>
                })}
                <Surface style={{paddingLeft: 40, flexDirection: 'row', paddingBottom: 15, backgroundColor: 'white'}}>
                <FAB icon="plus" mode='elevated' style={{width: '85%', marginTop: 10, backgroundColor: '#C5C27C', textAlign: 'center', paddingLeft: '30%'}} onPress={() => setCreateGoalVisible(true)}/>
                </Surface>
            </View>
        </View>
        <CreateGoalForm visible={createGoalVisible} close={() => setCreateGoalVisible(false)} id={schedule.id}></CreateGoalForm>
        <EditScheduleForm data={schedule} visible={editScheduleVisible} close={() => setEditScheduleVisible(false)}></EditScheduleForm>
        <CreateScheduleForm visible={createScheduleVisible} close={() => setCreateScheduleVisible(false)}></CreateScheduleForm>
        </>
    )
}