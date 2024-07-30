import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ScheduleAccordion from "../components/schedules/ScheduleAccordion";
import { Text } from "react-native";
import Loading from "../components/Loading";

export default function Goals(props) {

    return (
        <>
            <Text style={{fontSize: 28, color: 'black', textAlign: 'left', marginTop: 4, paddingLeft: 10}}>Goals</Text>
            <ScheduleAccordion data={props.data}></ScheduleAccordion>
        </>
    )
}