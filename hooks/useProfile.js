import { useQuery } from "react-query";
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
        let {progress, level} = getProgressAndLevel(data.points);
        let {points, boxSizeUnit, boxSizeNumber, wakeupTime} = data;
        dispatch({type: 'profile/set', payload: {id: userID, boxSizeUnit, boxSizeNumber, wakeupTime, progress, level}});
    }
}