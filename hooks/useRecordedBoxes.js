import { useSelector } from "react-redux";
import { useEffect } from "react";
import { calculatePixelsFromTopOfGridBasedOnTime } from "../modules/coreLogic";
import dayjs from "dayjs";

export default function useRecordedBoxes(filteredRecordings) {
    const {wakeupTime, boxSizeUnit, boxSizeNumber} = useSelector(state => state.scheduleEssentials.value);
    const overlayDimensions = useSelector(state => state.overlayDimensions.value);
    let recordingBoxes = [];
    useEffect(() => {
        if(filteredRecordings.length > 0) {
            filteredRecordings.forEach(element => {
                let pixelsToRecordingStart = calculatePixelsFromTopOfGridBasedOnTime(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions, dayjs(element.recordedStartTime));
                let pixelsToRecordingEnd = calculatePixelsFromTopOfGridBasedOnTime(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions, dayjs(element.recordedEndTime)); 
                let marginToRecording = pixelsToRecordingStart+overlayDimensions.headerHeight;
                let recordingBoxHeight = pixelsToRecordingEnd-marginToRecording;
                let availableSpace = (overlayDimensions.overlayHeight-marginToRecording);
                let biggerThanAvailableSpace = recordingBoxHeight > availableSpace;

                //error handling
                if(heightForBox < overlayDimensions.timeboxHeight) {
                    heightForBox = overlayDimensions.timeboxHeight;
                }else if(biggerThanAvailableSpace) { 
                    heightForBox = availableSpace;
                }

                let eitherIsNotZero = !(marginToRecording == 0 || recordingBoxHeight == 0); //due to overlay dimensions not being set at right time
                let notAlreadyInCache = !recordingBoxes.some(item => item.id === element.id); //if not already in cache

                if(eitherIsNotZero && notAlreadyInCache) { //if not already in malleableBoxes push it to it
                    recordingBoxes.push({timeBox: element.timeBox, id: element.id, recordingBoxHeight, marginToRecording, title: element.timeBox.title});
                }
            });
        }
        
    }, [filteredRecordings]);
    return recordingBoxes;
}