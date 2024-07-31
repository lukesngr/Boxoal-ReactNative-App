import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { StyleSheet, View, Text, Pressable, TextInput } from "react-native";
import axios from "axios";
import { useState } from "react";
import { Alert } from "react-native";
import serverIP from "../../modules/serverIP";
import Button from "./Button";
import { queryClient } from "../../App";
import { styles } from '../../styles/styles';

export default function EditTimeboxForm(props) {
    const [description, setDescription] = useState("");
    const [numberOfBoxes, setNumberOfBoxes] = useState('1');
    const [goalSelected, setGoalSelected] = useState(goals.length == 0 ? 1 : goals[0].id);
    
    const [moreOptionsVisible, setMoreOptionsVisible] = useState(false);
    const [reoccurFrequency, setReoccurFrequency] = useState("no");
    const [weeklyDay, setWeeklyDay] = useState('0');
    const [percentageOfGoal, setPercentageOfGoal] = useState(100);
    
    const [alert, setAlert] = useState({shown: false, title: "", message: ""});

    function updateTimeBox() {
        axios.put(serverIP+'/updateTimeBox', {
            title,
            description, 
            id: props.data.id
        }).then(async () => {
            props.close();
            setAlert({shown: true, title: "Timebox", message: "Updated timebox!"});
            await queryClient.refetchQueries();
        }).catch(function(error) {
            props.close();
            setAlert({shown: true, title: "Error", message: "An error occurred, please try again or contact the developer"});
            console.log(error);  
        })
    }
    
    function deleteTimeBox() {
        
        axios.post(serverIP+'/deleteTimebox', {
            id: props.data.id
        }).then(async () => {   
            props.close();
            setAlert({shown: true, title: "Timebox", message: "Deleted timebox!"});
            await queryClient.refetchQueries();
        }).catch(function(error) {
            props.close();
            setAlert({shown: true, title: "Error", message: "An error occurred, please try again or contact the developer"});
            console.log(error); 
        });
    }

    function clearRecording() {
        
        axios.post(serverIP+'/clearRecording', {
            id: props.data.id
        }).then(async () => {   
            props.close();
            setAlert({shown: true, title: "Timebox", message: "Cleared recording!"});
            await queryClient.refetchQueries();
        }).catch(function(error) {
            props.close();
            setAlert({shown: true, title: "Error", message: "An error occurred, please try again or contact the developer"});
            console.log(error); 
        });
    }


    return (
    <Portal>
        <Dialog style={{backgroundColor: '#C5C27C'}} visible={true} onDismiss={props.close}>
            <Dialog.Title style={{color: 'white'}}>Edit Timebox</Dialog.Title>
            <Dialog.Content>
                <TextInput label="Title" value={title} onChangeText={setTitle} style={{backgroundColor: 'white', marginBottom: 2}} selectionColor="black" textColor="black"/>
                <TextInput label="Description" value={description} onChangeText={setDescription} style={{backgroundColor: 'white', marginBottom: 2}} selectionColor="black" textColor="black"/>
                <TextInput label="Number of Boxes" value={numberOfBoxes} onChangeText={safeSetNumberOfBoxes} style={{backgroundColor: 'white', marginBottom: 2}} selectionColor="black" textColor="black"/>
                <TextInput label="Goal" value={goalSelected} style={{backgroundColor: 'white', marginBottom: 2}} selectionColor="black" textColor="black"
                    render={(props) => (
                        <Picker style={{color: 'black', marginTop: 5}} dropdownIconColor='black' selectedValue={goalSelected} onValueChange={setGoalSelected}>
                            {goals.map((goal, index) => {
                                return <Picker.Item key={index} label={goal.title} value={String(goal.id)} />
                            })}
                        </Picker>
                    )}
                ></TextInput>
                {moreOptionsVisible && <>
                    <TextInput label="Reoccurring"  value={reoccurFrequency} style={{backgroundColor: 'white', marginBottom: 2 }} selectionColor="black" textColor="black"
                        render={(props) => (
                            <Picker style={{color: 'black', marginTop: 5}} dropdownIconColor='black' selectedValue={reoccurFrequency} onValueChange={setReoccurFrequency}>
                                <Picker.Item label="No" value="no" />
                                <Picker.Item label="Daily" value="daily" />
                                <Picker.Item label="Weekly" value="weekly" />
                            </Picker>
                        )}
                    />
                    {reoccurFrequency == 'weekly' && <TextInput label="Reoccurring Day"  value={weeklyDay} style={{backgroundColor: 'white', marginBottom: 2 }} selectionColor="black" textColor="black"
                        render={(props) => (
                            <Picker style={{color: 'black', marginTop: 5}} dropdownIconColor='black' selectedValue={weeklyDay} onValueChange={setWeeklyDay}>
                                {dayToName.map((day, index) => {
                                    return <Picker.Item key={index} label={day} value={index} />
                                })}
                            </Picker>
                        )}
                    />}
                    <TextInput label="Percentage of Goal" value={percentageOfGoal} onChangeText={setPercentageOfGoal} style={{backgroundColor: 'white', marginBottom: 2}} selectionColor="black" textColor="black"/>
                </>}
            </Dialog.Content>
            <Dialog.Actions>
                <Button textColor="white" onPress={props.close}>Close</Button>
                <Button textColor="black"  buttonColor="white" mode="contained" onPress={deleteTimeBox}>Delete</Button>
                {props.previousRecording && <Button textColor="black"  buttonColor="white" mode="contained" onPress={clearRecording}>Clear Recording</Button>}
                <Button textColor="black"  buttonColor="white" mode="contained" onPress={updateTimeBox}>Update</Button>
            </Dialog.Actions>
        </Dialog>
        {alert.shown && <Alert visible={alert.shown} close={() => setAlert({...alert, shown: false})} title={alert.title} message={alert.message}/> }
    </Portal>)
}