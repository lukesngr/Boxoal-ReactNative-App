import { Text, View } from "react-native";
import { styles } from "../../styles/styles";
import { useSelector } from "react-redux";
import { getPercentageOfBoxSizeFilled } from "../../modules/boxCalculations";

export default function NormalTimebox(props) {
    const onDayView = useSelector(state => state.onDayView.value);
    const {boxSizeNumber, boxSizeUnit} = useSelector(state => state.profile.value);
    let fontSize = onDayView ? 20 : 12;
    let timeboxHeight = onDayView ? styles.enlargedTimeboxHeight : styles.normalTimeboxHeight;
    let percentageOfBoxSizeFilled = getPercentageOfBoxSizeFilled(boxSizeUnit, boxSizeNumber, new Date(props.data.startTime), new Date(props.data.endTime));
    let height = Math.floor(timeboxHeight*props.data.numberOfBoxes*percentageOfBoxSizeFilled);
    return (
    <View style={{position: 'relative', height: height, backgroundColor: props.data.color, width: '100%', marginTop: props.marginFromTop}}>
        <Text style={{fontSize: fontSize, color: 'black'}}>{props.data.title}</Text>
    </View>
    )
}