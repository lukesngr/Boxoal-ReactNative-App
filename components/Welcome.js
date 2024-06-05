import { Text } from "react-native"

let styles = {
    title: {
        color: 'black',
        fontSize: 28,
        textAlign: 'center',
        marginTop: 10,
        padding: 10,
    },
    subtitle: {
        fontSize: 23,
        color: 'black',
        marginLeft: 10,
    }
}
export default function Welcome() {
    return (<>
        <Text style={styles.title}>Welcome to Boxoal</Text>
        <Text style={styles.subtitle}>Please create a schedule</Text>
        <Text style={styles.subtitle}>After this:</Text>
        <Text style={styles.subtitle}>- Add goal via schedules view</Text>
        <Text style={styles.subtitle}>- Add timeboxes via timeboxes view(click on desired box)</Text>
    </>)
}