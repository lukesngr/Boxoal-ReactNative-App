import {useState, useEffect} from 'react';
import { convertToDayjs } from '../../modules/formatters';
import { addBoxesToTime, calculateMaxNumberOfBoxes } from '../../modules/boxCalculations';
import {Picker} from '@react-native-picker/picker';;
import axios from 'axios';
import { queryClient } from '../../modules/queryClient.js';
import serverIP from '../../modules/serverIP';
import { styles } from '../../styles/styles';
import { dayToName } from '../../modules/dateCode';
import { listOfColors } from '../../styles/styles';
import { Dialog, Portal, TextInput, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Alert from '../Alert';


export default function CreateTimeboxForm(props) {
    
    const dispatch = useDispatch();
    const {id, wakeupTime, boxSizeUnit, boxSizeNumber} = useSelector(state => state.scheduleEssentials.value);
    const {timeboxes, goals} = useSelector(state => state.scheduleData.value);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [numberOfBoxes, setNumberOfBoxes] = useState('1');
    const [goalSelected, setGoalSelected] = useState(goals.length == 0 ? 1 : goals[0].id);
    
    const [moreOptionsVisible, setMoreOptionsVisible] = useState(false);
    const [reoccurFrequency, setReoccurFrequency] = useState("no");
    const [weeklyDay, setWeeklyDay] = useState('0');
    const [goalPercentage, setGoalPercentage] = useState('0');
    
    const [alert, setAlert] = useState({shown: false, title: "", message: ""});
    
    let {time, date} = props;

    let maxNumberOfBoxes = calculateMaxNumberOfBoxes(wakeupTime, boxSizeUnit, boxSizeNumber, timeboxes, time, date);
    console.log(wakeupTime, boxSizeUnit, boxSizeNumber, timeboxes, time, date);
    
    function closeModal() {
        dispatch({type: 'modalVisible/set', payload: {visible: false, props: {}}});
    }

    function handleSubmit() {
        let startTime = convertToDayjs(time, date).toDate();
        let endTime = convertToDayjs(addBoxesToTime(boxSizeUnit, boxSizeNumber, time, numberOfBoxes), date).toDate(); //add boxes to start time to get end time
        let color = listOfColors[Math.floor(Math.random() * listOfColors.length)]; //randomly pick a box color     
        let data = {
            title, 
            description, 
            startTime, 
            endTime, 
            numberOfBoxes: parseInt(numberOfBoxes), 
            color, 
            schedule: {connect: {id}}, 
            goal: {connect: {id: parseInt(goalSelected)}},
            goalPercentage: parseInt(goalPercentage)
        }

        if(reoccurFrequency == "weekly") {
            data["reoccuring"] = {create: {reoccurFrequency: "weekly", weeklyDay: weeklyDay}};
        }else if(reoccurFrequency == "daily") {
            data["reoccuring"] = {create: {reoccurFrequency: "daily"}};
        }
        
        axios.post(serverIP+'/createTimebox', data).then(async () => {
            closeModal();
            setAlert({shown: true, title: "Timebox", message: "Added timebox!"});
            await queryClient.refetchQueries();
        }).catch(function(error) {
            closeModal();
            setAlert({shown: true, title: "Error", message: "An error occurred, please try again or contact the developer"});
            console.log(error); 
        })

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
        <Dialog style={{backgroundColor: '#C5C27C'}} visible={props.visible} onDismiss={closeModal}>
            <Dialog.Title style={{color: 'white'}}>Create Timebox</Dialog.Title>
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
                {moreOptionsVisible && <>
                    <TextInput label="Reoccurring"  value={reoccurFrequency} {...styles.paperInput}
                        render={(props) => (
                            <Picker style={{color: 'black', marginTop: 5}} dropdownIconColor='black' selectedValue={reoccurFrequency} onValueChange={setReoccurFrequency}>
                                <Picker.Item label="No" value="no" />
                                <Picker.Item label="Daily" value="daily" />
                                <Picker.Item label="Weekly" value="weekly" />
                            </Picker>
                        )}
                    />
                    {reoccurFrequency == 'weekly' && <TextInput label="Reoccurring Day"  value={weeklyDay} {...styles.paperInput}
                        render={(props) => (
                            <Picker style={{color: 'black', marginTop: 5}} dropdownIconColor='black' selectedValue={weeklyDay} onValueChange={setWeeklyDay}>
                                {dayToName.map((day, index) => {
                                    return <Picker.Item key={index} label={day} value={index} />
                                })}
                            </Picker>
                        )}
                    />}
                    <TextInput label="Percentage of Goal" value={goalPercentage} onChangeText={setGoalPercentage} {...styles.paperInput}/>
                </>}
            </Dialog.Content>
            <Dialog.Actions>
                <Button textColor="white" onPress={closeModal}>Close</Button>
                {!moreOptionsVisible && <Button textColor="white" onPress={() => setMoreOptionsVisible(true)}>More Options</Button>}
                {moreOptionsVisible && <Button textColor="white" onPress={() => setMoreOptionsVisible(false)}>Less Options</Button>}
                <Button textColor="black"  buttonColor="white" mode="contained" onPress={handleSubmit}>Create</Button>
            </Dialog.Actions>
        </Dialog>
        {alert.shown && <Alert visible={alert.shown} close={() => setAlert({...alert, shown: false})} title={alert.title} message={alert.message}/> }
    </Portal>
    );
}