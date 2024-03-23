import { Text } from "react-native";
import DatePicker from "react-native-date-picker";

export default function TimeboxHeading(props) {
    const [visible, setVisible] = useState(false);
    const {selectedDate, setSelectedDate, ...leftovers} = useContext(ScheduleContext);

    return (
        <View>
            <Text>My Timeboxes</Text>
            <FontAwesomeIcon onPress={setVisible(true)} icon={faCalendar} />
            <DatePicker
                modal
                mode="date"
                date={selectedDate}
                onDateChange={setSelectedDate}
                visible={visible}
                onConfirm={() => setVisible(false)}
                onCancel={() => setVisible(false)}></DatePicker>
        </View>
    )
}