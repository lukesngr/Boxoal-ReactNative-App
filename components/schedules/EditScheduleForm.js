import { faArrowLeft, faCalendar, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { StyleSheet, View, Text, Pressable, TextInput } from "react-native";
import axios from "axios";
import { useState } from "react";
import { Alert } from "react-native";
import serverIP from "../../modules/serverIP";
import Button from "../timeboxes/Button";
import { queryClient } from "../../App";
import DatePicker from "react-native-date-picker";

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
});



export default function EditGoalForm(props) {
    const [name, setName] = useState(props.data.title);
    const [boxSizeNumber, setBoxSizeNumber] = useState(props.data.boxSizeNumber);
    const [boxSizeUnit, setBoxSizeUnit] = useState(props.data.boxSizeNumber);
    const [endDate, setEndDate] = useState(props.data.endDate);
    const [endDateNeeded, setEndDateNeeded] = useState(props.data.endDate === undefined ? (false) : (true));
    const [wakeupTime, setWakeupTime] = useState(props.data.wakeupTime);
    const [endDateModalVisible, setEndDateModalVisible] = useState(false);
    const [wakeupTimeModalVisible, setWakeupTimeModalVisible] = useState(false);

    function updateGoal() {
        axios.put(serverIP+'/updateSchedule', {
            name,
            boxSizeNumber: parseInt(boxSizeNumber),
            boxSizeUnit,
            endDate,
            wakeupTime,
            id: props.data.id,
        },
        {headers: { 'Origin': 'http://localhost:3000' }}
        ).then(async () => {
            Alert.alert("Updated goal!");
            await queryClient.refetchQueries();
        }).catch(function(error) {
            Alert.alert("Error occurred please try again or contact developer");
            console.log(error); 
        })
    }
    
    function deleteGoal() {
        
        axios.post(serverIP+'/deleteSchedule', {
            id: props.data.id
        },
        {headers: { 'Origin': 'http://localhost:3000' }}
        ).then(async () => {   
            Alert.alert("Deleted goal!");
            await queryClient.refetchQueries();
        }).catch(function(error) {
            Alert.alert("Error occurred please try again or contact developer");
            console.log(error); 
        });
    }

    return (
    <>
        <View style={styles.overallModal}>
                <View style={styles.titleBarContainer}>  
                    <Text style={styles.title}>Edit Schedule</Text>
                    <Pressable onPress={props.close}>
                        <FontAwesomeIcon icon={faXmark} size={25}/>
                    </Pressable>
                </View>
                <Text style={styles.label}>Name</Text>
                <TextInput style={styles.textInput} onChangeText={setName} value={name}></TextInput>
                <Text style={styles.label}>Timebox duration and unit</Text>
                <TextInput style={styles.textInput} keyboardType="numeric" onChangeText={setBoxSizeNumber} value={boxSizeNumber}></TextInput>
                <View style={styles.pickerBorder}>
                    <Picker style={styles.picker} itemStyle={styles.pickerItem} selectedValue={boxSizeUnit} onValueChange={setBoxSizeUnit}>
                        <Picker.Item label="Min" value="min" />
                        <Picker.Item label="Hour" value="hr" />
                    </Picker>
                </View>
                <Text style={styles.label}>End Date Needed: </Text>
                <View style={styles.pickerBorder}>
                    <Picker style={styles.picker} itemStyle={styles.pickerItem} selectedValue={endDateNeeded} onValueChange={setEndDateNeeded}>
                        <Picker.Item label="None" value={false} />
                        <Picker.Item label="Choose" value={true} />
                    </Picker>
                </View>
                {endDateNeeded && 
                    <>
                    <Pressable onPress={() => setEndDateModalVisible(true)}>
                        <FontAwesomeIcon icon={faCalendar} size={20}/>
                    </Pressable>
                    </>
                }
                <Text style={styles.label}>Wakeup Time: </Text>
                <Pressable onPress={() => setWakeupTimeModalVisible(true)}>
                        <FontAwesomeIcon icon={faCalendar} size={20}/>
                </Pressable>
                <Button textStyle={styles.buttonTextStyle} outlineStyle={styles.buttonOutlineStyle} title="Delete" onPress={deleteGoal} />
                <Button textStyle={styles.buttonTextStyle} outlineStyle={styles.buttonOutlineStyle} title="Update" onPress={updateGoal} />
        </View>
        <DatePicker 
            modal 
            mode="date" 
            date={endDate} 
            onDateChange={(date) => setEndDate(date)} open={endDateModalVisible} 
            onConfirm={(date) => { setEndDate(date); setEndDateModalVisible(false); }} 
            onCancel={() => setEndDateModalVisible(false)}>
        </DatePicker>
        <DatePicker 
            modal 
            mode="time" 
            date={wakeupTime} 
            onDateChange={(date) => setEndDate(date)} open={wakeupTimeModalVisible} 
            onConfirm={(date) => { setEndDate(date); setWakeupTimeModalVisible(false); }} 
            onCancel={() => setWakeupTimeModalVisible(false)}>
        </DatePicker>
    </>)
}