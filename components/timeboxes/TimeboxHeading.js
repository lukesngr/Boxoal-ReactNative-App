import { Text, View, Button, Pressable } from "react-native";
import DatePicker from "react-native-date-picker";
import { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { useDispatch, useSelector } from "react-redux";

export default function TimeboxHeading() {
    const [visible, setVisible] = useState(false);
    const selectedDate = useSelector(state => state.selectedDate.value);
    const dispatch = useDispatch();

    return (
        <View>
            <Text style={{fontSize: 28, color: 'black', textAlign: 'center', marginTop: 4}}>
                My Timeboxes 
                <Pressable onPress={() => setVisible(true)}>
                    <FontAwesomeIcon icon={faCalendar} size={32}/>
                </Pressable>
            </Text>
            
            
            <DatePicker
                modal
                mode="date"
                date={selectedDate}
                onDateChange={(date) => dispatch({type: 'selectedDate/set', payload: date})}
                open={visible}
                onConfirm={(date) => 
                    {
                        dispatch({type: 'selectedDate/set', payload: date})
                        setVisible(false);
                    }
                }
                onCancel={() => setVisible(false)}></DatePicker>
        </View>
    )
}