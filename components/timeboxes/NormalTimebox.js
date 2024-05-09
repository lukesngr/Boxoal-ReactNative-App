import { Text, View } from "react-native";

export default function NormalTimebox(props) {
    let height = `calc(${props.data.numberOfBoxes*100}% + 2dp)`;
    return (
    <>
        <View style={{position: 'relative', height: height, backgroundColor: props.data.color, width: '100%'}}>
            <Text>{props.data.title}</Text>
        </View>
    </>
    )
}