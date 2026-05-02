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
import { Picker } from "@react-native-picker/picker";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import uuid from 'react-native-uuid';
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthSession } from "aws-amplify/auth";

export default function CreateGoalForm(props) {
    const dispatch = useDispatch();
    const [title, setTitle] = useState("");
    const [targetDate, setTargetDate] = useState(new Date());
    const [targetDateText, setTargetDateText] = useState(dayjs(targetDate).format('D MMMM YYYY'));
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [hasMetric, setHasMetric] = useState(false);
    const [metric, setMetric] = useState(0);
    const {scheduleIndex, wakeupTime, goalLimit} = useSelector(state => state.profile.value);
    const {goalsActive, goalsCompleted} = useSelector(state => state.goalStatistics.value);
    let goalsNotCompleted = goalsActive - goalsCompleted;

    const createGoalMutation = useMutation({
        mutationFn: ({ goalData, headers }) => axios.post(serverIP+'/createGoal', goalData, headers),
        onMutate: async ({ goalData, headers }) => {
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
            dispatch({type: 'alert/set', payload: { open: true, title: "Goal", message: "Created goal!" }});
            queryClient.invalidateQueries(['schedule']); // Refetch to get real data
        },
        onError: (error, goalData, context) => {
            queryClient.setQueryData(['schedule'], context.previousGoals);
            props.close();
            dispatch({type: 'alert/set', payload: { open: true, title: "Error", message: "An error occurred, please try again or contact the developer" }});
            queryClient.invalidateQueries(['schedule']);
            
        }
    });

    async function createGoal() {
        const isActiveOnInTree = props.active ? "active" : "waiting";
        const wakeupTimeSplitted = wakeupTime.split(':');
        const alteredDate = dayjs(targetDate).hour(wakeupTimeSplitted[0]).minute(wakeupTimeSplitted[1]);

        const goalData = {
            title,
            targetDate: alteredDate.toISOString(),
            schedule: {
                connect: {
                    id: props.id
                }
            },
            completed: false,
            completedOn: new Date().toISOString(),
            partOfLine: props.line,
            state: isActiveOnInTree,
            active: props.active,
            objectUUID: uuid.v4()
        }

        if(hasMetric) {
            goalData.metric = Number(metric);
        }
        if (goalLimit > goalsNotCompleted || goalLimit == -1 || !props.active) {
            const session = await fetchAuthSession();
            const accessToken = session.tokens?.accessToken.toString();
            const headers = {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            };
            createGoalMutation.mutate({ goalData, headers });
        } else {
            dispatch({type: 'alert/set', payload: { open: true, title: "Error", message: "Please complete more goals and we will unlock more goal slots for you!" }});
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
                <TextInput 
                    label="Metric?" 
                    value={hasMetric ? "Yes" : "No"} 
                    {...styles.paperInput}
                    render={(props) => (
                        <Picker style={styles.forms.pickerParentStyle} dropdownIconColor='black' selectedValue={hasMetric} onValueChange={setHasMetric}>
                            <Picker.Item styles={styles.forms.pickerItemStyle} label="False" value={false} />
                            <Picker.Item styles={styles.forms.pickerItemStyle} label="True" value={true} />
                        </Picker>
                )}></TextInput>
                {hasMetric && <TextInput label="Metric" value={metric} onChangeText={setMetric} {...styles.paperInput}/> }
            </Dialog.Content>
            <Dialog.Actions>
                <Button testID="createGoalButton" {...styles.forms.actionButton} mode="contained" onPress={createGoal}>Create</Button>
                <Button {...styles.forms.actionButton} onPress={props.close}>Close</Button>
            </Dialog.Actions>
          </Dialog>
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
