import { Pressable } from "react-native";
import axios from "axios";
import { useState } from "react";
import { Alert } from "react-native";
import serverIP from "../../modules/serverIP";
import { queryClient } from "../../App";
import DatePicker from "react-native-date-picker";
import { Picker } from "@react-native-picker/picker";
import { convertToTimeAndDate } from "../../modules/coreLogic";
import { getCurrentUser } from "aws-amplify/auth";
import { Dialog, Portal, TextInput, Button } from "react-native-paper";

export default function CreateScheduleForm(props) {
    const [title, setTitle] = useState("");
    const [boxSizeNumber, setBoxSizeNumber] = useState("30");
    const [boxSizeUnit, setBoxSizeUnit] = useState("min");
    let wakeupDateTime = new Date();
    wakeupDateTime.setHours(7);
    wakeupDateTime.setMinutes(0);
    const [wakeupTime, setWakeupTime] = useState(wakeupDateTime);
    const [wakeupTimeText, setWakeupTimeText] = useState("07:00");
    const [wakeupTimeModalVisible, setWakeupTimeModalVisible] = useState(false);
    const [alert, setAlert] = useState({shown: false, title: "", message: ""});
    

    async function createSchedule() {
        const { userId } = await getCurrentUser();
        axios.post(serverIP+'/createSchedule', {
            title,
            boxSizeNumber: parseInt(boxSizeNumber),
            boxSizeUnit,
            wakeupTime: wakeupTimeText,
            userUUID: userId, 
        },
        {headers: { 'Origin': 'http://localhost:3000' }}
        ).then(async () => {
            setWakeupTimeModalVisible(false);
            setAlert({shown: true, title: "Timebox", message: "Created schedule!"});
            await queryClient.refetchQueries();
        }).catch(function(error) {
            setWakeupTimeModalVisible(false);
            setAlert({shown: true, title: "Error", message: "An error occurred, please try again or contact the developer"});
            console.log(error); 
        })
    }

    return (
    <>
        <Portal>
          <Dialog style={{backgroundColor: '#C5C27C'}} visible={props.visible} onDismiss={props.close}>
            <Dialog.Title style={{color: 'white'}}>Create Schedule</Dialog.Title>
            <Dialog.Content>
                <TextInput label="Title" value={title} onChangeText={setTitle} style={{backgroundColor: 'white', marginBottom: 2}} selectionColor="black" textColor="black"/>
                <TextInput label="Timebox Duration" value={boxSizeNumber} onChangeText={setBoxSizeNumber} 
                style={{backgroundColor: 'white', marginBottom: 2}} 
                selectionColor="black" 
                textColor="black"/>
                <TextInput label="Timebox Unit"  value={boxSizeUnit} style={{backgroundColor: 'white', marginBottom: 2 }} selectionColor="black" textColor="black"
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
                    style={{backgroundColor: 'white', marginBottom: 2}} 
                    selectionColor="black" 
                    textColor="black"/>
                </Pressable>
            </Dialog.Content>
            <Dialog.Actions>
                <Button textColor="white" onPress={props.close}>Close</Button>
                <Button textColor="black"  buttonColor="white" mode="contained" onPress={createSchedule}>Create</Button>
            </Dialog.Actions>
          </Dialog>
            <Alert visible={alert.shown} close={setAlert({...alert, shown: false})} title={alert.title} message={alert.message}/>
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