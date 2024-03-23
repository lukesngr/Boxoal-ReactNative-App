import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Schedules from './Schedules';
import Timeboxes from './Timeboxes';
import Areas from './Areas';
import { ScheduleContextProvider } from '../components/ScheduleContext';

const Tab = createBottomTabNavigator();

export default function FinalView() {
  return (
    <ScheduleContextProvider>
        <Tab.Navigator>
        <Tab.Screen name="Timeboxes" component={Timeboxes} 
        options={{headerShown: false}}/>
        <Tab.Screen name="Schedule" component={Schedules} 
        options={{headerShown: false}}/>
        <Tab.Screen name="Areas" component={Areas} 
        options={{headerShown: false}}/>
        </Tab.Navigator>
    </ScheduleContextProvider>
  )
}