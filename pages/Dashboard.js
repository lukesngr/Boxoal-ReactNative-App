import { View, Text } from "react-native";
import { ProgressBar } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import serverIP from "../modules/serverIP";
import { getProgressAndLevel } from "../modules/coreLogic";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Statistics } from "../components/Statistics";
import { getProgressWithGoal } from "../modules/coreLogic";
export function Dashboard(props) {

  const {scheduleIndex} = useSelector(state => state.profile.value);
  let userID = props.userID;
  let data = props.data[scheduleIndex]
  let goalsCompleted = data.goals.reduce((count, item) => item.completed ? count + 1 : count, 0);
  let averageProgress = 0;
  for(let goal of data.goals) {
    averageProgress += getProgressWithGoal(goal.timeboxes);
  }
  if(data.goals.length != 0) { averageProgress = averageProgress / data.goals.length; }
  let recordedTimeboxes = props.data[scheduleIndex].recordedTimeboxes;

  return (
    <View style={{backgroundColor: '#D9D9D9', height: '100%'}}>
      <Text style={{fontFamily: 'KameronRegular', fontSize: 30, color: 'black', textAlign: 'center', marginTop: 30}}>Welcome Back</Text>
      <Text style={{fontFamily: 'KameronRegular', fontSize: 20, color: 'black', marginTop: 20, marginHorizontal: 30}}>Lvl {goalsCompleted}</Text>
      <ProgressBar progress={averageProgress} color={'#C5C27C'} style={{marginTop: 10, marginHorizontal: 30, width: '80%'}} />
      <Statistics recordedTimeboxes={recordedTimeboxes} />
    </View>
  );
}