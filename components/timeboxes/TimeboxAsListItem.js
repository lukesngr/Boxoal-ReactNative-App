import { Text, Checkbox, Surface } from "react-native-paper";
import axios from "axios";
import { queryClient } from '../../modules/queryClient.js';
import serverIP from "../../modules/serverIP";
import { useState } from "react";
import { useSelector } from "react-redux";
import { convertToTimeAndDate } from "../../modules/formatters.js";
import { Pressable } from "react-native";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

export default function TimeboxAsListItem(props) {
    const dispatch = useDispatch();
    const [checked, setChecked] = useState(props.timebox.recordedTimeBoxes.length > 0);
    const {id, wakeupTime, boxSizeUnit, boxSizeNumber} = useSelector(state => state.profile.value);

    useEffect(() => {
        setChecked(props.timebox.recordedTimeBoxes?.length > 0);
    }, [props.timebox.recordedTimeBoxes]);

    function completeTimebox() {
        axios.post(serverIP+'/createRecordedTimebox', {
            recordedStartTime: props.timebox.startTime, 
            recordedEndTime: props.timebox.endTime,
            timeBox: {connect: {id: props.timebox.id}}, 
            schedule: {connect: {id: id}}
        }).then(() => {
            queryClient.refetchQueries();
        }).catch(function(error) {
            console.log(error); 
        })  
    }

    function clearRecording() {
        axios.post(serverIP+'/clearRecording', {id: props.timebox.id}).then(
            async () => { await queryClient.refetchQueries();}
        ).catch(function(error) {
            console.log(error); 
        });
    }

    function openTimeboxModal() {
        let [date, time] = convertToTimeAndDate(props.timebox.startTime);
        dispatch({type: 'modalVisible/set', payload: {visible: true, props: {data: props.timebox, date, time}}});
    }

    return (
    <Surface style={{paddingLeft: 40, flexDirection: 'row', paddingBottom: 15, backgroundColor: 'white'}}>
        <Pressable onPress={openTimeboxModal}>
            <Text style={{color: 'black', fontSize: 20, width: 265, paddingTop: 10}}>{props.timebox.title}</Text>
        </Pressable>
        <Checkbox 
            color='black' 
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => {
                if(checked) {
                    clearRecording();
                    setChecked(false);
                } else {
                    completeTimebox();
                    setChecked(true);
                }
            }}/>
    </Surface>
    )
}