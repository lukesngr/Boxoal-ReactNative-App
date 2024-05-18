import { useState, useEffect, useRef } from 'react';
import { calculateOverlayHeightForNow } from '../modules/coreLogic';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { resetActiveOverlayInterval, setActiveOverlayInterval } from '../redux/activeOverlayInterval';

export default function useActiveOverlay(schedule) {

    const timeboxRecording = useSelector(state => state.timeboxRecording.value);
    const overlayDimensions = useSelector(state => state.overlayDimensions.value);
    const dispatch = useDispatch();

    useEffect(() => {
        if(timeboxRecording[0] == -1) {
            dispatch({type:"activeOverlayHeight/set", payload: calculateOverlayHeightForNow(schedule.wakeupTime, schedule.boxSizeUnit, schedule.boxSizeNumber, overlayDimensions)});
            dispatch(setActiveOverlayInterval());
            console.log(calculateOverlayHeightForNow(schedule.wakeupTime, schedule.boxSizeUnit, schedule.boxSizeNumber, overlayDimensions));
        }
        
        return () => { dispatch(resetActiveOverlayInterval()); };
    }, [overlayDimensions])

    useEffect(() => {
        if(timeboxRecording[0] == -1) {
            dispatch({type:"activeOverlayHeight/set", payload: calculateOverlayHeightForNow(schedule.wakeupTime, schedule.boxSizeUnit, schedule.boxSizeNumber, overlayDimensions)});
            dispatch(setActiveOverlayInterval());
            console.log(calculateOverlayHeightForNow(schedule.wakeupTime, schedule.boxSizeUnit, schedule.boxSizeNumber, overlayDimensions));
        }
        
        return () => { dispatch(resetActiveOverlayInterval()); };
    }, [])

    return;
}