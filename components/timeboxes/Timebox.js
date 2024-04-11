import { Pressable, View, Text } from "react-native"
import NormalTimebox from "./NormalTimebox";

export default function Timebox(props) {
    function onPress() {
        console.log(props.day.date+"/"+props.day.month);
        console.log(props.time);
    }

    const [modalVisible, setModalVisible] = useState(false);
    const timeboxGrid = useSelector(state => state.timeboxGrid.value);
    const dispatch = useDispatch();

    let date = day.date+"/"+day.month;
    let dayName = day.name;
    let active = ifEqualOrBeyondCurrentDay(index, true, false)
    let data = timeboxGrid.get(date)?.get(time);

    return (
    <View style={{borderWidth: 1, padding: 1, borderColor: 'black', width: 50.5, height: 30}}>
        <Pressable onPress={onPress}>
            <Text></Text>
        </Pressable>
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
            {data ? (<NormalTimebox></NormalTimebox>) : (<CreateTimeboxForm></CreateTimeboxForm>)}
        </Modal>
    </View>
    )
}