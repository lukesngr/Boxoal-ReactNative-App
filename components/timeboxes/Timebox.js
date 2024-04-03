import { Pressable, View, Text } from "react-native"

export default function Timebox(props) {
    function onPress() {
        console.log(props.day.date+"/"+props.day.month);
        console.log(props.time);
    }

    return (
    <View style={{borderWidth: 1, padding: 1, borderColor: 'black', width: 50.5}}>
        <Pressable onPress={onPress}>
            <Text>+</Text>
        </Pressable>
    </View>
    )
}