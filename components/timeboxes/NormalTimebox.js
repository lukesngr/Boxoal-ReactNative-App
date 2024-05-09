import { Text, View } from "react-native";

export default function NormalTimebox(props) {
    let height = 31*props.data.numberOfBoxes;

    return (
    <>
        <View style={{position: 'relative', height: height, backgroundColor: props.data.color, width: '100%'}}>
            <Text style={{color: 'black'}}>{props.data.title}</Text>
        </View>
    </>
    )
}