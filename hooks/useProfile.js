import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getProgressAndLevel } from "../modules/coreLogic";
export function useProfile( dispatch) {
        const {status, data, error, refetch} = useQuery({
            queryKey: ["XP"], 
            queryFn: async () => {
                const response = await axios.get(serverIP+"/getProfile", { params: {userUUID: userID}});
                return response.data;
            },
            enabled: true
        })

        if(data !== undefined) {
            let {boxSizeUnit, boxSizeNumber, wakeupTime, scheduleID} = data;
            dispatch({type: 'profile/set', payload: {scheduleID, boxSizeUnit, boxSizeNumber, wakeupTime}});
        }
    return;
}