import axios from "axios";
import { useState } from "react";
import { Alert } from "react-native";
import serverIP from "../../modules/serverIP";
import { queryClient } from "../../App";
import { Portal, Dialog, TextInput, Button } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { convertToTimeAndDate, calculateMaxNumberOfBoxes } from "../../modules/coreLogic";
import { useSelector } from "react-redux";
import { styles } from "../../styles/styles";

export default function EditTimeboxForm(props) {
    const [title, setTitle] = useState(props.data.title);
    const [description, setDescription] = useState(props.data.description);
    const [numberOfBoxes, setNumberOfBoxes] = useState(props.data.numberOfBoxes);
    const [goalSelected, setGoalSelected] = useState(props.data.goalID);
    
    const [reoccurFrequency, setReoccurFrequency] = useState("no");
    const [weeklyDay, setWeeklyDay] = useState('0');
    const [percentageOfGoal, setPercentageOfGoal] = useState(props.data.percentageOfGoal);
    
    const [alert, setAlert] = useState({shown: false, title: "", message: ""});

    const {id, wakeupTime, boxSizeUnit, boxSizeNumber} = useSelector(state => state.scheduleEssentials.value);
    const {timeboxes, goals} = useSelector(state => state.scheduleData.value);

    console.log(props.data);

    let [time, date] = convertToTimeAndDate(props.data.startTime);
    let maxNumberOfBoxes = calculateMaxNumberOfBoxes(wakeupTime, boxSizeUnit, boxSizeNumber, timeboxes, time, date);

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

    function safeSetNumberOfBoxes(number) {
        let amountOfBoxes;
        try {
            amountOfBoxes = Number(number)
        }catch(e){
            amountOfBoxes = 1;
        }

        if(amountOfBoxes > maxNumberOfBoxes) {
            setNumberOfBoxes('1');
        }else {
            setNumberOfBoxes(String(amountOfBoxes));
        }
    }


    return (
    <Portal>
        <Dialog style={{backgroundColor: '#C5C27C'}} visible={true} onDismiss={props.close}>
            <Dialog.Title style={{color: 'white'}}>Edit Timebox</Dialog.Title>
            <Dialog.Content>
                <TextInput label="Title" value={title} onChangeText={setTitle} {...styles.paperInput}/>
                <TextInput label="Description" value={description} onChangeText={setDescription} {...styles.paperInput}/>
                <TextInput label="Number of Boxes" value={numberOfBoxes} onChangeText={safeSetNumberOfBoxes} {...styles.paperInput}/>
                <TextInput label="Goal" value={goalSelected} {...styles.paperInput}
                    render={(props) => (
                        <Picker style={{color: 'black', marginTop: 5}} dropdownIconColor='black' selectedValue={goalSelected} onValueChange={setGoalSelected}>
                            {goals.map((goal, index) => {
                                return <Picker.Item key={index} label={goal.title} value={String(goal.id)} />
                            })}
                        </Picker>
                    )}
                ></TextInput>
                <TextInput label="Reoccurring"  value={reoccurFrequency} {...styles.paperInput}
                    render={(props) => (
                        <Picker style={{color: 'black', marginTop: 5}} dropdownIconColor='black' selectedValue={reoccurFrequency} onValueChange={setReoccurFrequency}>
                            <Picker.Item label="No" value="no" />
                            <Picker.Item label="Daily" value="daily" />
                            <Picker.Item label="Weekly" value="weekly" />
                        </Picker>
                    )}
                />
                {reoccurFrequency == 'weekly' && <TextInput label="Reoccurring Day" value={weeklyDay} {...styles.paperInput}
                    render={(props) => (
                        <Picker style={{color: 'black', marginTop: 5}} dropdownIconColor='black' selectedValue={weeklyDay} onValueChange={setWeeklyDay}>
                            {dayToName.map((day, index) => {
                                return <Picker.Item key={index} label={day} value={index} />
                            })}
                        </Picker>
                    )}
                />}
                <TextInput label="Percentage of Goal" value={percentageOfGoal} onChangeText={setPercentageOfGoal} {...styles.paperInput}/>
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