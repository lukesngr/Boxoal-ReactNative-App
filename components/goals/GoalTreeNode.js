import { Surface, Text } from "react-native-paper"
export function GoalTreeNode(props) {
    return (
        <Surface style={{padding: 10, margin: 10, backgroundColor: '#D9D9D9', borderRadius: 25, alignSelf: 'center'}}>
            <Text style={{fontFamily: 'KameronRegular', fontSize: 20, color: 'black'}}>{props.goal.title}</Text>
        </Surface>
    )
}