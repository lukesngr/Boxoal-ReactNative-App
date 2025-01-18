import { Text, Surface } from "react-native-paper";
import { getStatistics } from "../modules/boxCalculations";
import { View } from "react-native";
import { StatisticsProgressIndicator } from "./StatisticsProgressIndicator";

export function Statistics(props) {
    let {averageTimeOverBy, averageTimeStartedOffBy, percentagePredictedStart, percentageCorrectTime, percentageRescheduled} = getStatistics(props.recordedTimeboxes);

    return (
        <Surface style={{backgroundColor: '#C5C27C', height: 'fit-content', width: '80%', marginTop: 30, marginHorizontal: 30}} elevation={4}>
            <Text style={{fontFamily: 'KameronRegular', fontSize: 25, color: 'black', marginTop: 20, marginHorizontal: 20}}>Statistics</Text>
            <Text style={{fontFamily: 'Roboto', fontSize: 15, color: 'black', marginTop: 20, marginHorizontal: 20}}>Average Time Over By: {averageTimeOverBy}min</Text>
            <Text style={{fontFamily: 'Roboto', fontSize: 15, color: 'black', marginTop: 20, marginHorizontal: 20}}>Average Time Started Off By: {averageTimeStartedOffBy}min</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, marginBottom: 20}}>
                <StatisticsProgressIndicator percentage={percentagePredictedStart} text="Predicted Start"/>
                <StatisticsProgressIndicator percentage={percentageCorrectTime} text="Correct Time"/>
                <StatisticsProgressIndicator percentage={percentageRescheduled} text="Rescheduled"/>
            </View>
        </Surface>
    )
}