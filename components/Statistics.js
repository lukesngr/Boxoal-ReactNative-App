import { Text, Surface } from "react-native-paper";
import { getStatistics } from "../modules/boxCalculations";
import { ScrollView, View } from "react-native";
import { StatisticsGraph } from "./StatisticsGraph";
import { styles } from "../styles/styles";

export function Statistics(props) {
    let hoursLeftInDay = 24; 
    let {averageTimeOverBy, averageTimeStartedOffBy, percentagePredictedStart, percentageCorrectTime, percentageRescheduled} = getStatistics(props.recordedTimeboxes);
    for(let timebox of props.timeboxes) {
        let isSameDate = (new Date(timebox.startTime).getDate() == new Date().getDate()) && (new Date(timebox.startTime).getMonth() == new Date().getMonth()) && (new Date(timebox.startTime).getFullYear() == new Date().getFullYear());
        let isReoccuringDaily = timebox.reoccuring != null && timebox.reoccuring.reoccurFrequency === "daily";
        let isReoccuringWeeklyAndToday = timebox.reoccuring != null && timebox.reoccuring.reoccurFrequency === "weekly" && timebox.reoccuring.weeklyDay == new Date().getDay();
        let isReoccuringDailyOrWeeklyAndToday = isReoccuringDaily || isReoccuringWeeklyAndToday;
        if(timebox.isTimeblock && (isSameDate || isReoccuringDailyOrWeeklyAndToday)) {
            let hoursConversionDivider = 3600000;
            hoursLeftInDay -= ((new Date(timebox.endTime) - new Date(timebox.startTime)) / hoursConversionDivider);
        }   
    }

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
                <Text style={{fontFamily: 'digital-7', fontSize: 80, color: '#6145B5', textAlign: 'center'}}>{hoursLeftInDay}</Text>
            </View>
            <Text style={{fontFamily: 'Koulen-Regular', textAlign: 'right', marginHorizontal: 10, fontSize: 20, color: 'white'}}>Hours</Text>
        </Surface>

        <Surface style={{backgroundColor: styles.primaryColor, height: 'fit-content', width: '80%', marginTop: 30, marginHorizontal: 30}}  elevation={4}>
                <StatisticsGraph percentage={percentagePredictedStart} text="Predicted Start"/>
                <StatisticsGraph percentage={percentageCorrectTime} text="Correct Time"/>
                <StatisticsGraph percentage={percentageRescheduled} text="Rescheduled"/>
        </Surface>
        </ScrollView>
    )
}