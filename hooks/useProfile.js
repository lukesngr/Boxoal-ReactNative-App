import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getProgressAndLevel } from "../modules/coreLogic";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import serverIP from "../modules/serverIP";
export function useProfile(userId, dispatch) {
    
    const {status, data, error, refetch} = useQuery({
        queryKey: ["XP"], 
        queryFn: async () => {
            const response = await axios.get(serverIP+"/getProfile", { params: {userUUID: userId}});
            return response.data;
        },
        enabled: true
    })

    useEffect(() => {
        if(data !== undefined) {
            let {boxSizeUnit, boxSizeNumber, wakeupTime, scheduleID, goalLimit, scheduleIndex} = data;
            dispatch({type: 'profile/set', payload: {scheduleID, scheduleIndex, boxSizeUnit, boxSizeNumber, wakeupTime, goalLimit}});
        }else{
            console.log(data, userId)
            dispatch({type: 'profile/set', payload: {scheduleID: 0, scheduleIndex: 0, boxSizeUnit: 'min', boxSizeNumber: 30, wakeupTime: '07:00', goalLimit: -1}});
        }
    }, [data]);
    
    return;
}