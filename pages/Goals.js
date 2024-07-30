import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ScheduleAccordion from "../components/schedules/ScheduleAccordion";
import { Text } from "react-native";
import Loading from "../components/Loading";
import { View } from "react-native";
import { IconButton } from "react-native-paper";

export default function Goals(props) {

    return (
        <View style={{backgroundColor: '#D9D9D9', width: '100%', height: '100%', padding: 20, paddingLeft: 15, paddingRight: 15}}>
            <View style={{backgroundColor: 'white', width: '100%', height: '100%'}}>
                <Text style={{fontFamily: 'KameronRegular', fontSize: 35, color: 'black', textAlign: 'left', marginTop: 10, paddingLeft: 40}}>Goals</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 30}}> 
                    <Text style={{fontSize: 25, color: 'black', textAlign: 'left', marginTop: 5, marginRight: 80}}> Timeboxes</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: -25}}>
                        <IconButton icon="cog" size={36}></IconButton>
                        <IconButton icon="plus" size={36}></IconButton>
                    </View>
                </View>
            </View>
        </View>
    )
}