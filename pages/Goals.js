import { Text } from "react-native";
import { View } from "react-native";
import { IconButton, FAB } from "react-native-paper";
import CreateScheduleForm from "../components/schedules/CreateScheduleForm";
import { useSelector } from "react-redux";
import { useState } from "react";
import EditScheduleForm from "../components/schedules/EditScheduleForm";
import GoalExpandable from "../components/goals/GoalExpandable";

export default function Goals(props) {
    const {selectedSchedule} = useSelector(state => state.settings.value);
    const [createScheduleVisible, setCreateScheduleVisible] = useState(false);
    const [editScheduleVisible, setEditScheduleVisible] = useState(false);
    let schedule = props.data[Number(selectedSchedule)];

    return (<>
        <View style={{backgroundColor: '#D9D9D9', width: '100%', height: '100%', padding: 20, paddingLeft: 15, paddingRight: 15}}>
            <View style={{backgroundColor: 'white', width: '100%', height: '100%'}}>
                <Text style={{fontFamily: 'KameronRegular', fontSize: 35, color: 'black', textAlign: 'left', marginTop: 10, paddingLeft: 40}}>Goals</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 40}}> 
                    <Text style={{fontSize: 25, color: 'black', textAlign: 'left', marginTop: 5, marginRight: 180}}>{schedule.title}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: -25}}>
                        <IconButton icon="cog" size={36} onPress={() => setEditScheduleVisible(true)}></IconButton>
                        <IconButton icon="plus" size={36} onPress={() => setCreateScheduleVisible(true)}></IconButton>
                    </View>
                </View>
                {schedule.goals.map((goal, index) => {
                    return <GoalExpandable goal={goal}></GoalExpandable>
                })}
                <FAB icon="plus" style={{width: '80%', marginLeft: 40, backgroundColor: '#C5C27C', textAlign: 'center', paddingLeft: '30%'}} onPress={() => console.log('Pressed')}/>
            </View>
        </View>
        <EditScheduleForm data={schedule} visible={editScheduleVisible} close={() => setEditScheduleVisible(false)}></EditScheduleForm>
        <CreateScheduleForm visible={createScheduleVisible} close={() => setCreateScheduleVisible(false)}></CreateScheduleForm>
        </>
    )
}