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
import dayjs from "dayjs";
import { fetchAuthSession } from "aws-amplify/auth";

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
    const [hasUserSetGoalLimit, setHasUserSetGoalLimit] = useState(false);
    const [goalLimit, setGoalLimit] = useState(5);
    
    const {data} = props;

    function setOnDayView(value) {
        setDayView(value);
        dispatch({type: 'onDayView/set', payload: value});
    }

    async function updateProfile() {
        const wakeupTimeAsText = dayjs(wakeupTime).format('HH:mm');
        const convertedBackBoxSizeNumber = Number(boxSizeNumber);
        
        const session = await fetchAuthSession();
        const accessToken = session.tokens?.accessToken.toString();
        const headers = {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        
        try {
            await axios.put('/api/updateProfile', {
                scheduleIndex: (scheduleIndex - 1),
                scheduleID: data[scheduleIndex - 1].id,
                boxSizeUnit,
                boxSizeNumber: convertedBackBoxSizeNumber,
                wakeupTime: wakeupTimeAsText,
                userUUID: user.userId,
                goalLimit: Number(goalLimit),
            }, headers);
            dispatch({type: 'alert/set', payload: { open: true, title: "Profile", message: "Updated profile!" }});
            await queryClient.refetchQueries();
        } catch(error) {
            dispatch({type: 'alert/set', payload: { open: true, title: "Error", message: "An error occurred, please try again or contact the developer" }});
        };

        dispatch({
            type: 'profile/set',
            payload: {
                scheduleIndex: (scheduleIndex - 1),
                scheduleID: data[scheduleIndex - 1].id,
                boxSizeNumber: convertedBackBoxSizeNumber,
                boxSizeUnit,
                wakeupTime: wakeupTimeAsText,
                goalLimit: goalLimit,
            }
        });
    }

    function safeSetBoxSizeNumber(number) {
        let boxSizeNumber;
        
        if(number != '') {
            
            boxSizeNumber = Number(number)
            if(Number.isNaN(boxSizeNumber)) {
                boxSizeNumber = 1;
            }
            
        
            if(boxSizeUnit == "min") {
                if(boxSizeNumber > 59){
                    boxSizeNumber = 59;
                }else if(boxSizeNumber < 0) {
                    boxSizeNumber = 0;
                }
            }else if(boxSizeUnit == "hr") {
                while((24 % boxSizeNumber) > 0) {
                    boxSizeNumber--;
                }
                setBoxSizeNumber(boxSizeNumber);
            }

            setBoxSizeNumber(String(boxSizeNumber));
        }else{
            setBoxSizeNumber('');
        }
    }

    return (<>
        <Portal>
          <Dialog style={styles.forms.dialogStyle} visible={props.visible} onDismiss={props.hideDialog}>
            <Dialog.Title style={styles.forms.dialogTitleStyle}>Settings</Dialog.Title>
            <Dialog.Content>
                <SegmentedButtons theme={styles.forms.segmentedButtonsTheme} 
                value={dayView} style={{backgroundColor: 'white'}} onValueChange={setOnDayView} buttons={[{value: true, label: 'Day'}, {value: false, label: 'Week'}]}>
                </SegmentedButtons>
                <TextInput label="Schedule" value={String(scheduleIndex)} {...styles.paperInput}
	                render={(props) => (
                        <Picker style={styles.forms.pickerParentStyle} dropdownIconColor='black' selectedValue={scheduleIndex} onValueChange={setScheduleIndex}>
                            {data && data.map((schedule, index) => {
                                return <Picker.Item style={styles.forms.pickerItemStyle} key={index} label={schedule.title} value={index+1} />
                            })}
                        </Picker>
	                )}
                />
                <TextInput label="Timebox Duration" value={boxSizeNumber} onChangeText={safeSetBoxSizeNumber} {...styles.paperInput}/>
                <TextInput label="Timebox Unit"  value={boxSizeUnit} {...styles.paperInput}
                    render={(props) => (
                        <Picker style={styles.forms.pickerParentStyle} dropdownIconColor='black' selectedValue={boxSizeUnit} onValueChange={setBoxSizeUnit}>
                            <Picker.Item style={styles.forms.pickerItemStyle} label="Min" value="min" />
                            <Picker.Item style={styles.forms.pickerItemStyle} label="Hour" value="hr" />
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

                <TextInput 
                    label="Goal Limit?" 
                    value={hasUserSetGoalLimit ? "Yes" : "No"} 
                    {...styles.paperInput}
                    render={(props) => (
                        <Picker style={styles.forms.pickerParentStyle} dropdownIconColor='black' selectedValue={hasUserSetGoalLimit} onValueChange={setHasUserSetGoalLimit}>
                            <Picker.Item styles={styles.forms.pickerItemStyle} label="Goals Completed" value={false} />
                            <Picker.Item styles={styles.forms.pickerItemStyle} label="Set My Own" value={true} />
                        </Picker>
                )}></TextInput>
                {hasUserSetGoalLimit && <TextInput label="Goal Limit" value={goalLimit} onChangeText={setGoalLimit} {...styles.paperInput}/> }
            </Dialog.Content>
            <Dialog.Actions>
                <Button {...styles.forms.actionButton} onPress={updateProfile}>Update</Button>
                <Button testID="exitSettings" {...styles.forms.nonActionButton} onPress={props.hideDialog}>Exit</Button>
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