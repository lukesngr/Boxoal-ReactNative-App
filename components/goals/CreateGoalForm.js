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

import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import uuid from 'react-native-uuid';
import { useSelector } from "react-redux";

export default function CreateGoalForm(props) {
    const [title, setTitle] = useState("");
    const [targetDate, setTargetDate] = useState(new Date());
    const [targetDateText, setTargetDateText] = useState(dayjs(targetDate).format('D MMMM YYYY'));
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [alert, setAlert] = useState(false);
    const {scheduleIndex} = useSelector(state => state.profile.value);
    let goalsCompleted = props.goals.reduce((count, item) => item.completed ? count + 1 : count, 0);
    let goalsNotCompleted = props.goals.length - goalsCompleted;
    let maxNumberOfGoals = getMaxNumberOfGoals(goalsCompleted);

    const createGoalMutation = useMutation({
        mutationFn: (goalData) => axios.post(serverIP+'/createGoal', goalData),
        onMutate: async (goalData) => {
            await queryClient.cancelQueries(['schedule']); 
            
            const previousGoals = queryClient.getQueryData(['schedule']);
            
            queryClient.setQueryData(['schedule'], (old) => {
                if (!old) return old;
                let copyOfOld = JSON.parse(JSON.stringify(old));
                copyOfOld[scheduleIndex].goals.push({...goalData, timeboxes: []});
                return copyOfOld;
            });
            
            
            return { previousGoals };
        },
        onSuccess: () => {
            props.close();
            setAlert({ open: true, title: "Timebox", message: "Created goal!" });
            queryClient.invalidateQueries(['schedule']); // Refetch to get real data
        },
        onError: (error, goalData, context) => {
            queryClient.setQueryData(['schedule'], context.previousGoals);
            props.close();
            setAlert({ open: true, title: "Error", message: "An error occurred, please try again or contact the developer" });
            queryClient.invalidateQueries(['schedule']);
            
        }
    });

    function createGoal() {
        let goalData = {
            title,
            targetDate: targetDate.toISOString(),
            schedule: {
                connect: {
                    id: props.id
                }
            },
            completed: false,
            completedOn: new Date().toISOString(),
            partOfLine: props.line,
            active: props.active,
            objectUUID: uuid.v4()
        }

        if(maxNumberOfGoals > goalsNotCompleted | !(props.active)) {
            createGoalMutation.mutate(goalData);
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
                    setTargetDateText(dayjs(date).format('D MMMM YYYY'));
                }
            } 
            open={datePickerVisible} 
            onConfirm={(date) => { 
                setTargetDate(date); 
                setDatePickerVisible(false);
                setTargetDateText(dayjs(date).format('D MMMM YYYY'));
            }} 
            onCancel={() => setDatePickerVisible(false)}>
        </DatePicker>
    </>)
}