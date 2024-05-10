import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { calculateMaxNumberOfBoxesAfterTimeIfEmpty } from "../modules/coreLogic";
import { useSelector } from "react-redux";

export default function useOverlayDimensions(headerHeight, headerWidth) {
    const dispatch = useDispatch();
    const {boxSizeUnit, boxSizeNumber, wakeupTime} = useSelector(state => state.scheduleEssentials.value); 

    function calculateOverlayDimensions() {
        if (headerHeight != 0 && headerWidth != 0) {
            
            let overlayHeight = 0;
            if(boxSizeUnit == 'min') {
                overlayHeight = Math.floor(24*60 / boxSizeNumber) * 30;
            }else if(boxSizeUnit == 'hr') {
                overlayHeight = Math.floor(24 / boxSizeNumber) * 30;
            }

            dispatch({type: 'overlayDimensions/set', payload: [headerWidth, overlayHeight, 30, headerHeight]});
        }
        
    };

    //when page first loads calculate overlay dimensions
    useEffect(() => {
        calculateOverlayDimensions();
    }, []);

    useEffect(() => {
        calculateOverlayDimensions();
    }, [headerHeight, headerWidth]);

    return;
}