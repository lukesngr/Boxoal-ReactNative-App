import Svg, { Circle, Text, Path } from "react-native-svg";
import { getProgressWithGoal } from "../../modules/coreLogic";
import { getDateWithSuffix } from "../../modules/formatters";
import dayjs from "dayjs";
import { View } from "react-native";

export function GoalTreeNode(props) {
    let goalDateInDayJS = dayjs(props.goal.targetDate);
    let dateWithSuffix = getDateWithSuffix(goalDateInDayJS.date())
    let abbrievatedMonth = goalDateInDayJS.format('MMM')
    let progress = getProgressWithGoal(props.goal.timeboxes);
    const size = 120;
    let strokeWidth = 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (circumference * progress) / 100;
    let outsideColor = '#D9D9D9';
    let insideColor = '#styles.primaryColor';
    let {title} = props.goal;
    if(props.goal.completed) {
        outsideColor = '#styles.primaryColor';
        insideColor = '#D9D9D9';
        dateWithSuffix = getDateWithSuffix(dayjs(props.goal.completedOn).date());
    }

    if(title.length > 10) {
        title = title.substring(0, 8) + '..';
    }
    return (
        <View style={{alignSelf: 'center'}}>
            <Svg width={size} height={size}>
                <Circle
                    stroke={outsideColor}
                    fill={outsideColor}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                />
                <Circle
                    stroke={insideColor}
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
                    y={(size / 2)-35}
                    textAnchor="middle"
                    dy=".3em"
                    fontSize={15}
                    fill={"black"}
                    fontFamily={'KameronRegular'}
                >{dateWithSuffix}</Text>
                <Text
                    x={size / 2}
                    y={(size / 2)-20}
                    textAnchor="middle"
                    dy=".3em"
                    fontSize={15}
                    fill={"black"}
                    fontFamily={'KameronRegular'}
                >{abbrievatedMonth}</Text>
                <Text x={size / 2} y={(size / 2)+1} textLength={50} textAnchor="middle" dy=".3em" fontSize={22} fill={"black"} fontFamily={'KameronRegular'}>{title}</Text>
        </Svg>
        <Svg width={110} height={45} viewBox="0 0 24 30">
            <Path 
                d="M12 0 L12 24 M5 17 L12 24 L19 17" 
                stroke="black" 
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
      </View>
    )
}