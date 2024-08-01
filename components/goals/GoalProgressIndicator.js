import { Surface, Text } from "react-native-paper";

export default function GoalProgressIndicator(props) {
    return (
    <Surface style={{ backgroundColor: '#D9D9D9', borderRadius: 100, width: 50, height: 50, paddingTop: 5}} elevation={1}>
        <Text style={{fontSize: 13, color: 'black', textAlign: 'center'}}>15th</Text>
        <Text style={{fontSize: 13, color: 'black', textAlign: 'center'}}>Jul</Text>
    </Surface>)
}