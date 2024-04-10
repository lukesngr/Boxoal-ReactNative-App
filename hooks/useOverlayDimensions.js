import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { calculateMaxNumberOfBoxesAfterTimeIfEmpty } from "../modules/coreLogic";

export default function useOverlayDimensions(gridHeight, headerHeight, headerWidth) {
    const dispatch = useDispatch();
    const [boxSizeUnit, boxSizeNumber, wakeupTime] = useSelector(state => state.scheduleEssentials.value); 

    function calculateOverlayDimensions() {
        if (gridHeight != 0 && headerHeight != 0 && headerWidth != 0) { 
            const overlayHeight = calculateMaxNumberOfBoxesAfterTimeIfEmpty(wakeupTime, boxSizeUnit, boxSizeNumber)*30;
            console.log(gridHeight, headerHeight)
            

            dispatch({type: 'overlayDimensions/set', payload: [headerWidth, overlayHeight, 30, headerHeight]});
        }
    };

    //when page first loads calculate overlay dimensions
    useEffect(() => {
        calculateOverlayDimensions();
    }, []);

    useEffect(() => {
        calculateOverlayDimensions();
    }, [gridHeight, headerHeight, headerWidth]);

    return;
}