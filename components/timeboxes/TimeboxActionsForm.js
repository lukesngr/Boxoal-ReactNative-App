import { addBoxesToTime, convertToDateTime, thereIsNoRecording } from "../../modules/coreLogic";
import axios from 'axios';
import { queryClient } from '../../App';
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveOverlayInterval, resetActiveOverlayInterval } from "../../redux/activeOverlayInterval";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { StyleSheet, Text, View, Pressable } from "react-native";
import serverIP from "../../modules/serverIP";
import Button from "./Button";
import EditTimeboxForm from "./EditTimeboxForm";

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

export default function TimeboxActionsForm(props) {
    const {data, date, time} = props;
    const [showEditTimeboxForm, setShowEditTimeboxForm] = useState(false);
    const timeboxRecording = useSelector(state => state.timeboxRecording.value);
    const {id, boxSizeUnit, boxSizeNumber} = useSelector(state => state.scheduleEssentials.value);
    const dispatch = useDispatch();
    
    const noPreviousRecording = thereIsNoRecording(data.recordedTimeBoxes, data.reoccuring, date, time);
    const timeboxIsntRecording = timeboxRecording[0] == -1;
    const timeboxIsRecording = timeboxRecording[0] == data.id && timeboxRecording[1] == date;

    function startRecording() {
        dispatch({type: 'timeboxRecording/set', payload: [data.id, date, new Date().toISOString()]});
        dispatch(resetActiveOverlayInterval());
    }

    function stopRecording() {
        let recordedStartTime = new Date(timeboxRecording[2]);
        dispatch({type: 'timeboxRecording/set', payload: [-1, 0, 0]});
        dispatch(setActiveOverlayInterval());
        axios.post(serverIP+'/createRecordedTimebox', 
            {recordedStartTime: recordedStartTime, recordedEndTime: new Date(), timeBox: {connect: {id: data.id}}, schedule: {connect: {id}}},
            {headers: { 'Origin': 'http://localhost:3000' }}
        ).then(() => {
            queryClient.refetchQueries();
            Alert.alert("Added recorded timebox");
        }).catch(function(error) {
            Alert.alert("Error contact developer");
            console.log(error); 
        })  
    }

    function autoRecord() {
        axios.post(serverIP+'/createRecordedTimebox', 
            {recordedStartTime: convertToDateTime(time, date), 
                recordedEndTime: convertToDateTime(addBoxesToTime(boxSizeUnit, boxSizeNumber, time, data.numberOfBoxes), date),
                 timeBox: {connect: {id: data.id}}, schedule: {connect: {id}}},
            {headers: { 'Origin': 'http://localhost:3000' }}
        ).then(() => {
            queryClient.refetchQueries();
            Alert.alert("Added recorded timebox");
        }).catch(function(error) {
            Alert.alert("Error contact developer");
            console.log(error); 
        })  
    }
    return (
        <View style={styles.overallModal}>
            <View style={styles.titleBarContainer}>  
                <Text style={styles.title}>Timebox Actions</Text>
                <Pressable onPress={() => props.close(false)}>
                    <FontAwesomeIcon icon={faXmark} size={25}/>
                </Pressable>
            </View>
            {noPreviousRecording && timeboxIsntRecording && <>
                <Button outlineStyle={styles.buttonOutlineStyle} textStyle={styles.buttonTextStyle} title="Record" onPress={startRecording}></Button>
                <Button outlineStyle={styles.buttonOutlineStyle} textStyle={styles.buttonTextStyle} title="Complete" onPress={autoRecord}></Button> 
            </>}
            {noPreviousRecording && timeboxIsRecording && 
            <Button outlineStyle={styles.buttonOutlineStyle} textStyle={styles.buttonTextStyle} title="Stop Recording" onPress={stopRecording}></Button>}
            <EditTimeboxForm data={data}></EditTimeboxForm>
        </View>
    );
}