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
    const [boxSizeNumber, setBoxSizeNumber] = useState(props.data.boxSizeNumber.toString());
    const [boxSizeUnit, setBoxSizeUnit] = useState(props.data.boxSizeUnit);
    let wakeupDateTime = new Date();
    wakeupDateTime.setHours(props.data.wakeupTime.split(':')[0]);
    wakeupDateTime.setMinutes(props.data.wakeupTime.split(':')[1]);
    const [wakeupTime, setWakeupTime] = useState(wakeupDateTime);
    const [wakeupTimeText, setWakeupTimeText] = useState(props.data.wakeupTime);
    const [wakeupTimeModalVisible, setWakeupTimeModalVisible] = useState(false);
    const [alert, setAlert] = useState({shown: false, title: "", message: ""});
    const selectedSchedule = useSelector(state => state.selectedSchedule.value);
    
    async function updateSchedule() {
        axios.put(serverIP+'/updateSchedule', {
            title,
            boxSizeNumber: parseInt(boxSizeNumber),
            boxSizeUnit,
            wakeupTime: wakeupTimeText,
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
        axios.post(serverIP+'/deleteSchedule', {
            id: props.data.id
        },).then(async () => {
            props.close();
            if(selectedSchedule > 0) {
                dispatch({type: 'selectedSchedule/set', payload: selectedSchedule-1});
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
                <TextInput label="Timebox Duration" value={boxSizeNumber} onChangeText={setBoxSizeNumber} {...styles.paperInput}/>
                <TextInput label="Timebox Unit"  value={boxSizeUnit} {...styles.paperInput}
	                render={(props) => (
                        <Picker style={{color: 'black', marginTop: 5}} dropdownIconColor='black' selectedValue={boxSizeUnit} onValueChange={setBoxSizeUnit}>
                            <Picker.Item label="Min" value="min" />
                            <Picker.Item label="Hour" value="hr" />
                        </Picker>
	                )}
                />
                <Pressable onPress={() => setWakeupTimeModalVisible(true)}>
                    <TextInput 
                    label="Wakeup time" 
                    value={wakeupTimeText}
                    right={<TextInput.Icon onPress={() => setWakeupTimeModalVisible(true)} icon="clock-edit" />} 
                    editable={false} 
                    {...styles.paperInput}/>
                </Pressable>
            </Dialog.Content>
            <Dialog.Actions>
                <Button textColor="white" onPress={props.close}>Close</Button>
                <Button textColor="white" onPress={deleteSchedule}>Delete</Button>
                <Button textColor="black" buttonColor="white" mode="contained" onPress={updateSchedule}>Update</Button>
            </Dialog.Actions>
          </Dialog>
            {alert.shown && <Alert visible={alert.shown} close={() => setAlert({...alert, shown: false})} title={alert.title} message={alert.message}/> }
        </Portal>
        <DatePicker 
            modal 
            mode="time" 
            date={wakeupTime} 
            onDateChange={
                (date) => {
                    setWakeupTime(date);
                    setWakeupTimeText(convertToTimeAndDate(date)[0]);
                }
            } 
            open={wakeupTimeModalVisible} 
            onConfirm={(date) => { 
                setWakeupTime(date); 
                setWakeupTimeModalVisible(false);
                setWakeupTimeText(convertToTimeAndDate(date)[0]);
            }} 
            onCancel={() => setWakeupTimeModalVisible(false)}>
        </DatePicker>
    </>)
}