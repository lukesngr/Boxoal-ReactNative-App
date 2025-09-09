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

export default function EditGoalForm(props) {
    const dispatch = useDispatch();
    const [title, setTitle] = useState(props.data.title);
    const [targetDate, setTargetDate] = useState(new Date(props.data.targetDate));
    const [completed, setCompleted] = useState(props.data.state == 'completed');
    const [targetDateText, setTargetDateText] = useState(dayjs(targetDate).format('D MMMM YYYY'));
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const {scheduleIndex, wakeupTime} = useSelector(state => state.profile.value);
    const [hasMetric, setHasMetric] = useState(props.data.metric === null ? (false) : (true));
    const [metric, setMetric] = useState(props.data.metric);
    const [onLogMetricView, setOnLogMetricView] = useState(false);

    const updateGoalMutation = useMutation({
        mutationFn: (goalData) => axios.put(serverIP+'/updateGoal', goalData),
        onMutate: async (goalData) => {
            await queryClient.cancelQueries(['schedule']); 
            
            const previousGoals = queryClient.getQueryData(['schedule']);
            
            queryClient.setQueryData(['schedule'], (old) => {
                if (!old) return old;
                let copyOfOld = JSON.parse(JSON.stringify(old));
                let goalIndex = copyOfOld[scheduleIndex].goals.findIndex(element => element.objectUUID == props.data.objectUUID);
                copyOfOld[scheduleIndex].goals[goalIndex] = {...goalData, timeboxes: copyOfOld[scheduleIndex].goals[goalIndex].timeboxes};
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

    function updateGoal() {
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
        
        updateGoalMutation.mutate(goalData);

        if(completed) {
            axios.get(serverIP+'/setNextGoalToActive', {line: props.data.partOfLine}).then(async () => {
                await queryClient.refetchQueries();
            }).catch(function(error) {
                
            })
        };
    }
    
    function deleteGoal() {
        
        axios.post(serverIP+'/deleteGoal', {
            id: props.data.id
        }).then(async () => {   
            props.close();
            dispatch({type: 'alert/set', payload: {open: true, title: "Goal", message: "Deleted goal!"}});
            await queryClient.refetchQueries();
        }).catch(function(error) {
            props.close();
            dispatch({type: 'alert/set', payload: {open: true, title: "Error", message: "An error occurred, please try again or contact the developer"}});
            
        });
    }

    function logMetric() {
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
                const alteredDate = targetDate.hour(wakeupTimeSplitted[0]).minute(wakeupTimeSplitted[1]);

                const goalData = {
                    title,
                    targetDate: alteredDate.toISOString(),
                    objectUUID: props.data.objectUUID,
                    completed: true,
                    completedOn: new Date().toISOString(),
                    active: !completed,
                    state: "completed",
                }
                
                updateGoalMutation.mutate(goalData);

                axios.get('/api/setNextGoalToActive', {line: props.data.partOfLine}).then(async () => {
                    await queryClient.refetchQueries();
                }).catch(function() {
                })
            }else{

                axios.post('/api/logMetric', data)
                .then(async () => {
                    close();
                    dispatch({type: 'alert/set', payload: { open: true, title: "Goal", message: "Logged metric!" }});
                    await queryClient.refetchQueries();
                })
                .catch(function() {
                    close();
                    dispatch({type: 'alert/set', payload: { open: true, title: "Error", message: "An error occurred, please try again or contact the developer" }});
                });
            }
        }else {
            setOnLogMetricView(true);
        }
    }

    return (
    <>
        <Portal>
          <Dialog style={styles.forms.dialogStyle} visible={props.visible} onDismiss={props.close}>
            <Dialog.Title style={styles.forms.dialogTitleStyle}>Edit Goal</Dialog.Title>
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
                <Button {...styles.forms.actionButton} mode="contained" onPress={updateGoal}>Update</Button>
                <Button {...styles.forms.nonActionButton} onPress={deleteGoal}>Delete</Button>
                <Button {...styles.forms.nonActionButton} onPress={props.close}>Close</Button>
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