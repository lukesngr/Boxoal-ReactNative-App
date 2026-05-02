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
import { useMutation } from "@tanstack/react-query";

import dayjs from "dayjs";
import { useSelector, useDispatch } from "react-redux";
import { fetchAuthSession } from "aws-amplify/auth";

export default function EditGoalForm(props) {
    const dispatch = useDispatch();
    const [title, setTitle] = useState(props.data.title);
    const [targetDate, setTargetDate] = useState(new Date(props.data.targetDate));
    const [completed, setCompleted] = useState(props.data.state == 'completed');
    const [targetDateText, setTargetDateText] = useState(dayjs(targetDate).format('D MMMM YYYY'));
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const {scheduleIndex, wakeupTime} = useSelector(state => state.profile.value);
    const [hasMetric, setHasMetric] = useState(props.data.metric === null ? (false) : (true));
    const [metric, setMetric] = useState(props.data.metric != null ? String(props.data.metric) : '');
    const [onLogMetricView, setOnLogMetricView] = useState(false);

    function closeMetricView() {
    	if(props.data.metric != null) {
	  setMetric(String(props.data.metric))
        }else{ 
	  setMetric('')
        }
        setOnLogMetricView(false)
   }

    const updateGoalMutation = useMutation({
        mutationFn: ({ goalData, headers }) => axios.put(serverIP+'/updateGoal', goalData, headers),
        onMutate: async ({ goalData, headers }) => {
            await queryClient.cancelQueries(['schedule']); 
            
            const previousGoals = queryClient.getQueryData(['schedule']);
            
            queryClient.setQueryData(['schedule'], (old) => {
                if (!old) return old;
                let copyOfOld = JSON.parse(JSON.stringify(old));
                let goalIndex = copyOfOld[scheduleIndex].goals.findIndex(element => element.objectUUID == props.data.objectUUID);
                copyOfOld[scheduleIndex].goals[goalIndex] = {...goalData};
                return copyOfOld;
            });
            
            
            return { previousGoals };
        },
        onSuccess: () => {
            props.close();
            dispatch({type: 'alert/set', payload: { open: true, title: "Goal", message: "Updated goal!" }});
            queryClient.invalidateQueries(['schedule']); // Refetch to get real data
        },
        onError: (error, goalData, context) => {
            queryClient.setQueryData(['schedule'], context.previousGoals);
            props.close();
            
            dispatch({type: 'alert/set', payload: { open: true, title: "Error", message: "An error occurred, please try again or contact the developer" }});
            queryClient.invalidateQueries(['schedule']);
        }
    });

    async function updateGoal() {
        const wakeupTimeSplitted = wakeupTime.split(':');
        const alteredDate = dayjs(targetDate).hour(wakeupTimeSplitted[0]).minute(wakeupTimeSplitted[1]);

        let goalData = {
            title,
            targetDate: alteredDate.toISOString(),
            objectUUID: props.data.objectUUID,
            completed,
            completedOn: new Date().toISOString(),
            active: !completed,
            state: completed ? "completed" : "active",
        }

        if(hasMetric) {
            goalData.metric = Number(metric);
        }
        
        const session = await fetchAuthSession();
        const accessToken = session.tokens?.accessToken.toString();
        const headers = {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        updateGoalMutation.mutate({ goalData, headers });

        if(completed) {
            try {
                await axios.get(serverIP+'/setNextGoalToActive', {line: props.data.partOfLine, ...headers});
                await queryClient.refetchQueries();
            } catch(error) {
                
            }
        };
    }
    
    async function deleteGoal() {
        const session = await fetchAuthSession();
        const accessToken = session.tokens?.accessToken.toString();
        const headers = {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        try {
            await axios.post(serverIP+'/deleteGoal', {
                id: props.data.id
            }, headers);   
            props.close();
            dispatch({type: 'alert/set', payload: {open: true, title: "Goal", message: "Deleted goal!"}});
            await queryClient.refetchQueries();
        } catch(error) {
            props.close();
            dispatch({type: 'alert/set', payload: {open: true, title: "Error", message: "An error occurred, please try again or contact the developer"}});
            
        };
    }

    async function logMetric() {
        if(onLogMetricView) {
            const data = {
                date: new Date().toISOString(),
                metric: Number(metric),
                goal: {
                    connect: {
                        id: props.data.id
                    }
                }
            }

            if(metric >= props.data.metric) {
                const wakeupTimeSplitted = wakeupTime.split(':');
                const alteredDate = dayjs(targetDate).hour(wakeupTimeSplitted[0]).minute(wakeupTimeSplitted[1]);

                const goalData = {
                    title,
                    targetDate: alteredDate.toISOString(),
                    objectUUID: props.data.objectUUID,
                    completed: true,
                    completedOn: new Date().toISOString(),
                    active: !completed,
                    state: "completed",
                }
                
                const session = await fetchAuthSession();
                const accessToken = session.tokens?.accessToken.toString();
                const headers = {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                updateGoalMutation.mutate({ goalData, headers });

                try {
                    await axios.get(serverIP+'/setNextGoalToActive', {line: props.data.partOfLine, ...headers});
                    await queryClient.refetchQueries();
                } catch(error) {
                }
                closeMetricView()
            }else{

                const session = await fetchAuthSession();
                const accessToken = session.tokens?.accessToken.toString();
                const headers = {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                try {
                    await axios.post(serverIP+'/logMetric', data, headers);
                    closeMetricView();
                    props.close();
                    dispatch({type: 'alert/set', payload: { open: true, title: "Goal", message: "Logged metric!" }});
                    await queryClient.refetchQueries();
                } catch(error) {
		    closeMetricView()
                    props.close()
                    dispatch({type: 'alert/set', payload: { open: true, title: "Error", message: "An error occurred, please try again or contact the developer" }});
                }
            }
        }else {
            setOnLogMetricView(true);
        }
    }

    return (
    <>
        <Portal>
          <Dialog style={styles.forms.dialogStyle} visible={props.visible} onDismiss={props.close}>
            <Dialog.Title style={styles.forms.dialogTitleStyle}>{onLogMetricView ? 'Log Metric' : 'Edit Goal'}</Dialog.Title>
            <Dialog.Content>
                {onLogMetricView ? (
                    <TextInput label="Metric" value={metric} onChangeText={setMetric} {...styles.paperInput}/> 
                ) : (<>
                <TextInput label="Title" value={title} onChangeText={setTitle} {...styles.paperInput}/>
                <Pressable onPress={() => setDatePickerVisible(true)}>
                    <TextInput 
                    label="Target date" 
                    value={targetDateText}
                    right={<TextInput.Icon onPress={() => setDatePickerVisible(true)} icon="calendar-edit" />} 
                    editable={false} {...styles.paperInput}/>
                </Pressable>
                <TextInput 
                    label="Completed"
                    value={completed ? "Yes" : "No"} 
                    {...styles.paperInput}
                    render={(props) => (
                        <Picker style={styles.forms.pickerParentStyle} dropdownIconColor='black' selectedValue={completed} onValueChange={setCompleted}>
                            <Picker.Item styles={styles.forms.pickerItemStyle} label="False" value={false} />
                            <Picker.Item styles={styles.forms.pickerItemStyle} label="True" value={true} />
                        </Picker>
                    )}></TextInput>
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
                </>)}
            </Dialog.Content>
            <Dialog.Actions>
                {hasMetric && <Button {...styles.forms.actionButton} mode="contained" onPress={logMetric}>Log Metric</Button>}
                {!onLogMetricView && <Button {...styles.forms.actionButton} mode="contained" onPress={updateGoal}>Update</Button> }
                {!onLogMetricView && <Button {...styles.forms.nonActionButton} onPress={deleteGoal}>Delete</Button> }
                <Button {...styles.forms.nonActionButton} onPress={onLogMetricView ? (closeMetricView) : (props.close)}>Close</Button>
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
