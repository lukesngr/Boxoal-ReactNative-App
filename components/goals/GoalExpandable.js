import { IconButton, List } from "react-native-paper";
import EditGoalForm from "./EditGoalForm";
import { useState } from "react";

export default function GoalExpandable(props) {
    const [editGoalFormVisible, setEditGoalFormVisible] = useState(false);
    return (
    <>
        <IconButton {...props} icon="cog" onPress={() => setEditGoalFormVisible(true)} />
        <List.Accordion titleStyle={{fontSize: 20}} 
        title={props.goal.title} 
        left={props => <List.Icon {...props} icon="folder" />}
        >
            <List.Item title="List item 1" />
            <List.Item title="List item 2" />
        </List.Accordion>
        <EditGoalForm data={props.goal} visible={editGoalFormVisible} close={() => setEditGoalFormVisible(false)}></EditGoalForm>
    </>
    )
}