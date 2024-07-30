import { Text, View, Button, Pressable } from "react-native";
import DatePicker from "react-native-date-picker";
import { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { IconButton, MD2Colors } from "react-native-paper";

export default function TimeboxHeading() {
    const [visible, setVisible] = useState(false);
    const selectedDate = useSelector(state => state.selectedDate.value);
    const dispatch = useDispatch();

    return (
        <View>
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}> 
                <Text style={{fontSize: 28, color: 'black', textAlign: 'center', marginTop: 5}}> Timeboxes</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: -25}}>
                    <IconButton icon="cog" size={36} onPress={() => console.log("Settings")}></IconButton>
                    <IconButton icon="calendar-cursor" size={36} onPress={() => setVisible(true)}></IconButton>
                </View>
            </View>
            
            <DatePicker modal mode="date" date={new Date(selectedDate)}
                onDateChange={(date) => dispatch({type: 'selectedDate/set', payload: date.toUTCString()})}
                open={visible}
                onConfirm={(date) => 
                    {
                        dispatch({type: 'selectedDate/set', payload: date.toUTCString()})
                        setVisible(false);
                    }
                }
                onCancel={() => setVisible(false)}>
            </DatePicker>
        </View>
    )
}