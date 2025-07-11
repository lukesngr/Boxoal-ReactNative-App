import { Pressable } from "react-native";
import axios from "axios";
import { useState } from "react";
import serverIP from "../../modules/serverIP";
import { queryClient } from '../../modules/queryClient.js';
import { Dialog, Portal, TextInput, Button, Text } from "react-native-paper";
import Alert from "../Alert";
import { styles } from "../../styles/styles";
import { useDispatch, useSelector } from "react-redux";

import { useAuthenticator } from "@aws-amplify/ui-react-native";
import { useMutation } from "@tanstack/react-query";

export default function EditScheduleForm(props) {
    const dispatch = useDispatch();
    const [title, setTitle] = useState(props.data.title);
    const [alert, setAlert] = useState({open: false, title: "", message: ""});
    const profile = useSelector(state => state.profile.value);
    const { user } = useAuthenticator();

    const updateScheduleMutation = useMutation({
        mutationFn: (scheduleData) => axios.put(serverIP+'/updateSchedule', scheduleData),
        onMutate: async (scheduleData) => {
            await queryClient.cancelQueries(['schedule']); 
            
            const previousSchedule = queryClient.getQueryData(['schedule']);;
            queryClient.setQueryData(['schedule'], (old) => {
                if (!old) return old;
                let copyOfOld = JSON.parse(JSON.stringify(old));
                copyOfOld[profile.scheduleIndex].title = scheduleData.title; 
                
                return copyOfOld;
            });
            
            
            return { previousSchedule };
        },
        onSuccess: () => {
            props.close();
            setAlert({
                open: true,
                title: "Timebox",
                message: "Updated schedule!"
            });
            queryClient.invalidateQueries(['schedule']); // Refetch to get real data
        },
        onError: (error, scheduleData, context) => {
            queryClient.setQueryData(['schedule'], context.previousSchedule);
            setAlert({ open: true, title: "Error", message: "An error occurred, please try again or contact the developer" });
            queryClient.invalidateQueries(['schedule']);
            props.close();
        }
    });

    const deleteScheduleMutation = useMutation({
        mutationFn: (scheduleData) => axios.post(serverIP+'/deleteSchedule', scheduleData),
        onMutate: async (scheduleData) => {
            await queryClient.cancelQueries(['schedule']); 
            
            const previousSchedule = queryClient.getQueryData(['schedule']);
            
            queryClient.setQueryData(['schedule'], (old) => {
                if (!old) return old;
                let copyOfOld = JSON.parse(JSON.stringify(old));
                copyOfOld.splice(profile.scheduleIndex, 1); 
                
                return copyOfOld;
            });
            
            
            return { previousSchedule };
        },
        onSuccess: () => {
            let scheduleBefore = (profile.scheduleIndex-1);
            if(profile.scheduleIndex > 0) {
                    dispatch({type: 'profile/set', payload: {...profile, scheduleIndex: scheduleBefore}});
            }
            props.close();
            setAlert({
                open: true,
                title: "Timebox",
                message: "Deleted schedule!"
            });
            queryClient.invalidateQueries(['schedule']); // Refetch to get real data
        },
        onError: (error, scheduleData, context) => {
            queryClient.setQueryData(['schedule'], context.previousSchedule);
            setAlert({ open: true, title: "Error", message: "An error occurred, please try again or contact the developer" });
            queryClient.invalidateQueries(['schedule']);
            
            props.close();
        }
    });

    async function updateSchedule() {
       updateScheduleMutation.mutate({
                title,
                userUUID: user.userId,
                id: props.data.id
        });
    }

    async function deleteSchedule() {
        
        deleteScheduleMutation.mutate({
                userUUID: user.userId,
                id: props.data.id
        });
            
    }

    return (
    <>
        <Portal>
          <Dialog style={styles.forms.dialogStyle} visible={props.visible} onDismiss={props.close}>
            <Dialog.Title style={styles.forms.dialogTitleStyle}>Edit Schedule</Dialog.Title>
            <Dialog.Content>
                <TextInput label="Title" value={title} onChangeText={setTitle} {...styles.paperInput}/>
                
            </Dialog.Content>
            <Dialog.Actions>
                <Button textColor="black" {...styles.forms.actionButton} mode="contained" onPress={updateSchedule}>Update</Button>
                <Button testID="deleteSchedule" {...styles.forms.actionButton} onPress={deleteSchedule}>Delete</Button>
                <Button textColor="white" {...styles.forms.nonActionButton} onPress={props.close}>Close</Button>
            </Dialog.Actions>
          </Dialog>
            {alert.open && <Alert visible={alert.open} close={() => setAlert({...alert, open: false})} title={alert.title} message={alert.message}/> }
        </Portal>
    </>)
}