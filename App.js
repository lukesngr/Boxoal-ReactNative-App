import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from './pages/SplashScreen';
import { Text } from 'react-native';

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
  console.log(route);
  const { accessToken } = route.params;
  console.log(accessToken);
  return <><Text>hello</Text></>
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
        component={Login}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}