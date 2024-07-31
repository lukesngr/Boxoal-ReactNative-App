import { List } from "react-native-paper";

export default function GoalExpandable(props) {
    return (
        <List.Section title={props.goal.title}>
            <List.Accordion left={(props) => <List.Icon {...props} icon="folder" />} title={props.goal.title}>
                <List.Item title="List item 1" />
                <List.Item title="List item 2" />
            </List.Accordion>
        </List.Section>
    )
}