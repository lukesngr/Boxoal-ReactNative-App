import { Pressable } from "react-native";
import axios from "axios";
import { useState } from "react";
import serverIP from "../../modules/serverIP";
import { queryClient } from '../../modules/queryClient.js';
import DatePicker from "react-native-date-picker";
import { Picker } from "@react-native-picker/picker";
import { convertToTimeAndDate } from "../../modules/coreLogic";
import { Dialog, Portal, TextInput, Button, Text } from "react-native-paper";
import Alert from "../Alert";
import { styles } from "../../styles/styles";
import { useDispatch, useSelector } from "react-redux";

export default function EditScheduleForm(props) {
    const dispatch = useDispatch();
    const [title, setTitle] = useState(props.data.title);
    const [alert, setAlert] = useState({shown: false, title: "", message: ""});
    const profile = useSelector(state => state.selectedSchedule.value);
    
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
        let scheduleBefore = (profile.scheduleID-1);
        axios.post(serverIP+'/deleteSchedule', {
            id: props.data.id
        },).then(async () => {
            props.close();
            if(profile.scheduleID > 0) {
                dispatch({type: 'profile/set', payload: {...profile, scheduleID: scheduleBefore}});
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
          <Dialog style={{backgroundColor: '#C5C27C'}} visible={props.visible} onDismiss={props.close}>
            <Dialog.Title style={{color: 'white'}}>Edit Schedule</Dialog.Title>
            <Dialog.Content>
                <TextInput label="Title" value={title} onChangeText={setTitle} {...styles.paperInput}/>
                
            </Dialog.Content>
            <Dialog.Actions>
                <Button textColor="white" onPress={props.close}>Close</Button>
                <Button textColor="white" onPress={deleteSchedule}>Delete</Button>
                <Button textColor="black" buttonColor="white" mode="contained" onPress={updateSchedule}>Update</Button>
            </Dialog.Actions>
          </Dialog>
            {alert.shown && <Alert visible={alert.shown} close={() => setAlert({...alert, shown: false})} title={alert.title} message={alert.message}/> }
        </Portal>
    </>)
}