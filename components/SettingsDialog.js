import { Dialog, Text, Button, Portal, SegmentedButtons } from "react-native-paper"
import { signOut } from "aws-amplify/auth"
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

export default function SettingsDialog(props) {
    const {viewType, selectedSchedule} = useSelector(state => state.settings.value);
    const [view, setView] = useState(viewType);
    const [scheduleIndex, setScheduleIndex] = useState(selectedSchedule);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({type: 'settings/set', payload: {viewType: view, selectedSchedule: selectedSchedule}});
    }, [view, scheduleIndex]);

    return (
        <Portal>
          <Dialog style={{backgroundColor: '#C5C27C'}} visible={props.visible} onDismiss={props.hideDialog}>
            <Dialog.Title>Settings</Dialog.Title>
            <Dialog.Content>
                <SegmentedButtons value={view} onValueChange={setView} buttons={[{value: 'day', label: 'Day'}, {value: 'week', label: 'Week'}]}>
                </SegmentedButtons>
            </Dialog.Content>
            <Dialog.Actions>
                <Button textColor="white" buttonColor="#49454F" mode="contained" onPress={signOut}>Logout</Button>
                <Button textColor='white' onPress={props.hideDialog}>Done</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
    )
};