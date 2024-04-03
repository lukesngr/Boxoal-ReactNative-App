import { Text } from 'react-native';
import TimeboxHeading from '../components/timeboxes/TimeboxHeading';
import Loading from '../components/Loading';
import serverIP from '../modules/serverIP';
import TimeboxGrid from '../components/timeboxes/TimeboxGrid';
import { useContext, useEffect } from 'react';
import dayjs from 'dayjs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function Timeboxes() {
  const username = useSelector(state => state.username.value);
  const selectedDate = useSelector(state => state.selectedDate.value);
  let startOfWeek = dayjs(selectedDate).startOf('week').hour(0).minute(0).toDate();
  let endOfWeek = dayjs(selectedDate).endOf('week').add(1, 'day').hour(23).minute(59).toDate(); //another day as sometimes timeboxes will go into next week
  console.log(selectedDate, username);
  const {status, data, error, refetch} = useQuery({
    queryKey: ["schedule", selectedDate], 
    queryFn: async () => {
        const response = await axios.get(serverIP+"/getSchedules", { params: {userEmail: username, startOfWeek, endOfWeek}, headers: { 'Origin': 'http://localhost:3000' }});
        return response.data;
      },
    enabled: true})

    if(status === 'pending') return <Loading />
    console.log(data)

    return (
      <>
        <TimeboxHeading />
        <TimeboxGrid data={data}></TimeboxGrid>
      </>
      )
  
}