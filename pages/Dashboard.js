import { View, Text } from "react-native";
import { ProgressBar } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import serverIP from "../modules/serverIP";
import { getProgressAndLevel } from "../modules/coreLogic";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Statistics } from "../components/Statistics";
export function Dashboard(props) {

  const {scheduleIndex} = useSelector(state => state.profile.value);
  let userID = props.userID;
  let recordedTimeboxes = props.data[scheduleIndex].recordedTimeboxes;
  const {status, data, error, refetch} = useQuery({
    queryKey: ["XP"], 
    queryFn: async () => {
        const response = await axios.get(serverIP+"/getExperience", { params: {userUUID: userID}});
        return response.data;
    },
    enabled: true
  })
  let currentLevel = 1;
  let currentProgress = 0;

  if(data !== undefined) {
    let {progress, level} = getProgressAndLevel(data.points);
    currentLevel = level;
    currentProgress = progress;
  }

  return (
    <View style={{backgroundColor: '#D9D9D9', height: '100%'}}>
      <Text style={{fontFamily: 'KameronRegular', fontSize: 30, color: 'black', textAlign: 'center', marginTop: 30}}>Welcome Back</Text>
      <Text style={{fontFamily: 'KameronRegular', fontSize: 20, color: 'black', marginTop: 20, marginHorizontal: 30}}>Lvl {currentLevel}</Text>
      <ProgressBar progress={currentProgress} color={'#C5C27C'} style={{marginTop: 10, marginHorizontal: 30, width: '80%'}} />
      <Statistics recordedTimeboxes={recordedTimeboxes} />
    </View>
  );
}