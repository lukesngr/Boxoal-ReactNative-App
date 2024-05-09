import { Text } from "react-native-svg";

export default function NormalTimebox(props) {
    let height = `calc(${props.data.numberOfBoxes*100}%)`;
    return (
    <>
        <View style={{position: 'relative', height: height, backgroundColor: props.data.color}}>
            <Text>{props.data.title}</Text>
        </View>
    </>
    )
}