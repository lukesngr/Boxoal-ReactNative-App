import Svg, { Circle, Text } from "react-native-svg";
import { View } from "react-native";

export function StatisticsGraph(props) {
    let {percentage, text} = props;
    let realPercentage = percentage * 100;
    const size = 200;
    let strokeWidth = 4;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (circumference * realPercentage) / 100;
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
            stroke="#2f4858"                     
            fill="#2f4858"                     
            cx={size / 2}                     
            cy={size / 2}                     
            r={radius - strokeWidth/2}                     
            strokeWidth={0}                     
            strokeDasharray={circumference}                     
            strokeDashoffset={strokeDashoffset}                     
            strokeLinecap="round"                     
            rotation="-90"                     
            originX={size / 2}                     
            originY={size / 2}                 
        />             
    </Svg>         
</View>
        )
}