import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ScheduleAccordion from "../components/schedules/ScheduleAccordion";
import { Text } from "react-native";

export default function Schedules() {
    const username = useSelector(state => state.username.value);
    const selectedDate = useSelector(state => state.selectedDate.value);
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

    if(status === 'pending') return <Loading />

    return (
        <>
            <Text style={{fontSize: 28, color: 'black', textAlign: 'center', marginTop: 4}}>My Schedules</Text>
            <ScheduleAccordion data={data}></ScheduleAccordion>
        </>
    )
}