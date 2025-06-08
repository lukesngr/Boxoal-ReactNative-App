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
import { styles } from "../styles/styles";
import {IconButton} from 'react-native-paper';
import { signOut } from "aws-amplify/auth";

export function Dashboard({navigation, data}) {

  const {scheduleIndex} = useSelector(state => state.profile.value);
  let goalsCompleted = 0;
  let averageProgress = 0;
  let recordedTimeboxes = [];
  let timeboxes = [];

  if(data.length != 0) {
    let dataForSchedule = data[scheduleIndex]
    goalsCompleted = dataForSchedule.goals.reduce((count, item) => item.completed ? count + 1 : count, 0);
    
    for(let goal of dataForSchedule.goals) {
      if(!goal.completed) {
        averageProgress += getProgressWithGoal(goal.timeboxes);
      }
    }

    if(dataForSchedule.goals.length != 0) { averageProgress = averageProgress / dataForSchedule.goals.length; }
    recordedTimeboxes = dataForSchedule.recordedTimeboxes;
    timeboxes = dataForSchedule.timeboxes;
  }

  console.log(averageProgress)

  async function logout() {
    await signOut();
    props.navigation.navigate('Login');
  }

  return (
    <View style={{backgroundColor: '#D9D9D9', height: '100%'}}>
      <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30}}> 
        <Text style={{fontFamily: 'KameronRegular', fontSize: 30, color: 'black', textAlign: 'center' }}>Welcome Back</Text>
        <IconButton icon="logout" size={40} onPress={logout}></IconButton>
      </View>
      <Text style={{fontFamily: 'KameronRegular', fontSize: 20, color: 'black', marginTop: 20, marginHorizontal: 30}}>Lvl {goalsCompleted}</Text>
      <ProgressBar progress={averageProgress} theme={{ colors: { primary: styles.primaryColor, surfaceVariant: '#d1c2d8' } }} style={{marginTop: 10, marginHorizontal: 30, width: '80%'}} />
      <Statistics timeboxes={timeboxes} recordedTimeboxes={recordedTimeboxes} />
    </View>
  );
}