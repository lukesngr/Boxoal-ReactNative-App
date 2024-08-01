import { Surface } from "react-native-paper";
import Svg, { Circle, Text } from "react-native-svg";
import { getDateWithSuffix, getProgressWithGoal } from "../../modules/coreLogic";
import dayjs from "dayjs";
import { View } from "react-native";

export default function GoalProgressIndicator(props) {
    let goalDateInDayJS = dayjs(props.goal.targetDate);
    let dateWithSuffix = getDateWithSuffix(goalDateInDayJS.date())
    let abbrievatedMonth = goalDateInDayJS.format('MMM')
    let progress = getProgressWithGoal(props.goal.timeboxes);
    const size = 50;
    let strokeWidth = 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (circumference * progress) / 100;
    return (
        <View style={{marginLeft: 10, marginRight: 10}}>
        <Svg width={size} height={size}>
            <Circle
                stroke="#D9D9D9"
                fill="none"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
            />
            <Circle
                stroke="#C5C27C"
                fill="none"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                rotation="-90"
                originX={size / 2}
                originY={size / 2}
            />
            <Text
                x={size / 2}
                y={(size / 2)-8}
                textAnchor="middle"
                dy=".3em"
                fontSize={15}
                fill="black"
            >{dateWithSuffix}</Text>
            <Text
                x={size / 2}
                y={(size / 2)+8}
                textAnchor="middle"
                dy=".3em"
                fontSize={15}
                fill="black"
            >{abbrievatedMonth}</Text>
      </Svg>
      </View>
    )
}