import { Pressable, View, Text } from "react-native";

export default function Button(props) {
    return (
        <View style={props.outlineStyle}>
            <Pressable onPress={props.onPress}>
                <Text style={props.textStyle}>{props.title}</Text>
            </Pressable>
        </View>
    )
}