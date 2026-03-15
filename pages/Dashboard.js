import { View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Statistics } from "../components/Statistics";
import {IconButton} from 'react-native-paper';
import { signOut } from "aws-amplify/auth";

export function Dashboard({navigation, data}) {

  const {scheduleIndex} = useSelector(state => state.profile.value);
  let goalsCompleted = 0;
  let recordedTimeboxes = [];
  let timeboxes = [];

  if(data.length != 0) {
    let dataForSchedule = data[scheduleIndex]
    recordedTimeboxes = dataForSchedule.recordedTimeboxes;
    timeboxes = dataForSchedule.timeboxes;
  }

  async function logout() {
    await signOut();
    navigation.navigate('Login');
  }

  return (
    <View style={{backgroundColor: '#D9D9D9', height: '100%'}}>
      <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30}}> 
        <Text style={{fontFamily: 'KameronRegular', fontSize: 30, color: 'black', textAlign: 'center' }}>Welcome Back</Text>
        <IconButton icon="logout" size={40} onPress={() => logout}></IconButton>
      </View>
      <Statistics timeboxes={timeboxes} recordedTimeboxes={recordedTimeboxes} />
    </View>
  );
}
