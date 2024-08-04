import { Dialog, Text, Button, Portal, SegmentedButtons, TextInput } from "react-native-paper"
import { signOut } from "aws-amplify/auth"
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Picker } from "@react-native-picker/picker";
import { set } from "../redux/activeOverlayInterval";

export default function SettingsDialog(props) {
    const selectedSchedule = useSelector(state => state.selectedSchedule.value);
    const onDayView = useSelector(state => state.onDayView.value);
    const [dayView, setDayView] = useState(onDayView);
    const [scheduleIndex, setScheduleIndex] = useState(selectedSchedule+1);
    const dispatch = useDispatch();
    const {data} = props;

    function setOnDayView(value) {
        setDayView(value);
        dispatch({type: 'onDayView/set', payload: value});
    }

    function setSchedule(value) {
        setScheduleIndex(value);
        dispatch({type: 'selectedSchedule/set', payload: value-1});
        
    }
    
    async function logOut() {
        await signOut();
        props.hideDialog();
        props.navigation.navigate('Login');
    }

    return (
        <Portal>
          <Dialog style={{backgroundColor: '#C5C27C'}} visible={props.visible} onDismiss={props.hideDialog}>
            <Dialog.Title>Settings</Dialog.Title>
            <Dialog.Content>
                <SegmentedButtons value={dayView} onValueChange={setOnDayView} buttons={[
                    {value: true, label: 'Day', style: !onDayView ? {backgroundColor: 'white'} : {}}, 
                    {value: false, label: 'Week', style: onDayView ? {backgroundColor: 'white'} : {}}]}>
                </SegmentedButtons>
                <TextInput label="Schedule" value={String(scheduleIndex)} style={{backgroundColor: 'white', marginTop: 10}} selectionColor="black" textColor="black"
	                render={(props) => (
                        <Picker style={{color: 'black', marginTop: 5}} dropdownIconColor='black' selectedValue={scheduleIndex} onValueChange={setSchedule}>
                            {data && data.map((schedule, index) => {
                                return <Picker.Item key={index} label={schedule.title} value={index+1} />
                            })}
                        </Picker>
	                )}
                />
            </Dialog.Content>
            <Dialog.Actions>
                <Button textColor="white" buttonColor="#49454F" mode="contained" onPress={logOut}>Logout</Button>
                <Button textColor='white' onPress={props.hideDialog}>Done</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
    )
};