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
import { initialNotificationSetup, recordIfNotificationPressed} from '../modules/sideEffects';
import { useEffect, useState } from 'react';
import { MD3LightTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dashboard } from './Dashboard';
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { useProfile } from '../hooks/useProfile';
import Auth from 'aws-amplify';
import { getCurrentUser } from 'aws-amplify/auth';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import Alert from '../components/Alert';

let theme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: '#styles.primaryColor',
      secondary: '#styles.primaryColor',
      background: '#FFFFFF',
      secondaryContainer: '#D4D28F',
      elevation: {...MD3LightTheme.colors.elevation, 'level2': '#FFFFFF'},
    },
  };

const Tab = createMaterialBottomTabNavigator();

function FinalViewSeperatedForFunctionality({userId, navigation, route, dispatch}) {
    useProfile(userId, dispatch);
    const {status, data, error, refetch} = useQuery({
        queryKey: ["schedule"], 
        queryFn: async () => {
            const response = await axios.get(serverIP+"/getSchedules", { params: {
                userUUID: userId
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
    if(status === 'error') return <Alert visible={true} close={() => {}} title="Error" message={"Please contact developer"}></Alert>
    if(data.length == 0) return <Welcome />
    
    
    return (
          <Tab.Navigator theme={theme}>
            <Tab.Screen 
                name="Dashboard" 
                children={() => <Dashboard data={data} userID={userId}></Dashboard>} 
                options={{headerShown: false, tabBarIcon: ({color}) => (
                    <MaterialCommunityIcons name="circle-outline" size={20} color='black' />
                )}}
            />
            <Tab.Screen 
                name="Timeboxes" 
                children={() => <Timeboxes navigation={navigation} data={data}></Timeboxes>} 
                options={{headerShown: false, tabBarIcon: ({color}) => (
                    <MaterialCommunityIcons testID='timeboxesTab' name="checkbox-blank-outline" size={20} color='black' />
                )}}/>
            <Tab.Screen 
                name="List" 
                children={() => <Goals data={data}></Goals>} 
                options={{headerShown: false, tabBarIcon: ({color}) => (
                    <MaterialCommunityIcons testID='goalTab' name="menu" size={20} color='black' />
                )}}/>
            
          </Tab.Navigator>
    )
}

export default function FinalView({ navigation, route }) {
    const dispatch = useDispatch();
    const [userId, setUserId] = useState(-1);
    async function getLoginInfo() { 
        try {
            let { userId } = await getCurrentUser();
            setUserId(userId);
        } catch(error) {
            console.log(error);
            navigation.navigate('Login');
        }
    }
    useEffect(()=> {
        getLoginInfo();
    }, []);

    if(userId != -1) {
        return <FinalViewSeperatedForFunctionality userId={userId} navigation={navigation} route={route} dispatch={dispatch}/>
    }
    return <></>
    
}