import { Surface, Text } from "react-native-paper";

export default function GoalProgressIndicator(props) {
    return (
    <Surface style={{ backgroundColor: 'white', borderRadius: 25}} elevation={1}>
        <Text style={{fontSize: 25, color: 'black', textAlign: 'center', marginTop: 10, marginBottom: 10}}>15th</Text>
        <Text style={{fontSize: 20, color: 'black', textAlign: 'center', marginTop: 10, marginBottom: 10}}>Jul</Text>
    </Surface>)
}