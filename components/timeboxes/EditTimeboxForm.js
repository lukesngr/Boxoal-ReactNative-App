import axios from "axios";
import { useState } from "react";
import serverIP from "../../modules/serverIP";
import { queryClient } from '../../modules/queryClient.js';
import { Portal, Dialog, TextInput, Button } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { convertToTimeAndDate, convertToDayjs } from "../../modules/formatters.js";
import { addBoxesToTime, calculateMaxNumberOfBoxes } from "../../modules/boxCalculations.js";
import { useDispatch, useSelector } from "react-redux";
import { styles } from "../../styles/styles";
import Alert from "../Alert";
import { dayToName } from "../../modules/dateCode";

export default function EditTimeboxForm(props) {
    const dispatch = useDispatch();
    const [title, setTitle] = useState(props.data.title);
    const [description, setDescription] = useState(props.data.description);
    const [numberOfBoxes, setNumberOfBoxes] = useState(String(props.data.numberOfBoxes));
    const [goalSelected, setGoalSelected] = useState(props.data.goalID);

    let reoccurFreq = "no";
    let weeklyDayIndex = "0";
    if(props.data.reoccuring != null) {
        reoccurFreq = props.data.reoccuring.reoccurFrequency
        if(reoccurFreq == "weekly") {
            weeklyDayIndex = String(props.data.reoccuring.weeklyDay);
        }
    }
    const [reoccurFrequency, setReoccurFrequency] = useState(reoccurFreq);
    const [weeklyDay, setWeeklyDay] = useState(weeklyDayIndex);
    const [goalPercentage, setGoalPercentage] = useState(String(props.data.goalPercentage));
    
    const [alert, setAlert] = useState({shown: false, title: "", message: ""});

    const {id, wakeupTime, boxSizeUnit, boxSizeNumber} = useSelector(state => state.profile.value);
    const {timeboxes, goals} = useSelector(state => state.scheduleData.value);

    let [time, date] = convertToTimeAndDate(props.data.startTime);
    let maxNumberOfBoxes = calculateMaxNumberOfBoxes(wakeupTime, boxSizeUnit, boxSizeNumber, timeboxes, time, date);

    function closeModal() {
        dispatch({type: 'modalVisible/set', payload: {visible: false, props: {}}});
    }

    function updateTimeBox() {
        let endTime = convertToDayjs(addBoxesToTime(boxSizeUnit, boxSizeNumber, time, numberOfBoxes), date).toDate(); //add boxes to start time to get end time

        let data = {
            id: props.data.id,
            title, 
            description, 
            startTime: props.data.startTime, 
            endTime, 
            numberOfBoxes: parseInt(numberOfBoxes), 
            goal: {connect: {id: parseInt(goalSelected)}},
            goalPercentage: parseInt(goalPercentage)
        }

        if(reoccurFrequency == "weekly") {
            data["reoccuring"] = {create: {reoccurFrequency: "weekly", weeklyDay: parseInt(weeklyDay)}};
        }else if(reoccurFrequency == "daily") {
            data["reoccuring"] = {create: {reoccurFrequency: "daily"}};
        }else if(reoccurFrequency == "no") {
            data["reoccuring"] = {delete: true};
        }

        axios.put(serverIP+'/updateTimeBox', data).then(async () => {
            setAlert({shown: true, title: "Timebox", message: "Updated timebox!"});
            await queryClient.refetchQueries();
        }).catch(function(error) {
            setAlert({shown: true, title: "Error", message: "An error occurred, please try again or contact the developer"});
            console.log(error);  
        })
    }
    
    function deleteTimeBox() {
        
        axios.post(serverIP+'/deleteTimebox', {
            id: props.data.id
        }).then(async () => {   
            setAlert({shown: true, title: "Timebox", message: "Deleted timebox!"});
            await queryClient.refetchQueries();
        }).catch(function(error) {
            setAlert({shown: true, title: "Error", message: "An error occurred, please try again or contact the developer"});
            console.log(error); 
        });
    }

    function clearRecording() {
        
        axios.post(serverIP+'/clearRecording', {
            id: props.data.id
        }).then(async () => {   
            setAlert({shown: true, title: "Timebox", message: "Cleared recording!"});
            await queryClient.refetchQueries();
        }).catch(function(error) {
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
        <Dialog style={{backgroundColor: '#C5C27C'}} visible={true} onDismiss={closeModal}>
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
                <TextInput label="Percentage of Goal" value={goalPercentage} onChangeText={setGoalPercentage} {...styles.paperInput}/>
            </Dialog.Content>
            <Dialog.Actions>
                <Button textColor="white" onPress={props.back}>Back</Button>
                <Button textColor="black"  buttonColor="white" mode="contained" onPress={deleteTimeBox}>Delete</Button>
                {props.previousRecording && <Button textColor="black"  buttonColor="white" mode="contained" onPress={clearRecording}>Clear Recording</Button>}
                <Button textColor="black"  buttonColor="white" mode="contained" onPress={updateTimeBox}>Update</Button>
            </Dialog.Actions>
        </Dialog>
        {alert.shown && <Alert visible={alert.shown} close={() => setAlert({...alert, shown: false})} title={alert.title} message={alert.message}/> }
    </Portal>)
}