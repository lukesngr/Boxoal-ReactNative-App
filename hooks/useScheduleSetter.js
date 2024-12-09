import { useDispatch } from "react-redux";
import { useEffect } from "react";

export function useScheduleSetter(schedule) {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({type: 'scheduleData/set', payload: {timeboxes: schedule.timeboxes, recordedTimeboxes: schedule.recordedTimeboxes, goals: schedule.goals}});
    }, []);

    useEffect(() => {
        dispatch({type: 'scheduleData/set', payload: {timeboxes: schedule.timeboxes, recordedTimeboxes: schedule.recordedTimeboxes, goals: schedule.goals}});
    }, [schedule]);
}