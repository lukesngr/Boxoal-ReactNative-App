import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {convertToDateTime, addBoxesToTime, calculateMaxNumberOfBoxes, convertToDayjs} from '../../modules/coreLogic';
import { Alert, TextInput, View, Text, Pressable } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import Button from './Button';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-native-date-picker';
import axios from 'axios';
import { queryClient } from '../../App';
import serverIP from '../../modules/serverIP';

const styles = StyleSheet.create({
    overallModal: {
        backgroundColor: 'white',
        padding: 10,
        width: '80%',
        height: 'auto',
    },
    title: {
        color: 'black',
        fontSize: 22,
        padding: 0,
        margin: 0,
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
    picker: {
        padding: 1,
        fontSize: 20,
        color: 'black',
        marginBottom: 0
    },
    buttonOutlineStyle: {
        backgroundColor: '#7FFFD4',
        padding: 5,
        marginTop: 10,
    },
    buttonTextStyle: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
    },
    titleBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 'auto',
        margin: 0,
        padding: 0,
    },
  });

export default function CreateTimeboxForm(props) {
    const listOfColors = ["#00E3DD", "#00C5E6", "#00A4E7", "#0081DC", "#1E5ABF", "#348D9D", "#67D6FF"];
    let {time, date, dayName} = props;
    const [visible, setVisible] = useState(false);
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
            goal: {connect: {id: parseInt(goalSelected)}}
        }

        if(reoccurFrequency == "weekly") {
            data["reoccuring"] = {create: {reoccurFrequency: "weekly", weeklyDay: new Date(weeklyDate).getDay()}};
        }else if(reoccurFrequency == "daily") {
            data["reoccuring"] = {create: {reoccurFrequency: "daily"}};
        }
        //post to api
        axios.post(serverIP+'/createTimebox', data, {headers: { 'Origin': 'http://localhost:3000' }}).then(async () => {
            //reset the form
            Alert.alert("Added timebox");
            await queryClient.refetchQueries();
        }).catch(function(error) {
            console.log(error);
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
            <View style={styles.titleBarContainer}>  
                <Text style={styles.title}>Add TimeBox</Text>
                <Pressable onPress={() => props.close(false)}>
                    <FontAwesomeIcon icon={faXmark} size={25}/>
                </Pressable>
            </View>
            <Text style={styles.label}>Title</Text>
            <TextInput style={styles.textInput} onChangeText={setTitle} value={title}></TextInput>
            <Text style={styles.label}>Description</Text>
            <TextInput style={styles.textInput} placeholderTextColor={"black"} onChangeText={setDescription} value={description}></TextInput>
            <Text style={styles.label}>Boxes</Text>
            <TextInput style={styles.textInput} keyboardType="numeric" onChangeText={sanitizedSetNumberOfBoxes} value={numberOfBoxes}></TextInput>
            <Text style={styles.label}>Reoccuring?</Text>
            <View style={styles.pickerBorder}>
                <Picker style={styles.picker} itemStyle={styles.pickerItem} selectedValue={reoccurFrequency} onValueChange={setReoccurFrequency}>
                    <Picker.Item label="No" value="no" />
                    <Picker.Item label="Daily" value="daily" />
                    <Picker.Item label="Weekly" value="weekly" />
                </Picker>
            </View>
            {reoccurFrequency == 'weekly' && 
                <>
                    <Text style={styles.label}>Weekly Date</Text>
                    <Pressable onPress={() => setVisible(true)}>
                        <FontAwesomeIcon icon={faCalendar} size={25}/>
                    </Pressable>
                    <DatePicker
                        modal
                        mode="date"
                        date={new Date(weeklyDate)}
                        onDateChange={(date) => setWeeklyDate(date.toUTCString())}
                        open={visible}
                        onConfirm={(date) => 
                            {
                                setWeeklyDate(date.toUTCString());
                                setVisible(false);
                            }
                        }
                        onCancel={() => setVisible(false)}></DatePicker>
                </>
            }
            {goals.length == 0 ? (<Text style={styles.label}>Need to make goal first</Text>) : (
                <>
                    <Text style={styles.label}>Goal</Text>
                    <View style={styles.pickerBorder}>
                        <Picker style={styles.picker} itemStyle={styles.pickerItem} selectedValue={goalSelected} onValueChange={setGoalSelected}>
                            {goals.map((goal, index) => (
                                <Picker.Item key={index} label={goal.name} value={String(goal.id)} />
                            ))}
                        </Picker>
                    </View>
                </>
            )}
            <Button textStyle={styles.buttonTextStyle} outlineStyle={styles.buttonOutlineStyle} title="Create" disabled={goals.length == 0} onPress={handleSubmit} />
        </View>
    );
}