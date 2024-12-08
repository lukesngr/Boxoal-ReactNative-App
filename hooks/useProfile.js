import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getProgressAndLevel } from "../modules/coreLogic";
export function useProfile(userID, dispatch) {
    const {status, data, error, refetch} = useQuery({
        queryKey: ["XP"], 
        queryFn: async () => {
            const response = await axios.get(serverIP+"/getProfile", { params: {userUUID: userID}});
            return response.data;
        },
        enabled: true
    })

    if(data !== undefined) {
        let {points, boxSizeUnit, boxSizeNumber, wakeupTime} = data;
        let {progress, level} = getProgressAndLevel(points);
        dispatch({type: 'profile/set', payload: {id: userID, boxSizeUnit, boxSizeNumber, wakeupTime, progress, level}});
    }
    return;
}