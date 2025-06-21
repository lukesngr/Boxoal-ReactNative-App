import { Pressable } from "react-native";
import axios from "axios";
import { useState } from "react";
import serverIP from "../../modules/serverIP";
import { queryClient } from '../../modules/queryClient.js';
import { Dialog, Portal, TextInput, Button, Text } from "react-native-paper";
import Alert from "../Alert";
import { styles } from "../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import * as Sentry from "@sentry/nextjs";

export default function EditScheduleForm(props) {
    const dispatch = useDispatch();
    const [title, setTitle] = useState(props.data.title);
    const [alert, setAlert] = useState({shown: false, title: "", message: ""});
    const profile = useSelector(state => state.profile.value);
    
    async function updateSchedule() {
        axios.put(serverIP+'/updateSchedule', {
            title,
            id: props.data.id, 
        }).then(async () => {
            props.close();
            setAlert({shown: true, title: "Timebox", message: "Updated schedule!"});
            await queryClient.refetchQueries();
            
        }).catch(function(error) {
            props.close();
            setAlert({shown: true, title: "Error", message: "An error occurred, please try again or contact the developer"});
            console.log(error); 
        })
    }

    async function deleteSchedule() {
        let scheduleBefore = (profile.scheduleIndex-1);
        axios.post(serverIP+'/deleteSchedule', {
            id: props.data.id
        },).then(async () => {
            props.close();
            if(profile.scheduleIndex > 0) {
                dispatch({type: 'profile/set', payload: {...profile, scheduleIndex: scheduleBefore}});
            }
            setAlert({shown: true, title: "Timebox", message: "Deleted schedule!"});
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
            {alert.shown && <Alert visible={alert.shown} close={() => setAlert({...alert, shown: false})} title={alert.title} message={alert.message}/> }
        </Portal>
    </>)
}