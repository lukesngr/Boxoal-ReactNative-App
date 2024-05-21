import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { StyleSheet, View, Text, Pressable, TextInput, Button } from "react-native";
import axios from "axios";
import { useState } from "react";
import { Alert } from "react-native";
import serverIP from "../../modules/serverIP";
import { queryClient } from "../../App";

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



export default function EditTimeboxForm(props) {
    const [title, setTitle] = useState(props.data.title);
    const [description, setDescription] = useState(props.data.description);

    function updateTimeBox() {
        axios.post(serverIP+'/updateTimeBox', {
            title,
            description, 
            id: props.data.id
        },
        {headers: { 'Origin': 'http://localhost:3000' }}
        ).then(function() {
            queryClient.refetchQueries();
            Alert.alert("Updated timebox!");
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
        ).then(() => {        
            queryClient.refetchQueries();
            Alert.alert("Deleted timebox!");
            
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
            <Button textStyle={styles.buttonTextStyle} outlineStyle={styles.buttonOutlineStyle} title="Delete" onPress={deleteTimeBox} />
            <Button textStyle={styles.buttonTextStyle} outlineStyle={styles.buttonOutlineStyle} title="Update" onPress={updateTimeBox} />
    </View>)
}