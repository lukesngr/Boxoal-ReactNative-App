import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

export default function useOverlayDimensions(gridHeight, headerHeight, headerWidth) {
    const dispatch = useDispatch();

    function calculateOverlayDimensions() {
        if (gridHeight != 0 && headerHeight != 0 && headerWidth != 0) { 
            const overlayHeight = gridHeight - headerHeight; //overlay is under headers but goes till end of grid
            console.log(gridHeight, headerHeight)

            dispatch({type: 'overlayDimensions/set', payload: [headerWidth, overlayHeight, 30]});
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