import { IconButton, Surface } from "react-native-paper";
import { getMaxNumberOfGoals } from "../modules/coreLogic";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { GoalTreeNode } from "../components/goals/GoalTreeNode";
import { current } from "@reduxjs/toolkit";
import AddGoalToTree  from "../components/goals/AddGoalToTree";
import { GoalTreeTimeboxes } from "../components/goals/GoalTreeTimeboxes";
import { useSelector } from "react-redux";


export function GoalTree(props) {
    const profile = useSelector(state => state.profile.value);
    const scheduleData = useSelector(state => state.scheduleData.value);
    const [currentLine, setCurrentLine] = useState(1);
    const [onTimeboxView, setOnTimeboxView] = useState({data: {}, open: false});
    
    const goalsMap = scheduleData.goals;
    const goalsForSchedule = goalsMap ? goalsMap.getFromK1(props.data.id) : [];
    
    let goalsCompleted = goalsForSchedule.reduce((count, item) => item.completed ? count + 1 : count, 0);
    let goalsInLine = goalsForSchedule.filter((item) => item.partOfLine == currentLine);
    let maxNumberOfGoals = getMaxNumberOfGoals(goalsCompleted);
    let addNonActiveGoal = goalsInLine.length == 0;

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
            <View style={{flexDirection: 'row', alignItems: 'center', paddingLeft: 20, justifyContent: 'center', backgroundColor: 'white'}}>
                
                
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'center', overflow: 'visible', paddingTop: 10}}>
                {onTimeboxView.open ? (<Pressable onPress={() => setOnTimeboxView({data: {}, open: false})}>
                    <View style={{backgroundColor: '#403d3d', marginTop: 25, paddingHorizontal: 20, paddingVertical: 10, marginBottom: 10}}>
                        <Text style={{fontFamily: 'Koulen-Regular', fontSize: 25, color: 'white'}}>Go Back</Text>
                    </View>
                    </Pressable>) : 
                (<>
                    {maxNumberOfGoals > 1 && <IconButton icon="arrow-left" size={25} onPress={() => moveLeft()}></IconButton> }
                    <Text style={{fontFamily: 'KameronRegular', fontSize: 35, color: 'black', marginTop: 10, marginHorizontal: 0}}>Goal {currentLine}</Text>
                    <IconButton icon="menu" size={35} onPress={props.close}></IconButton>
                    {maxNumberOfGoals > 1 && <IconButton icon="arrow-right" size={25} onPress={() => moveRight()}></IconButton> }
                </>)
                }
            </View>
            <ScrollView>
                {onTimeboxView.open ? (<GoalTreeTimeboxes goal={onTimeboxView.data}></GoalTreeTimeboxes>) : (
                    <>
                        {goalsInLine.map((goal, index) => {
                            return <GoalTreeNode line={currentLine} key={index} goal={goal} setTimeboxView={setOnTimeboxView}></GoalTreeNode>
                        })}
                        <AddGoalToTree goals={goalsForSchedule} line={currentLine} addNonActiveGoal={addNonActiveGoal}></AddGoalToTree>
                    </>
                )}
                <View style={{height: 20}}></View>
            </ScrollView>
        </View>
    </View>)
}
