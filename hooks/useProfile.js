import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getProgressAndLevel } from "../modules/coreLogic";
export function useProfile(user, dispatch) {
    if(user !== undefined && user.userId !== undefined) {
        const {status, data, error, refetch} = useQuery({
            queryKey: ["XP"], 
            queryFn: async () => {
                const response = await axios.get(serverIP+"/getProfile", { params: {userUUID: userID}});
                return response.data;
            },
            enabled: true
        })

        if(data !== undefined) {
            let {points, boxSizeUnit, boxSizeNumber, wakeupTime, scheduleID} = data;
            let {progress, level} = getProgressAndLevel(points);
            dispatch({type: 'profile/set', payload: {scheduleID, boxSizeUnit, boxSizeNumber, wakeupTime, progress, level}});
        }
    }
    return;
}