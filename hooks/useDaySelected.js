import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getCurrentDay } from "../../modules/dateLogic";

export function useDaySelected() {
    let currentDay = getCurrentDay();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({type: 'daySelected/set', payload: currentDay});
    }, []);

}