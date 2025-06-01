import { Text, View, Button, Pressable, Settings } from "react-native";
import DatePicker from "react-native-date-picker";
import { useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IconButton, MD2Colors } from "react-native-paper";
import SettingsDialog from "../SettingsDialog";

export default function TimeboxHeading(props) {
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const selectedDate = useSelector(state => state.selectedDate.value);
    const dispatch = useDispatch();

    return (
        <View>
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}> 
                <Text style={{fontFamily: 'KameronRegular', fontSize: 28, color: 'black', textAlign: 'center', marginTop: 5}}> Timeboxes</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: -25}}>
                    <IconButton testID="settingsCog" icon="cog" size={36} onPress={() => setDialogVisible(true)}></IconButton>
                    <IconButton icon="calendar-cursor" size={36} onPress={() => setDatePickerVisible(true)}></IconButton>
                </View>
            </View>
            <DatePicker modal mode="date" date={new Date(selectedDate)}
                onDateChange={(date) => dispatch({type: 'selectedDate/set', payload: date.toUTCString()})}
                open={datePickerVisible}
                onConfirm={(date) => 
                    {
                        dispatch({type: 'selectedDate/set', payload: date.toUTCString()})
                        setDatePickerVisible(false);
                    }
                }
                onCancel={() => setDatePickerVisible(false)}>
            </DatePicker>
            <SettingsDialog data={props.data} visible={dialogVisible} hideDialog={() => setDialogVisible(false)}></SettingsDialog>
        </View>
    )
}