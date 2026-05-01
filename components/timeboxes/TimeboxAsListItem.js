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
import { fetchAuthSession } from "aws-amplify/auth";

export default function TimeboxAsListItem(props) {
    const dispatch = useDispatch();
    const [checked, setChecked] = useState(props.timebox.recordedTimeBox != null);
    const {id, wakeupTime, boxSizeUnit, boxSizeNumber} = useSelector(state => state.profile.value);

    useEffect(() => {
        setChecked(props.timebox.recordedTimeBox != null);
    }, [props.timebox.recordedTimeBox]);

    async function completeTimebox() {
        const session = await fetchAuthSession();
        const accessToken = session.tokens?.accessToken.toString();
        const headers = {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        try {
            await axios.post(serverIP+'/createRecordedTimebox', {
                recordedStartTime: props.timebox.startTime, 
                recordedEndTime: props.timebox.endTime,
                timeBox: {connect: {id: props.timebox.id}}, 
                schedule: {connect: {id: id}}
            }, headers);
            await queryClient.refetchQueries();
        } catch(error) {
            console.log(error); 
        }
    }

    async function clearRecording() {
        const session = await fetchAuthSession();
        const accessToken = session.tokens?.accessToken.toString();
        const headers = {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        try {
            await axios.post(serverIP+'/clearRecording', {id: props.timebox.id}, headers);
            await queryClient.refetchQueries();
        } catch(error) {
            console.log(error); 
        }
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
