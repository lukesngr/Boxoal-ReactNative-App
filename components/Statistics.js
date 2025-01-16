import { Text } from "react-native-paper";
import { getStatistics } from "../modules/boxCalculations";

export function Statistics(props) {
    let {averageTimeOverBy, averageTimeStartedOffBy, percentagePredictedStart, percentageCorrectTime, percentageRescheduled} = getStatistics(props.recordedTimeboxes);

    return (
        <View>
            <Text style={{fontFamily: 'KameronRegular', fontSize: 20, color: 'black', marginTop: 20, marginHorizontal: 30}}>Average Time Over By: {averageTimeOverBy}min</Text>
            <Text style={{fontFamily: 'KameronRegular', fontSize: 20, color: 'black', marginTop: 20, marginHorizontal: 30}}>Average Time Started Off By: {averageTimeStartedOffBy}min</Text>
            <StatisticsProgressIndicator percentage={percentagePredictedStart} text="Percentage That Is Correct Start"/>
            <StatisticsProgressIndicator percentage={percentageCorrectTime} text="Percentage That Is Correct Length"/>
            <StatisticsProgressIndicator percentage={percentageRescheduled} text="Percentage That is Rescheduled"/>
        </View>
    )
}