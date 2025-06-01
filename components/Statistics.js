import { Text, Surface } from "react-native-paper";
import { getStatistics } from "../modules/boxCalculations";
import { ScrollView, View } from "react-native";
import { StatisticsGraph } from "./StatisticsGraph";
import { styles } from "../styles/styles";

export function Statistics(props) {
    
    let {averageTimeOverBy, 
        averageTimeStartedOffBy, 
        percentagePredictedStart, 
        percentageCorrectTime, 
        percentageRescheduled, 
        hoursLeftToday} = getStatistics(props.recordedTimeboxes, props.timeboxes);
    

    return (
    <ScrollView>
        <Surface style={styles.dashboard.statTextSurface} elevation={4}>
            <Text style={styles.dashboard.statHeading}>Average Recordings Are {averageTimeOverBy > 0 ? "Over" : "Under"} By</Text>
            <View style={styles.dashboard.statTextContainer}>
                <Text style={styles.dashboard.statText}>{averageTimeOverBy > 0 ? averageTimeOverBy.toFixed(2) : -averageTimeOverBy.toFixed(2)}</Text>
            </View>
            <Text style={styles.dashboard.statDenominationLabel}>Minutes</Text>
        </Surface>

        <Surface style={styles.dashboard.statTextSurface} elevation={4}>
            <Text style={styles.dashboard.statHeading}>Average Recordings Are {averageTimeStartedOffBy > 0 ? "Late" : "Early"} By</Text>
            <View style={styles.dashboard.statTextContainer}>
                <Text style={styles.dashboard.statText}>{averageTimeStartedOffBy > 0 ? averageTimeStartedOffBy.toFixed(2) : -averageTimeStartedOffBy.toFixed(2)}</Text>
            </View>
            <Text style={styles.dashboard.statDenominationLabel}>Minutes</Text>
        </Surface>

        <Surface style={styles.dashboard.statTextSurface} elevation={4}>
            <Text style={styles.dashboard.statHeading}>Hours Available Today</Text>
            <View style={styles.dashboard.statTextContainer}>
                <Text style={styles.dashboard.statText}>{hoursLeftToday}</Text>
            </View>
            <Text style={styles.dashboard.statDenominationLabel}>Hours</Text>
        </Surface>

        
        <StatisticsGraph percentage={percentagePredictedStart} title="Matching Scheduled Start" property="Scheduled Start"/>
        <StatisticsGraph percentage={percentageCorrectTime} title="Matching Scheduled Time" property="Scheduled Time"/>
        <StatisticsGraph percentage={percentageRescheduled} title="Rescheduled" property="Rescheduled"/>
        </ScrollView>
    )
}