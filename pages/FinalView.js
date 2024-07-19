import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Schedules from './Schedules';
import Timeboxes from './Timeboxes';
import Areas from './Areas';
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "../components/Loading";
import { Text } from "react-native";
import serverIP from '../modules/serverIP';
import CreateScheduleForm from '../components/schedules/CreateScheduleForm';
import Welcome from '../components/Welcome';
import { initialNotificationSetup, recordIfNotificationPressed, setUserNameUsingGithubAccessCode } from '../modules/coreLogic';
import { useEffect } from 'react';

const Tab = createBottomTabNavigator();

export default function FinalView({ navigation, route }) {
    const dispatch = useDispatch();
    const username = useSelector(state => state.username.value);
    const selectedDate = useSelector(state => state.selectedDate.value);
    const timeboxRecording = useSelector(state => state.timeboxRecording.value);

    let startOfWeek = dayjs(selectedDate).startOf('week').hour(0).minute(0).toDate();
    let endOfWeek = dayjs(selectedDate).endOf('week').add(1, 'day').hour(23).minute(59).toDate(); //another day as sometimes timeboxes will go into next week
    const {status, data, error, refetch} = useQuery({
        queryKey: ["schedule", selectedDate], 
        queryFn: async () => {
            const response = await axios.get(serverIP+"/getSchedules", { params: {userEmail: username, startOfWeek, endOfWeek}, headers: { 'Origin': 'http://localhost:3000' }});
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
            setUserNameUsingGithubAccessCode(dispatch, route.params);
        }
    }, [route.params]);

    
    

    if(status === 'pending') return <Loading />
    if(status === 'error') return <Text>Error: {error.message}</Text>
    if(data.length == 0) return <Welcome />
    
    return (
          <Tab.Navigator>
            <Tab.Screen name="Timeboxes" children={() => <Timeboxes data={data}></Timeboxes>} 
            options={{headerShown: false}}/>
            <Tab.Screen name="Schedules" children={() => <Schedules data={data}></Schedules>} 
            options={{headerShown: false}}/>
            <Tab.Screen name="Settings" component={Areas} 
            options={{headerShown: false}}/>
          </Tab.Navigator>
    )
}