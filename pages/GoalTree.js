import { IconButton, Surface } from "react-native-paper";
import { getMaxNumberOfGoals } from "../modules/coreLogic";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { GoalTreeNode } from "../components/goals/GoalTreeNode";
import { current } from "@reduxjs/toolkit";
import AddGoalToTree  from "../components/goals/AddGoalToTree";


export function GoalTree(props) {
    const [currentLine, setCurrentLine] = useState(1);
    let goalsCompleted = props.data.goals.reduce((count, item) => item.completed ? count + 1 : count, 0);
    let goalsInLine = props.data.goals.filter((item) => item.partOfLine == currentLine);
    let maxNumberOfGoals = getMaxNumberOfGoals(goalsCompleted);
    let addNonActiveGoal = goalsInLine.length == 0;
    console.log(goalsInLine);

    function moveLeft() {
        if(currentLine > 1) {
            setCurrentLine(currentLine - 1);
        }else if(currentLine == 1) {
            setCurrentLine(maxNumberOfGoals);
        }
    }

    function moveRight() {
        if(currentLine < maxNumberOfGoals) {
            setCurrentLine(currentLine + 1);
        }else if(currentLine == maxNumberOfGoals) {
            setCurrentLine(1);
        }
    }
    return (
    <View style={{backgroundColor: '#D9D9D9', width: '100%', height: '100%', padding: 20, paddingLeft: 15, paddingRight: 15}}>
        <View style={{backgroundColor: 'white', width: '100%', height: '100%'}}>
            <Text style={{fontFamily: 'KameronRegular', fontSize: 35, color: 'black', textAlign: 'center', marginTop: 30}}>Goal Tree</Text>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                {maxNumberOfGoals > 1 && <IconButton icon="arrow-left" size={25} onPress={() => moveLeft()}></IconButton> }
                <Text style={{fontFamily: 'KameronRegular', fontSize: 25, color: 'black', marginTop: 15, marginHorizontal: 0}}>Goal {currentLine}</Text>
                {maxNumberOfGoals > 1 && <IconButton icon="arrow-right" size={25} onPress={() => moveRight()}></IconButton> }
            </View>
            <ScrollView>
                {goalsInLine.map((goal, index) => {
                    return <GoalTreeNode line={currentLine} key={index} goal={goal}></GoalTreeNode>
                })}
                <AddGoalToTree goals={props.data.goals} line={currentLine} addNonActiveGoal={addNonActiveGoal}></AddGoalToTree>
            </ScrollView>
        </View>
    </View>)
}