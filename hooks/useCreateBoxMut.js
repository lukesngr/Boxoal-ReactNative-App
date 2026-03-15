import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../modules/queryClient";
import serverIP from "../modules/serverIP";

export default function useCreateBoxMut(goalSelected, closeModal) {
  const dispatch = useDispatch();
  const {scheduleIndex} = useSelector(state => state.profile.value);
  return useMutation({
        mutationFn: (timeboxData) => axios.post(serverIP+'/createTimebox', timeboxData),
        onMutate: async (timeboxData) => {
            await queryClient.cancelQueries(['schedule']); 
            
            const previousSchedule = queryClient.getQueryData(['schedule']);
            
            queryClient.setQueryData(['schedule'], (old) => {
                if (!old) return old;
                let copyOfOld = JSON.parse(JSON.stringify(old));
                copyOfOld[scheduleIndex].timeboxes.push({...timeboxData, recordedTimeBoxes: []});
                if(!(timeboxData.isTimeblock)) {
                    const goalIndex = copyOfOld[scheduleIndex].goals.findIndex(element => element.id == Number(goalSelected));
                    copyOfOld[scheduleIndex].goals[goalIndex].timeboxes.push({...timeboxData})
                }
		if(Object.hasOwn(timeboxData, 'recordedTimeBox')) {
		  copyOfOld[scheduleIndex].recordedTimeboxes.push({...timeboxData.recordedTimeBox, timeBox: timeboxData});
		}                
		return copyOfOld;
            });
            
            
            return { previousSchedule };
        },
        onSuccess: () => {
            dispatch({type: 'alert/set', payload: {
                open: true,
                title: "Timebox",
                message: "Added timebox!"
            }});
            queryClient.invalidateQueries(['schedule']); // Refetch to get real data
            closeModal();
        },
        onError: (error, context) => {
            queryClient.setQueryData(['schedule'], context.previousSchedule);
            console.log(error)
            dispatch({type: 'alert/set', payload: { open: true, title: "Error", message: "An error occurred, please try again or contact the developer" }});
            queryClient.invalidateQueries(['schedule']);
            closeModal();
        }
    });
}
