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
import { styles } from "../../styles/styles";

export default function EditGoalForm(props) {
    const [name, setName] = useState(props.data.name);
    const [priority, setPriority] = useState(""+props.data.priority);
    const [targetDate, setTargetDate] = useState(new Date(props.data.targetDate));
    const [visible, setVisible] = useState(false);

    function updateGoal() {
        axios.put(serverIP+'/updateGoal', {
            name,
            priority: parseInt(priority), //damn thing won't convert auto even with number input
            targetDate: targetDate.toISOString(), 
            id: props.data.id
        },
        {headers: { 'Origin': 'http://localhost:3000' }}
        ).then(async () => {
            Alert.alert("Updated goal!");
            await queryClient.refetchQueries();
        }).catch(function(error) {
            Alert.alert("Error occurred please try again or contact developer");
            console.log(error); 
        })
    }
    
    function deleteGoal() {
        
        axios.post(serverIP+'/deleteGoal', {
            id: props.data.id
        },
        {headers: { 'Origin': 'http://localhost:3000' }}
        ).then(async () => {   
            Alert.alert("Deleted goal!");
            await queryClient.refetchQueries();
        }).catch(function(error) {
            Alert.alert("Error occurred please try again or contact developer");
            console.log(error); 
        });
    }

    return (
    <>
        <View style={styles.overallModal}>
                <View style={styles.titleBarContainer}>  
                    <Text style={styles.title}>Edit Goal</Text>
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
                <Button textStyle={styles.buttonTextStyle} outlineStyle={styles.buttonOutlineStyle} title="Delete" onPress={deleteGoal} />
                <Button textStyle={styles.buttonTextStyle} outlineStyle={styles.buttonOutlineStyle} title="Update" onPress={updateGoal} />
        </View>
        <DatePicker modal mode="date" date={targetDate} onDateChange={(date) => setTargetDate(date)} open={visible} 
        onConfirm={(date) => { setTargetDate(date); setVisible(false); }} onCancel={() => setVisible(false)}></DatePicker>
    </>)
}