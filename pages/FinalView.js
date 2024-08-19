import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import Goals from './Goals';
import Timeboxes from './Timeboxes';
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "../components/Loading";
import { Text } from "react-native";
import serverIP from '../modules/serverIP';
import Welcome from '../components/Welcome';
import { initialNotificationSetup, recordIfNotificationPressed} from '../modules/coreLogic';
import { useEffect } from 'react';
import { MD3LightTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dashboard } from './Dashboard';
import { useAuthenticator } from '@aws-amplify/ui-react-native';

let theme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: '#C5C27C',
      secondary: '#C5C27C',
      background: '#FFFFFF',
      secondaryContainer: '#D4D28F',
      elevation: {...MD3LightTheme.colors.elevation, 'level2': '#FFFFFF'},
    },
  };

const Tab = createMaterialBottomTabNavigator();

export default function FinalView({ navigation, route }) {
    const dispatch = useDispatch();
    const { authStatus, user } = useAuthenticator();
    if(authStatus != 'authenticated') { navigation.navigate('Login'); }

    const selectedDate = useSelector(state => state.selectedDate.value);
    const {status, data, error, refetch} = useQuery({
        queryKey: ["schedule", selectedDate], 
        queryFn: async () => {
            const response = await axios.get(serverIP+"/getSchedules", { params: {
                userUUID: user.userId, 
                startOfWeek: dayjs(selectedDate).startOf('week').hour(0).minute(0).toDate(), 
                endOfWeek: dayjs(selectedDate).endOf('week').add(1, 'day').hour(23).minute(59).toDate()
            }});
            return response.data;
        },
        enabled: true
    })

    useEffect(() => {
        initialNotificationSetup().then();
    }, []);

    useEffect(() => {
        if(route.params != undefined) {
            recordIfNotificationPressed(dispatch, route.params);
        }
    }, [route.params]);

    if(status === 'pending') return <Loading />
    if(status === 'error') return <Text>Error: {error.message}</Text>
    if(data.length == 0) return <Welcome />
    
    return (
          <Tab.Navigator theme={theme}>
            <Tab.Screen 
                name="Dashboard" 
                component={Dashboard} 
                options={{headerShown: false, tabBarIcon: ({color}) => (
                    <MaterialCommunityIcons name="circle-outline" size={20} color='black' />
                )}}
            />
            <Tab.Screen 
                name="Timeboxes" 
                children={() => <Timeboxes navigation={navigation} data={data}></Timeboxes>} 
                options={{headerShown: false, tabBarIcon: ({color}) => (
                    <MaterialCommunityIcons name="checkbox-blank-outline" size={20} color='black' />
                )}}/>
            <Tab.Screen 
                name="Goals" 
                children={() => <Goals data={data}></Goals>} 
                options={{headerShown: false, tabBarIcon: ({color}) => (
                    <MaterialCommunityIcons name="menu" size={20} color='black' />
                )}}/>
            
          </Tab.Navigator>
    )
}