import { Surface, Text } from "react-native-paper"
export function GoalTreeNode(props) {
    return (
        <Surface style={{padding: 10, margin: 10, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontFamily: 'KameronRegular', fontSize: 20, color: 'black'}}>{props.goal.title}</Text>
        </Surface>
    )
}