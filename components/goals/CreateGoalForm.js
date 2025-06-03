import {  Pressable  } from "react-native";
import axios from "axios";
import { useState } from "react";
import serverIP from "../../modules/serverIP";
import { queryClient } from '../../modules/queryClient.js';
import DatePicker from "react-native-date-picker";
import { styles } from "../../styles/styles";
import { Dialog, Portal, TextInput, Button } from "react-native-paper";
import Alert from "../Alert";
import { getMaxNumberOfGoals } from "../../modules/coreLogic.js";

export default function CreateGoalForm(props) {
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState("1");
    const [targetDate, setTargetDate] = useState(new Date());
    const [targetDateText, setTargetDateText] = useState(targetDate.toISOString());
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [alert, setAlert] = useState(false);
    let goalsCompleted = props.goals.reduce((count, item) => item.completed ? count + 1 : count, 0);
    let goalsNotCompleted = props.goals.length - goalsCompleted;
    let maxNumberOfGoals = getMaxNumberOfGoals(goalsCompleted);

    function createGoal() {
        if(maxNumberOfGoals > goalsNotCompleted | !(props.active)) {
            axios.post(serverIP+'/createGoal', {
                title,
                priority: parseInt(priority), //damn thing won't convert auto even with number input
                targetDate: new Date(targetDate).toISOString(),
                schedule: {
                    connect: 
                    {
                        id: props.id
                    }
                },
                completed: false,
                completedOn: new Date().toISOString(),
                partOfLine: props.line,
                active: props.active 
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
        }else{
            setAlert({shown: true, title: "Error", message: "Please complete more goals and we will unlock more goal slots for you!"});
        }
    }

    return (
    <>
        <Portal>
          <Dialog style={styles.forms.dialogStyle} visible={props.visible} onDismiss={props.close}>
            <Dialog.Title style={styles.forms.dialogTitleStyle}>Create Goal</Dialog.Title>
            <Dialog.Content>
                <TextInput testID="createGoalTitle" label="Title" value={title} onChangeText={setTitle} {...styles.paperInput}/>
                <TextInput label="Priority(1-10)" value={priority} onChangeText={setPriority} {...styles.paperInput} 
                selectionColor="black" textColor="black"/>
                <Pressable onPress={() => setDatePickerVisible(true)}>
                    <TextInput 
                    label="Target date" 
                    value={targetDateText}
                    right={<TextInput.Icon onPress={() => setDatePickerVisible(true)} icon="calendar-edit" />} 
                    editable={false} 
                    {...styles.paperInput} />
                </Pressable>
            </Dialog.Content>
            <Dialog.Actions>
                <Button testID="createGoalButton" {...styles.forms.actionButton} mode="contained" onPress={createGoal}>Create</Button>
                <Button {...styles.forms.actionButton} onPress={props.close}>Close</Button>
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