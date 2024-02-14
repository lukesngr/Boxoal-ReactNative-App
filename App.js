import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from './pages/SplashScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (<NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={ {headerShown: false} }
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}