import { faArrowLeft, faCalendar, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { StyleSheet, View, Text, Pressable, TextInput } from "react-native";
import axios from "axios";
import { useState } from "react";
import { Alert } from "react-native";
import serverIP from "../../modules/serverIP";
import Button from "../timeboxes/Button";
import { queryClient } from "../../App";
import DatePicker from "react-native-date-picker";

const styles = StyleSheet.create({
    overallModal: {
        backgroundColor: 'white',
        padding: 10,
        width: '80%',
        height: 'auto',
    },
    title: {
        color: 'black',
        fontSize: 22,
        padding: 0,
        margin: 0,
    },
    label: {
        color: 'black',
        fontSize: 20,
    },
    textInput: {
        color: 'black',
        borderWidth: 1,
        borderColor: 'black',
        padding: 1,
        fontSize: 20,
    },
    buttonOutlineStyle: {
        backgroundColor: '#7FFFD4',
        padding: 5,
        marginTop: 10,
    },
    buttonTextStyle: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
    },
    titleBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 'auto',
        margin: 0,
        padding: 0,
    },
});



export default function CreateGoalForm(props) {
    const [name, setName] = useState("");
    const [priority, setPriority] = useState("1");
    const [targetDate, setTargetDate] = useState(new Date());
    const [visible, setVisible] = useState(false);

    function createGoal() {
        axios.post(serverIP+'/createGoal', {
            name,
            priority: parseInt(priority), //damn thing won't convert auto even with number input
            targetDate: new Date(targetDate).toISOString(),
            schedule: {
                connect: {id: props.id}
            } 
        },
        {headers: { 'Origin': 'http://localhost:3000' }}
        ).then(async () => {
            Alert.alert("Created goal!");
            await queryClient.refetchQueries();
        }).catch(function(error) {
            Alert.alert("Error occurred please try again or contact developer");
            console.log(error); 
        })
    }

    return (
    <>
        <View style={styles.overallModal}>
                <View style={styles.titleBarContainer}>  
                    <Text style={styles.title}>Create Goal</Text>
                    <Pressable onPress={props.close}>
                        <FontAwesomeIcon icon={faXmark} size={25}/>
                    </Pressable>
                </View>
                <Text style={styles.label}>Name</Text>
                <TextInput style={styles.textInput} onChangeText={setName} value={name}></TextInput>
                <Text style={styles.label}>Priority</Text>
                <TextInput style={styles.textInput} keyboardType="numeric" onChangeText={setPriority} value={priority}></TextInput>
                <Text style={styles.label}>Target Date</Text>
                <Pressable onPress={() => setVisible(true)}>
                    <FontAwesomeIcon icon={faCalendar} size={20}/>
                </Pressable>
                <Button textStyle={styles.buttonTextStyle} outlineStyle={styles.buttonOutlineStyle} title="Create" onPress={createGoal} />
        </View>
        <DatePicker modal mode="date" date={targetDate} onDateChange={(date) => setTargetDate(date)} open={visible} 
        onConfirm={(date) => { setTargetDate(date); setVisible(false); }} onCancel={() => setVisible(false)}></DatePicker>
    </>)
}