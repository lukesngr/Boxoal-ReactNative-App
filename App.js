import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from './pages/SplashScreen';
import { Text } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FinalView from './pages/FinalView';
import { Provider } from 'react-redux';
import {store, persistor} from './redux/store';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { PersistGate } from 'redux-persist/integration/react';
import BackgroundHeadlessTask from './modules/BackgroundHeadlessTask.js';

const Stack = createNativeStackNavigator();
export const queryClient = new QueryClient();

import {AppRegistry} from 'react-native';
AppRegistry.registerHeadlessTask('BackgroundHeadlessTask', () => BackgroundHeadlessTask);

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#7FFFD4',
  },
};

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
    AsyncStorage.setItem(
      'username',
      response.data[0].email,
    );
    console.log(response.data[0].email);
    navigation.navigate('SplashScreen')
  }).catch(err => {
    console.log(err);
  });
  return <><Text>Login Successful!</Text></>
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <NavigationContainer theme={MyTheme} linking={linking} fallback={<Text>Loading</Text>}>
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
                name="FinalView"
                component={FinalView}
                options={{headerShown: false}}></Stack.Screen>
            </Stack.Navigator>
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}