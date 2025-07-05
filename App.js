import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from './pages/SplashScreen';
import FinalView from './pages/FinalView';
import { Provider } from 'react-redux';
import {store, persistor} from './redux/store';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { PersistGate } from 'redux-persist/integration/react';
import Loading from './components/Loading.js';
import { Login } from './components/login/Login.js';
import { ResetPassword } from './components/login/ResetPassword.js';
import { SignUp } from './components/login/SignUp.js';
import { configureAmplify } from './modules/awsConfig';
import { PaperProvider, MD3LightTheme  } from 'react-native-paper';
import { Authenticator } from '@aws-amplify/ui-react-native';
import { queryClient } from './modules/queryClient.js';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://902123d7102e3995a2a1ee5418959618@o4509511383842816.ingest.us.sentry.io/4509612901531648',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});
configureAmplify();

const Stack = createNativeStackNavigator();


export let theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#875F9A',
    secondary: '#875F9A',
    background: '#FFFFFF',
    secondaryContainer: '#D9D9D9',
    onSecondaryContainer: '#1D1B20',
  },
  roundness: 0
};

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#875F9A',
  },
};

export const linking = {
  prefixes: ['boxoal://'],
  config: {
    initialRouteName: 'SplashScreen',
    screens: {
      FinalView: { //this is a hack but other ways are far too complex
        path: 'stopRecording/:timeboxID/:scheduleID/:recordingStartTime'
      }
    }, 
  }
};

export default Sentry.wrap(function App() {
  return (
    <Authenticator.Provider>
    <PaperProvider theme={theme}>
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
                name="Login"
                component={Login}
                options={ {headerShown: false} }
              />
              <Stack.Screen
                name="ResetPassword"
                component={ResetPassword}
                options={ {headerShown: false} }
              />
              <Stack.Screen
                name="SignUp"
                component={SignUp}
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
    </PaperProvider>
    </Authenticator.Provider>
  );
});