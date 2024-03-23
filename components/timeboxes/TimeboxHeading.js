import { Text, View, Button, Pressable } from "react-native";
import DatePicker from "react-native-date-picker";
import { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { ScheduleContext } from "../ScheduleContext";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";

export default function TimeboxHeading(props) {
    const [visible, setVisible] = useState(false);
    const {selectedDate, setSelectedDate, ...leftovers} = useContext(ScheduleContext);

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
                onDateChange={(date) => setSelectedDate(date)}
                open={visible}
                onConfirm={(date) => 
                    {
                        setSelectedDate(date);
                        setVisible(false);
                    }
                }
                onCancel={() => setVisible(false)}></DatePicker>
        </View>
    )
}