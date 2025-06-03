import axios from "axios";
import { Dialog, Button } from "react-native-paper";
import { useState } from "react";
import DatePicker from "react-native-date-picker";
import serverIP from "../../modules/serverIP";
import Alert from "../Alert";
import { queryClient } from '../../modules/queryClient.js';
import { useDispatch } from "react-redux";
import { convertToTimeAndDate } from "../../modules/formatters.js";
import { styles } from "../../styles/styles.js";

export default function ManualEntryTimeModal(props) {
    const [recordedStartTime, setRecordedStartTime] = useState(new Date(props.data.startTime));
    const [recordedEndTime, setRecordedEndTime] = useState(new Date(props.data.endTime));
    const [startTimePickerVisible, setStartTimePickerVisible] = useState(false);
    const [endTimePickerVisible, setEndTimePickerVisible] = useState(false);
    const [alert, setAlert] = useState({shown: false, title: "", message: ""});

    function submitManualEntry() {
        axios.post(serverIP+'/createRecordedTimebox', {
            recordedStartTime, 
            recordedEndTime,
            timeBox: {connect: {id: props.data.id}}, 
            schedule: {connect: {id: props.scheduleID}}
        }).then(async () => {
            props.close();
            setAlert({shown: true, title: "Timebox", message: "Added recorded timebox!"});
            await queryClient.refetchQueries();
        }).catch(function(error) {
            props.close();
            setAlert({shown: true, title: "Error", message: "An error occurred, please try again or contact the developer"});
            console.log(error.message); 
        })
        
        let [date, time] = convertToTimeAndDate(props.data.startTime);
        let timeboxTitle = props.data.title;
        let timebox = {...props.data, recordedTimeBoxes: [{recordedStartTime, recordedEndTime, title: timeboxTitle}]};
        props.dispatch({type: 'modalVisible/set', payload: {visible: true, props: {data: timebox, date, time}}});
    }

    return (<>
    <Dialog style={styles.forms.dialogStyle} visible={props.visible} onDismiss={props.close}>
        <Dialog.Title style={styles.forms.dialogTitleStyle}>Manual Entry Of Recorded Time</Dialog.Title>
        <Dialog.Content>
            <Button {...styles.forms.actionButton} style={{marginBottom: 2}} onPress={() => setStartTimePickerVisible(true)}>Pick Recorded Start Time</Button>
            <Button {...styles.forms.actionButton} mode="contained" onPress={() => setEndTimePickerVisible(true)}>Pick Recorded End Time</Button>
        </Dialog.Content>
        <Dialog.Actions>
            <Button {...styles.forms.actionButton} mode="contained" onPress={submitManualEntry}>Enter</Button>
            <Button {...styles.forms.nonActionButton} textColor="white" onPress={props.close}>Close</Button>
        </Dialog.Actions>
    </Dialog>
    <DatePicker modal mode="datetime" date={recordedStartTime}
        onDateChange={(date) => setRecordedStartTime(date)}
        open={startTimePickerVisible}
        onConfirm={(date) => 
            {
                setRecordedStartTime(date)
                setStartTimePickerVisible(false);
            }
        }
        onCancel={() => setStartTimePickerVisible(false)}>
    </DatePicker>
    <DatePicker modal mode="datetime" date={recordedEndTime}
        onDateChange={(date) => setRecordedEndTime(date)}
        open={endTimePickerVisible}
        onConfirm={(date) => 
            {
                setRecordedEndTime(date)
                setEndTimePickerVisible(false);
            }
        }
        onCancel={() => setEndTimePickerVisible(false)}>
    </DatePicker>
    {alert.shown && <Alert visible={alert.shown} close={() => setAlert({...alert, shown: false})} title={alert.title} message={alert.message}/> }
    </>)
}