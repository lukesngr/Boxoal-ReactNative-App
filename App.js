import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from './pages/SplashScreen';
import { Text } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Timeboxes from './pages/Timeboxes';

const Stack = createNativeStackNavigator();

export const linking = {
  prefixes: ['boxoal://'],
  config: {
    initialRouteName: 'SplashScreen',
    screens: {
      Login: {
        path: 'login/:accessToken'
      }
    },
  }
};


export function Login({ navigation, route }) {
  const { accessToken } = route.params;
  axios.get('https://api.github.com/user/emails', {
    headers: {
      Authorization: `token ${accessToken}`
    }
  }).then(response => {
      return AsyncStorage.setItem(
        'username',
        response.data[0].email,
      );
      navigation.navigate('SplashScreen')
  }).catch(err => {
    console.log(err);
  });
  return <><Text>Login Successful!</Text></>
}

export default function App() {
  return (<NavigationContainer linking={linking} fallback={<Text>Loading</Text>}>
      <Stack.Navigator>
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={ {headerShown: false} }
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen
          name="Timeboxes"
          component={Timeboxes}
          options={{headerShown: false}}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}