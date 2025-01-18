import { Text, Surface } from "react-native-paper";
import { getStatistics } from "../modules/boxCalculations";
import { View } from "react-native";
import { StatisticsProgressIndicator } from "./StatisticsProgressIndicator";

export function Statistics(props) {
    let {averageTimeOverBy, averageTimeStartedOffBy, percentagePredictedStart, percentageCorrectTime, percentageRescheduled} = getStatistics(props.recordedTimeboxes);

    return (
        <Surface style={{backgroundColor: 'white', height: 'fit-content', width: '80%', marginTop: 4, marginHorizontal: 30}} elevation={4}>
            <Text style={{fontFamily: 'KameronRegular', fontSize: 25, color: 'black', marginTop: 20, marginHorizontal: 30}}>Statistics</Text>
            <Text style={{fontFamily: 'Roboto', fontSize: 15, color: 'black', marginTop: 20, marginHorizontal: 30}}>Average Time Over By: {averageTimeOverBy}min</Text>
            <Text style={{fontFamily: 'Roboto', fontSize: 15, color: 'black', marginTop: 20, marginHorizontal: 30}}>Average Time Started Off By: {averageTimeStartedOffBy}min</Text>
            <StatisticsProgressIndicator percentage={percentagePredictedStart} text="Percentage That Is Correct Start"/>
            <StatisticsProgressIndicator percentage={percentageCorrectTime} text="Percentage That Is Correct Length"/>
            <StatisticsProgressIndicator percentage={percentageRescheduled} text="Percentage That is Rescheduled"/>
        </Surface>
    )
}