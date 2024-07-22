import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { StyleSheet, View, Text, Pressable, TextInput } from "react-native";
import axios from "axios";
import { useState } from "react";
import { Alert } from "react-native";
import serverIP from "../../modules/serverIP";
import Button from "./Button";
import { queryClient } from "../../App";
import { styles } from '../../styles/styles';

export default function EditTimeboxForm(props) {
    const [title, setTitle] = useState(props.data.title);
    const [description, setDescription] = useState(props.data.description);

    function updateTimeBox() {
        axios.put(serverIP+'/updateTimeBox', {
            title,
            description, 
            id: props.data.id
        },
        {headers: { 'Origin': 'http://localhost:3000' }}
        ).then(async () => {
            Alert.alert("Updated timebox!");
            await queryClient.refetchQueries();
        }).catch(function(error) {
            Alert.alert("Error occurred please try again or contact developer");
            console.log(error); 
        })
    }
    
    function deleteTimeBox() {
        
        axios.post(serverIP+'/deleteTimebox', {
            id: props.data.id
        },
        {headers: { 'Origin': 'http://localhost:3000' }}
        ).then(async () => {   
            Alert.alert("Deleted timebox!");
            await queryClient.refetchQueries();
        }).catch(function(error) {
            Alert.alert("Error occurred please try again or contact developer");
            console.log(error); 
        });
    }

    function clearRecording() {
        
        axios.post(serverIP+'/clearRecording', {
            id: props.data.id
        },
        {headers: { 'Origin': 'http://localhost:3000' }}
        ).then(async () => {   
            Alert.alert("Cleared recording!");
            await queryClient.refetchQueries();
        }).catch(function(error) {
            Alert.alert("Error occurred please try again or contact developer");
            console.log(error); 
        });
    }


    return (
    <View style={styles.overallModal}>
            <View style={styles.titleBarContainer}>  
                <Text style={styles.title}>Edit Timebox</Text>
                <Pressable onPress={props.close}>
                    <FontAwesomeIcon icon={faArrowLeft} size={25}/>
                </Pressable>
            </View>
            <Text style={styles.label}>Title</Text>
            <TextInput style={styles.textInput} onChangeText={setTitle} value={title}></TextInput>
            <Text style={styles.label}>Description</Text>
            <TextInput style={styles.textInput} placeholderTextColor={"black"} onChangeText={setDescription} value={description}></TextInput>
            <Button textStyle={styles.buttonTextStyle} outlineStyle={styles.buttonOutlineStyle} title="Update" onPress={updateTimeBox} />
            {props.previousRecording && <Button textStyle={styles.buttonTextStyle} outlineStyle={styles.buttonOutlineStyle} title="Clear Recording" onPress={clearRecording} />}
            <Button textStyle={styles.buttonTextStyle} outlineStyle={styles.buttonOutlineStyle} title="Delete" onPress={deleteTimeBox} />
    </View>)
}