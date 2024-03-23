import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Schedules from './Schedules';
import Timeboxes from './Timeboxes';
import Areas from './Areas';

const Tab = createBottomTabNavigator();

export default function FinalView() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Timeboxes" component={Timeboxes} />
      <Tab.Screen name="Schedule" component={Schedules} />
      <Tab.Screen name="Areas" component={Areas} />
    </Tab.Navigator>
  )
}