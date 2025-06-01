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
        <Surface style={{backgroundColor: styles.primaryColor, height: 'fit-content', width: '80%', marginTop: 30, marginHorizontal: 30}} elevation={4}>
            <Text style={{fontFamily: 'Koulen-Regular', fontSize: 19, color: 'white', marginTop: 20, marginHorizontal: 10}}>{averageTimeOverBy > 0 ? "Time On Average Recordings Are Over By" : "Time On Average Recordings Are Under By"}</Text>
            <View style={{backgroundColor: '#1A0124', marginHorizontal: 10}}>
                <Text style={{fontFamily: 'digital-7', fontSize: 80, color: '#6145B5', textAlign: 'center'}}>{averageTimeOverBy > 0 ? averageTimeOverBy.toFixed(2) : -averageTimeOverBy.toFixed(2)}</Text>
            </View>
            <Text style={{fontFamily: 'Koulen-Regular', textAlign: 'right', marginHorizontal: 10, fontSize: 20, color: 'white'}}>Minutes</Text>
        </Surface>

        <Surface style={{backgroundColor: styles.primaryColor, height: 'fit-content', width: '80%', marginTop: 30, marginHorizontal: 30}} elevation={4}>
            <Text style={{fontFamily: 'Koulen-Regular', fontSize: 19, color: 'white', marginTop: 20, marginHorizontal: 10}}>{averageTimeStartedOffBy > 0 ? "Time Average Recordings Are Late By" : "Time On Average Recordings Are Early By"}</Text>
            <View style={{backgroundColor: '#1A0124', marginHorizontal: 10}}>
                <Text style={{fontFamily: 'digital-7', fontSize: 80, color: '#6145B5', textAlign: 'center'}}>{averageTimeStartedOffBy > 0 ? averageTimeStartedOffBy.toFixed(2) : -averageTimeStartedOffBy.toFixed(2)}</Text>
            </View>
            <Text style={{fontFamily: 'Koulen-Regular', textAlign: 'right', marginHorizontal: 10, fontSize: 20, color: 'white'}}>Minutes</Text>
        </Surface>

        <Surface style={{backgroundColor: styles.primaryColor, height: 'fit-content', width: '80%', marginTop: 30, marginHorizontal: 30}} elevation={4}>
            <Text style={{fontFamily: 'Koulen-Regular', fontSize: 19, color: 'white', marginTop: 20, marginHorizontal: 10}}>Hours Available Today</Text>
            <View style={{backgroundColor: '#1A0124', marginHorizontal: 10}}>
                <Text style={{fontFamily: 'digital-7', fontSize: 80, color: '#6145B5', textAlign: 'center'}}>{hoursLeftToday}</Text>
            </View>
            <Text style={{fontFamily: 'Koulen-Regular', textAlign: 'right', marginHorizontal: 10, fontSize: 20, color: 'white'}}>Hours</Text>
        </Surface>

        
        <StatisticsGraph percentage={percentagePredictedStart} title="Matching Scheduled Start" property="Scheduled Start"/>
        <StatisticsGraph percentage={percentageCorrectTime} title="Matching Scheduled Time" property="Scheduled Time"/>
        <StatisticsGraph percentage={percentageRescheduled} title="Rescheduled" property="Rescheduled"/>
        </ScrollView>
    )
}