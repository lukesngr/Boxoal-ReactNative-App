import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from './pages/SplashScreen';
import FinalView from './pages/FinalView';
import { Provider } from 'react-redux';
import {store, persistor} from './redux/store';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { PersistGate } from 'redux-persist/integration/react';
import BackgroundHeadlessTask from './modules/BackgroundHeadlessTask.js';
import Login from './pages/Login';

const Stack = createNativeStackNavigator();
export const queryClient = new QueryClient();

import {AppRegistry} from 'react-native';
import Loading from './components/Loading.js';
import StopRecording from './pages/StopRecording.js';
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
      },
      FinalView: {
        path: 'stopRecording/:timeboxID/:scheduleID/:recordingStartTime'
      }
    },
  }
};




export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <NavigationContainer theme={MyTheme} linking={linking} fallback={<Loading></Loading>}>
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
              name="StopRecording"
              component={StopRecording}
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