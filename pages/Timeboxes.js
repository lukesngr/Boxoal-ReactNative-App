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

export default function Timeboxes(props) {

  return (
    <>
      <TimeboxHeading />
      <TimeboxGrid data={props.data}></TimeboxGrid>
    </>
  )
  
}