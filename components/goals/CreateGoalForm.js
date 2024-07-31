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

export default function CreateGoalForm(props) {
    const [name, setName] = useState("");
    const [priority, setPriority] = useState("1");
    const [targetDate, setTargetDate] = useState(new Date());
    const [targetDateText, setTargetDateText] = useState(targetDate.toISOString());
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [alert, setAlert] = useState(false);
    

    function createGoal() {
        axios.post(serverIP+'/createGoal', {
            name,
            priority: parseInt(priority), //damn thing won't convert auto even with number input
            targetDate: new Date(targetDate).toISOString(),
            schedule: {connect: {id: props.id}} 
        },
        ).then(async () => {
            props.close();
            setAlert({shown: true, title: "Timebox", message: "Created goal!"});
            await queryClient.refetchQueries();
        }).catch(function(error) {
            props.close();
            setAlert({shown: true, title: "Error", message: "An error occurred, please try again or contact the developer"});
            console.log(error);
        })
    }

    return (
    <>
        <Portal>
          <Dialog style={{backgroundColor: '#C5C27C'}} visible={props.visible} onDismiss={props.close}>
            <Dialog.Title style={{color: 'white'}}>Create Goal</Dialog.Title>
            <Dialog.Content>
                <TextInput label="Name" value={name} onChangeText={setName} style={{backgroundColor: 'white', marginBottom: 2}} selectionColor="black" textColor="black"/>
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
            </Dialog.Content>
            <Dialog.Actions>
                <Button textColor="white" onPress={props.close}>Close</Button>
                <Button textColor="black"  buttonColor="white" mode="contained" onPress={createGoal}>Create</Button>
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