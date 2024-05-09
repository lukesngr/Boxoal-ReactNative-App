import { addBoxesToTime, convertToDateTime, thereIsNoRecording } from "@/modules/coreLogic";
import axios from 'axios';
import { toast } from "react-toastify";
import { queryClient } from './../../pages/_app';
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveOverlayInterval, resetActiveOverlayInterval } from "@/redux/activeOverlayInterval";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { StyleSheet, Text, View, Pressable } from "react-native";

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
        dispatch({type: 'timeboxRecording/set', payload: [data.id, date, new Date()]});
        dispatch(setActiveOverlayInterval());
    }

    function stopRecording() {
        dispatch({type: 'timeboxRecording/set', payload: [-1, 0]});
        dispatch(resetActiveOverlayInterval());
        axios.post('/api/createRecordedTimebox', 
            {recordedStartTime: recordedStartTime, recordedEndTime: new Date(), timeBox: {connect: {id: data.id}}, schedule: {connect: {id}}
        }).then(() => {
            queryClient.refetchQueries();
            toast.success("Added recorded timebox!", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }).catch(function(error) {
            toast.error("Error: "+error, {
                position: toast.POSITION.TOP_RIGHT,
            });
            console.log(error); 
        })  
    }

    function autoRecord() {
        axios.post('/api/createRecordedTimebox', 
            {recordedStartTime: convertToDateTime(time, date), 
                recordedEndTime: convertToDateTime(addBoxesToTime(boxSizeUnit, boxSizeNumber, time, data.numberOfBoxes), date),
                 timeBox: {connect: {id: data.id}}, schedule: {connect: {id}}
        }).then(() => {
            queryClient.refetchQueries();
            toast.success("Added recorded timebox!", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }).catch(function(error) {
            toast.error("Error: "+error, {
                position: toast.POSITION.TOP_RIGHT,
            });
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
        </View>
    );
}