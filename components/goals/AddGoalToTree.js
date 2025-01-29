import Svg, {Circle, Line} from "react-native-svg";
import React from "react";
import { Pressable, View } from "react-native";
import { useState } from "react";
import  CreateGoalForm  from "./CreateGoalForm";
import { useSelector } from "react-redux";

export default function AddGoalToTree(props) {

    let size = 70; 
    let color = 'black'; 
    let strokeWidth = 2; 
    let backgroundColor = '#D9D9D9';
    let plusSize = 0.4;
    const center = size / 2;
    const radius = (size - strokeWidth) / 2.2; 
    const plusLength = size * plusSize;
    const halfPlusLength = plusLength / 2;
    const [createGoalVisible, setCreateGoalVisible] = useState(false);
    let {scheduleID} = useSelector((state) => state.profile.value);
    return (
    <>
        <View style={{alignSelf: 'center'}}>
            <Pressable onPress={() => setCreateGoalVisible(true)}>
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <Circle cx={center} cy={center} r={radius} fill={backgroundColor}/>
                <Line
                x1={center - halfPlusLength}
                y1={center}
                x2={center + halfPlusLength}
                y2={center}
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                />
                <Line
                x1={center}
                y1={center - halfPlusLength}
                x2={center}
                y2={center + halfPlusLength}
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                />
            </Svg>
            </Pressable>
        </View>
        <CreateGoalForm visible={createGoalVisible} active={props.addNonActiveGoal} line={props.line} close={() => setCreateGoalVisible(false)} id={scheduleID}  goals={props.goals}></CreateGoalForm>
    </>)
}