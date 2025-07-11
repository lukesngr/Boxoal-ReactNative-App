import { Text } from "react-native";
import { View } from "react-native";
import { IconButton, FAB, Surface, Icon } from "react-native-paper";
import CreateScheduleForm from "../components/schedules/CreateScheduleForm";
import { useSelector } from "react-redux";
import { useState } from "react";
import EditScheduleForm from "../components/schedules/EditScheduleForm";
import GoalAccordion from "../components/goals/GoalAccordion";
import CreateGoalForm from "../components/goals/CreateGoalForm";
import { styles } from "../styles/styles";
import CorrectModalDisplayer from "../components/modals/CorrectModalDisplayer";
import { GoalTree } from "./GoalTree";
import { getMaxNumberOfGoals } from "../modules/coreLogic";

export default function Goals(props) {
    const profile = useSelector(state => state.profile.value);
    const [createScheduleVisible, setCreateScheduleVisible] = useState(false);
    const [editScheduleVisible, setEditScheduleVisible] = useState(false);
    const [createGoalVisible, setCreateGoalVisible] = useState(false);
    const [showSkillTree, setShowSkillTree] = useState(false);
    let schedule = props.data[profile.scheduleIndex];
    let highestActiveIndex = 0;

    for(let i = 0; i < schedule.goals.length; i++) {
        if(schedule.goals[i].active && schedule.goals[i].partOfLine > highestActiveIndex) {
            highestActiveIndex = schedule.goals[i].partOfLine;
        }
    }

    if(showSkillTree) {
        return (<GoalTree data={schedule} close={() => setShowSkillTree(false)}></GoalTree>) 
    }else{
        return (<>
        <View style={{backgroundColor: '#D9D9D9', width: '100%', height: '100%', padding: 20, paddingLeft: 15, paddingRight: 15}}>
            <View style={{backgroundColor: 'white', width: '100%', height: '100%'}}>
                <Surface style={{flexDirection: 'row', alignItems: 'center', paddingLeft: 20, backgroundColor: 'white'}}> 
                    <Text style={{fontSize: 25, color: 'black', textAlign: 'left', marginTop: 5, width: 220}}>{schedule.title}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: -25}}>
                        <IconButton icon="tree" size={36} onPress={() => setShowSkillTree(true)}></IconButton>
                        <IconButton testID="editScheduleButton" icon="cog" size={36} onPress={() => setEditScheduleVisible(true)}></IconButton>
                        <IconButton icon="plus" size={36} onPress={() => setCreateScheduleVisible(true)}></IconButton>
                    </View>
                </Surface>
                {schedule.goals.map((goal, index) => {
                    return <GoalAccordion key={index} goal={goal}></GoalAccordion>
                })}
                <Surface style={{paddingLeft: 40, flexDirection: 'row', paddingBottom: 15, backgroundColor: 'white'}}>
                <FAB testID="addGoalButton" icon="plus" label="Add Goal" mode='elevated' style={styles.addGoalFAB} onPress={() => setCreateGoalVisible(true)}/>
                </Surface>
            </View>
        </View>
        <CorrectModalDisplayer></CorrectModalDisplayer>
        <CreateGoalForm visible={createGoalVisible} active={true} line={highestActiveIndex+1} close={() => setCreateGoalVisible(false)} id={schedule.id}  goals={schedule.goals}></CreateGoalForm>
        <EditScheduleForm data={schedule} visible={editScheduleVisible} close={() => setEditScheduleVisible(false)}></EditScheduleForm>
        <CreateScheduleForm visible={createScheduleVisible} close={() => setCreateScheduleVisible(false)}></CreateScheduleForm>
        </>)
        }
}