import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from './pages/SplashScreen';
import FinalView from './pages/FinalView';
import { Provider } from 'react-redux';
import {store, persistor} from './redux/store';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { PersistGate } from 'redux-persist/integration/react';
import Loading from './components/Loading.js';

const Stack = createNativeStackNavigator();
export const queryClient = new QueryClient();

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
      FinalView: {
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
        <PersistGate persistor={persistor} loading={<Loading></Loading>}>
          <NavigationContainer theme={MyTheme} linking={linking} fallback={<Loading></Loading>}>
            <Stack.Navigator>
              <Stack.Screen
                name="SplashScreen"
                component={SplashScreen}
                options={ {headerShown: false} }
              />
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