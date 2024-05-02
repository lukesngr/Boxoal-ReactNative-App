import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {convertToDateTime, addBoxesToTime, calculateMaxNumberOfBoxes} from '../../modules/coreLogic';
import { Alert, TextInput, View, Text, Button } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { StyleSheet } from 'react-native';
import DatePicker from "react-native-date-picker";

const styles = StyleSheet.create({
    overallModal: {
        backgroundColor: 'white',
        padding: 10,
        width: '80%',
    },
    title: {
        color: 'black',
        fontSize: 25
    },
    label: {
        color: 'black',
        fontSize: 20,
    },
    textInput: {
        color: 'black',
        borderWidth: 1,
        borderColor: 'black',
        padding: 1,
        fontSize: 20,
    },
    pickerItem: {
        color: 'black',
        fontSize: 20,
    },
    pickerBorder: {
        borderWidth: 1,
        borderColor: 'black',
    },
    button: {
        color: '#7FFFD4'
    }
  });

export default function CreateTimeboxForm(props) {
    const listOfColors = ["#00E3DD", "#00C5E6", "#00A4E7", "#0081DC", "#1E5ABF", "#348D9D", "#67D6FF"];
    let {time, date, dayName} = props;
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [reoccurFrequency, setReoccurFrequency] = useState("no");
    const [weeklyDate, setWeeklyDate] = useState(new Date());
    const [numberOfBoxes, setNumberOfBoxes] = useState('1');
    const {id, wakeupTime, boxSizeUnit, boxSizeNumber} = useSelector(state => state.scheduleEssentials.value);
    const {timeboxes, goals} = useSelector(state => state.scheduleData.value);
    const [goalSelected, setGoalSelected] = useState(goals.length == 0 ? 1 : goals[0].id);


    let maxNumberOfBoxes = calculateMaxNumberOfBoxes(wakeupTime, boxSizeUnit, boxSizeNumber, timeboxes, time, date);
    
    function handleSubmit() {
        let startTime = convertToDateTime(time, date);
        let endTime = convertToDateTime(addBoxesToTime(boxSizeUnit, boxSizeNumber, time, numberOfBoxes), date); //add boxes to start time to get end time
        let color = listOfColors[Math.floor(Math.random() * listOfColors.length)]; //randomly pick a box color     
        let data = {
            title, 
            description, 
            startTime, 
            endTime, 
            numberOfBoxes: parseInt(numberOfBoxes), 
            color, 
            schedule: {connect: {id}}, 
            goal: {connect: {id: parseInt(goalSelected)}}
        }

        console.log(goalSelected);

        if(reoccurFrequency != "no") { data["reoccuring"] = {create: {reoccurFrequency: "no"}}; }
        if(reoccurFrequency == "weekly") {data.reoccuring.create.weeklyDay = new Date(weeklyDate).getDay();}

        //post to api
        axios.post('/api/createTimebox', data).then(() => {
            //reset the form
            queryClient.refetchQueries();
            Alert.alert("Added timebox");
        }).catch(function(error) {
            Alert.alert("Error please contact developer");
        })

    }

    function sanitizedSetNumberOfBoxes(number) {
        if(number > maxNumberOfBoxes) {
            Alert.alert("Number of Boxes", `You can only add ${maxNumberOfBoxes} boxes to this timebox`);
            setNumberOfBoxes(1);
        }else {
            setNumberOfBoxes(number);
        }
    }

    return (
        <View style={styles.overallModal}>  
            <Text style={styles.title}>Add TimeBox</Text>
            <Text style={styles.label}>Title</Text>
            <TextInput style={styles.textInput} onChangeText={setTitle} value={title}></TextInput>
            <Text style={styles.label}>Description</Text>
            <TextInput style={styles.textInput} placeholderTextColor={"black"} onChangeText={setDescription} value={description}></TextInput>
            <Text style={styles.label}>Boxes</Text>
            <TextInput style={styles.textInput} keyboardType="numeric" onChangeText={sanitizedSetNumberOfBoxes} value={numberOfBoxes}></TextInput>
            <Text style={styles.label}>Reoccuring?</Text>
            <View style={styles.pickerBorder}>
                <Picker style={{color: "black"}} itemStyle={styles.pickerItem} selectedValue={reoccurFrequency} onValueChange={(itemValue, itemIndex) => setReoccurFrequency(itemValue)}>
                    <Picker.Item label="No" value="no" />
                    <Picker.Item label="Daily" value="daily" />
                    <Picker.Item label="Weekly" value="weekly" />
                </Picker>
            </View>
            {reoccurFrequency == 'weekly' && 
                <>
                    <Text>Weekly Date</Text>
                    <DatePicker onChange={setWeeklyDate} value={weeklyDate} />
                </>
            }
            {goals.length == 0 ? (<Text>Must create a goal first</Text>) : (
                <>
                    <Text>Goal</Text>
                    <Picker selectedValue={goalSelected} onValueChange={setGoalSelected}>
                        {goals.map((goal, index) => (
                            <Picker.Item key={index} label={goal.name} value={String(goal.id)} />
                        ))}
                    </Picker>
                </>
            )}
            <Button style={styles.button} title="Add TimeBox" disabled={goals.length == 0} onPress={handleSubmit} />
        </View>
    );
}