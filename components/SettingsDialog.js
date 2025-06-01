import { Dialog, Text, Button, Portal, SegmentedButtons, TextInput } from "react-native-paper"
import { signOut } from "aws-amplify/auth"
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Picker } from "@react-native-picker/picker";
import { convertToDayjs, convertToTimeAndDate } from "../modules/formatters";
import { styles } from "../styles/styles";
import DatePicker from "react-native-date-picker";
import { Pressable } from "react-native";
import axios from "axios";
import serverIP from "../modules/serverIP";
import { useAuthenticator } from "@aws-amplify/ui-react-native";

export default function SettingsDialog(props) {
    const {user} = useAuthenticator();
    const dispatch = useDispatch();
    const onDayView = useSelector(state => state.onDayView.value);
    const profile = useSelector(state => state.profile.value);
    const [dayView, setDayView] = useState(onDayView);
    const [scheduleIndex, setScheduleIndex] = useState(profile.scheduleIndex+1);
    const [boxSizeNumber, setBoxSizeNumber] = useState(String(profile.boxSizeNumber));
    const [boxSizeUnit, setBoxSizeUnit] = useState(profile.boxSizeUnit);
    const [wakeupTime, setWakeupTime] = useState(convertToDayjs(profile.wakeupTime, '12/1').utc().toDate());
    const [wakeupTimeText, setWakeupTimeText] = useState(profile.wakeupTime);
    const [wakeupTimeModalVisible, setWakeupTimeModalVisible] = useState(false);
    
    const {data} = props;

    function setOnDayView(value) {
        setDayView(value);
        dispatch({type: 'onDayView/set', payload: value});
    }

    function updateProfile() {
        let wakeupTimeAsText = convertToTimeAndDate(wakeupTime)[0];
        let convertedBackBoxSizeNumber = Number(boxSizeNumber);
        axios.post(serverIP+'/updateProfile', {scheduleIndex: (scheduleIndex-1), scheduleID: data[scheduleIndex-1].id, boxSizeUnit, boxSizeNumber: convertedBackBoxSizeNumber, wakeupTime: wakeupTimeAsText, userUUID: user.userId}).catch(function(error) { console.log(error); });
        dispatch({type: 'profile/set', payload: {scheduleIndex: (scheduleIndex-1), scheduleID: data[scheduleIndex-1].id, boxSizeNumber: convertedBackBoxSizeNumber, boxSizeUnit, wakeupTime: wakeupTimeAsText}});
        props.hideDialog();
    }

    return (<>
        <Portal>
          <Dialog style={{backgroundColor: styles.primaryColor}} visible={props.visible} onDismiss={props.hideDialog}>
            <Dialog.Title>Settings</Dialog.Title>
            <Dialog.Content>
                <SegmentedButtons value={dayView} onValueChange={setOnDayView} buttons={[
                    {value: true, label: 'Day', style: !onDayView ? {backgroundColor: 'white'} : {}}, 
                    {value: false, label: 'Week', style: onDayView ? {backgroundColor: 'white'} : {}}]}>
                </SegmentedButtons>
                <TextInput label="Schedule" value={String(scheduleIndex)} style={{backgroundColor: 'white', marginTop: 10}} selectionColor="black" textColor="black"
	                render={(props) => (
                        <Picker style={{color: 'black', marginTop: 5}} dropdownIconColor='black' selectedValue={scheduleIndex} onValueChange={setScheduleIndex}>
                            {data && data.map((schedule, index) => {
                                return <Picker.Item key={index} label={schedule.title} value={index+1} />
                            })}
                        </Picker>
	                )}
                />
                <TextInput label="Timebox Duration" value={boxSizeNumber} onChangeText={setBoxSizeNumber} {...styles.paperInput}/>
                <TextInput label="Timebox Unit"  value={boxSizeUnit} {...styles.paperInput}
                    render={(props) => (
                        <Picker style={{color: 'black', marginTop: 5}} dropdownIconColor='black' selectedValue={boxSizeUnit} onValueChange={setBoxSizeUnit}>
                            <Picker.Item label="Min" value="min" />
                            <Picker.Item label="Hour" value="hr" />
                        </Picker>
                    )}
                />
                <Pressable onPress={() => setWakeupTimeModalVisible(true)}>
                    <TextInput 
                    label="Wakeup time" 
                    value={wakeupTimeText}
                    right={<TextInput.Icon onPress={() => setWakeupTimeModalVisible(true)} icon="clock-edit" />} 
                    editable={false} 
                    {...styles.paperInput}/>
                </Pressable>
            </Dialog.Content>
            <Dialog.Actions>
                <Button textColor="black" buttonColor="white" mode="contained" onPress={updateProfile}>Update</Button>
                <Button testID="exitSettings" textColor='white' onPress={props.hideDialog}>Exit</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <DatePicker 
            modal 
            mode="time" 
            date={wakeupTime} 
            onDateChange={
                (date) => {
                    setWakeupTime(date);
                    setWakeupTimeText(convertToTimeAndDate(date)[0]);
                }
            } 
            open={wakeupTimeModalVisible} 
            onConfirm={(date) => { 
                setWakeupTime(date); 
                setWakeupTimeModalVisible(false);
                setWakeupTimeText(convertToTimeAndDate(date)[0]);
            }} 
            onCancel={() => setWakeupTimeModalVisible(false)}>
        </DatePicker>
    </>)
};