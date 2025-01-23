import {  Pressable  } from "react-native";
import axios from "axios";
import { useState } from "react";
import serverIP from "../../modules/serverIP";
import { queryClient } from '../../modules/queryClient.js';
import DatePicker from "react-native-date-picker";
import { styles } from "../../styles/styles";
import { Dialog, Portal, TextInput, Button } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import Alert from "../Alert";

export default function EditGoalForm(props) {
    const [title, setTitle] = useState(props.data.title);
    const [priority, setPriority] = useState(""+props.data.priority);
    const [targetDate, setTargetDate] = useState(new Date(props.data.targetDate));
    const [completed, setCompleted] = useState(props.data.completed);
    const [targetDateText, setTargetDateText] = useState(targetDate.toISOString());
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [alert, setAlert] = useState(false);

    function updateGoal() {
        axios.put(serverIP+'/updateGoal', {
            title,
            priority: parseInt(priority), //damn thing won't convert auto even with number input
            targetDate: targetDate.toISOString(), 
            id: props.data.id,
            completed,
            completedOn: new Date().toISOString()
        }
        ).then(async () => {
            props.close();
            setAlert({shown: true, title: "Timebox", message: "Updated goal!"});
            await queryClient.refetchQueries();
        }).catch(function(error) {
            props.close();
            setAlert({shown: true, title: "Error", message: "An error occurred, please try again or contact the developer"});
            console.log(error);
        })
    }
    
    function deleteGoal() {
        
        axios.post(serverIP+'/deleteGoal', {
            id: props.data.id
        }).then(async () => {   
            props.close();
            setAlert({shown: true, title: "Timebox", message: "Deleted goal!"});
            await queryClient.refetchQueries();
        }).catch(function(error) {
            props.close();
            setAlert({shown: true, title: "Error", message: "An error occurred, please try again or contact the developer"});
            console.log(error);
        });
    }

    return (
    <>
        <Portal>
          <Dialog style={{backgroundColor: '#C5C27C'}} visible={props.visible} onDismiss={props.close}>
            <Dialog.Title style={{color: 'white'}}>Edit Goal</Dialog.Title>
            <Dialog.Content>
                <TextInput label="Title" value={title} onChangeText={setTitle} style={{backgroundColor: 'white', marginBottom: 2}} selectionColor="black" textColor="black"/>
                <TextInput label="Priority(1-10)" value={priority} onChangeText={setPriority} style={{backgroundColor: 'white', marginBottom: 2}} 
                selectionColor="black" textColor="black"/>
                <Pressable onPress={() => setDatePickerVisible(true)}>
                    <TextInput 
                    label="Target date" 
                    value={targetDateText}
                    right={<TextInput.Icon onPress={() => setDatePickerVisible(true)} icon="calendar-edit" />} 
                    editable={false} 
                    style={{backgroundColor: 'white', marginBottom: 2}} 
                    selectionColor="black" 
                    textColor="black"/>
                </Pressable>
                <Picker style={{color: 'black', marginTop: 5}} dropdownIconColor='black' selectedValue={completed} onValueChange={setCompleted}>
                    <Picker.Item label="False" value={false} />
                    <Picker.Item label="True" value={true} />
                </Picker>
            </Dialog.Content>
            <Dialog.Actions>
                <Button textColor="white" onPress={props.close}>Close</Button>
                <Button textColor="white" onPress={deleteGoal}>Delete</Button>
                <Button textColor="black"  buttonColor="white" mode="contained" onPress={updateGoal}>Update</Button>
            </Dialog.Actions>
          </Dialog>
            {alert.shown && <Alert visible={alert.shown} close={() => setAlert({...alert, shown: false})} title={alert.title} message={alert.message}/> }
        </Portal>
        <DatePicker 
            modal 
            mode="date" 
            date={targetDate} 
            onDateChange={
                (date) => {
                    setTargetDate(date);
                    setTargetDateText(date.toISOString());
                }
            } 
            open={datePickerVisible} 
            onConfirm={(date) => { 
                setTargetDate(date); 
                setDatePickerVisible(false);
                setTargetDateText(date.toISOString());
            }} 
            onCancel={() => setDatePickerVisible(false)}>
        </DatePicker>
    </>)
}