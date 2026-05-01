import { View } from "react-native";
import { Text, Icon } from "react-native-paper";
import Svg from "react-native-svg";
import {Path} from "react-native-svg";
import dayjs from "dayjs";
import { getAverageTimeOverAndOffBy } from "../../modules/boxCalculations";
import { styles } from "../../styles/styles";
import { useSelector } from "react-redux";

export function GoalTreeTimeboxes(props) {
    const timeboxesMap = useSelector(state => state.scheduleData.value.timeboxes);
    const recordedTimeboxesMap = useSelector(state => state.scheduleData.value.recordedTimeboxes);
    const timeboxesForGoal = timeboxesMap ? timeboxesMap.getFromK1(props.goal.id) : [];
    
    return (<View style={{alignSelf: 'center'}}>
        <View style={{backgroundColor: styles.primaryColor, maxWidth: '80%', paddingHorizontal: '10%', paddingVertical: '5%'}}>
            <Text style={{fontFamily: 'Koulen-Regular', fontSize: 30, color: 'white'}}>{props.goal.title}</Text>
            <Text style={{fontFamily: 'Koulen-Regular', color: 'white', fontSize: 15, textAlign: 'center'}}>{dayjs(props.goal.targetDate).format('D MMM')}</Text>
            {props.goal.state == "completed" && <Text style={{color: '#4FF38E', textAlign: 'center'}} className="goalCardUndertext">Completed</Text>}
            {props.goal.state == "failed" && <Text style={{color: '#FF0606', textAlign: 'center'}} className="goalCardUndertext">Failed</Text>}
            {props.goal.state == "active" && <Text className="goalCardUndertext">{props.goal.percentageCompleted}%</Text>}
        </View>
        {timeboxesForGoal.map((timebox, index) => {
                const recordedTimebox = recordedTimeboxesMap ? recordedTimeboxesMap.getFromK2(timebox.objectUUID) : null;
                const isFailed = dayjs().isAfter(dayjs(timebox.endTime)) && recordedTimebox == null;
                const isCompleted = recordedTimebox != null;
                let minutesOverBy = 0;
                let timeStartedAccuracyForTimebox = 0;
                if(isCompleted) {
                    ({minutesOverBy, timeStartedAccuracyForTimebox} = getAverageTimeOverAndOffBy(timebox));
                }
                return (<>
                <Svg key={index+"svg"} style={{alignSelf: 'center'}} width={25} height={45} viewBox="0 0 24 30">
                    <Path 
                        d="M12 0 L12 24 M5 17 L12 24 L19 17" 
                        stroke="black" 
                        strokeWidth={2}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </Svg>
                <View key={index+"view"} style={{backgroundColor: '#403d3d', maxWidth: '80%', paddingHorizontal: '10%', paddingVertical: '5%'}} key={index} className="goalTimeboxCard">
                    <View style={{alignItems: 'center'}}>
                        <Icon color="white" source="clock-time-eight-outline" size={20} />
                    </View>
                    <Text style={{fontFamily: 'Koulen-Regular', fontSize: 30, color: 'white'}} className="goalTimeboxTitle">
                        
                        {timebox.title} - {dayjs(timebox.startTime).format('hh:mm DD/MM')}
                    </Text>
                    <View>
                        {isFailed && <Text style={{fontFamily: 'Koulen-Regular', color: '#FF0606', fontSize: 15}} className="goalTimeboxFailed">Failed</Text>}
                        {isCompleted && <Text style={{fontFamily: 'Koulen-Regular', color: '#4FF38E', fontSize: 15}} className="goalTimeboxCompleted">Completed</Text>}
                        {isCompleted && <Text style={{fontFamily: 'Koulen-Regular', color: '#4FF38E', fontSize: 15}} className="goalTimeboxCompleted">{timeStartedAccuracyForTimebox > 0 ? (timeStartedAccuracyForTimebox.toFixed(2) +" min late") : ((-timeStartedAccuracyForTimebox).toFixed(2) +" min early")}</Text>}
                        {isCompleted && <Text style={{fontFamily: 'Koulen-Regular', color: '#4FF38E', fontSize: 15}} className="goalTimeboxCompleted">{minutesOverBy > 0 ? (minutesOverBy.toFixed(2) +" min longer") : ((-minutesOverBy).toFixed(2) +" min earlier")}</Text>}
                    </View>
                </View>
                </>)
        })}
    </View>)
}
