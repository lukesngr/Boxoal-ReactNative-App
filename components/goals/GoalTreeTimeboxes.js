import { View } from "react-native";
import { Text, Icon } from "react-native-paper";
import Svg from "react-native-svg";
import {Path} from "react-native-svg";
import dayjs from "dayjs";
import { getAverageTimeOverAndOffBy } from "../../modules/boxCalculations";

export function GoalTreeTimeboxes(props) {
    return (<View>
        <View>
            <Text>{props.goal.title}</Text>
            <Text>{dayjs(props.goal.targetDate).format('D MMM')}</Text>
            {props.goal.state == "completed" && <Text style={{color: '#4FF38E'}} className="goalCardUndertext">Completed</Text>}
            {props.goal.state == "failed" && <Text style={{color: '#FF0606'}} className="goalCardUndertext">Failed</Text>}
            {props.goal.state == "active" && <Text className="goalCardUndertext">{goal.percentageCompleted}%</Text>}
        </View>
        {props.goal.timeboxes.map((timebox, index) => {
                const isFailed = dayjs().isAfter(dayjs(timebox.endTime)) && timebox.recordedTimeBoxes.length == 0;
                const isCompleted = timebox.recordedTimeBoxes.length > 0;
                let minutesOverBy = 0;
                let timeStartedAccuracyForTimebox = 0;
                if(isCompleted) {
                    ({minutesOverBy, timeStartedAccuracyForTimebox} = getAverageTimeOverAndOffBy(timebox));
                }
                return (<>
                <Svg style={{alignSelf: 'center'}} width={25} height={45} viewBox="0 0 24 30">
                    <Path 
                        d="M12 0 L12 24 M5 17 L12 24 L19 17" 
                        stroke="black" 
                        strokeWidth={2}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </Svg>
                <View key={index} className="goalTimeboxCard">
                    <Text className="goalTimeboxTitle">
                        <Icon source="clock-time-eight-outline" size={20} />
                        {timebox.title} - {dayjs(timebox.startTime).format('hh:mm DD/MM')}
                    </Text>
                    <View>
                        {isFailed && <Text className="goalTimeboxFailed">Failed</Text>}
                        {isCompleted && <Text className="goalTimeboxCompleted">Completed</Text>}
                        {isCompleted && <Text className="goalTimeboxCompleted">{timeStartedAccuracyForTimebox > 0 ? (timeStartedAccuracyForTimebox.toFixed(2) +" min late") : ((-timeStartedAccuracyForTimebox).toFixed(2) +" min early")}</Text>}
                        {isCompleted && <Text className="goalTimeboxCompleted">{minutesOverBy > 0 ? (minutesOverBy.toFixed(2) +" min longer") : ((-minutesOverBy).toFixed(2) +" min earlier")}</Text>}
                    </View>
                </View>
                </>)
        })}
    </View>)
}