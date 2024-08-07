import { useSelector } from "react-redux";

export default function useRecordedBoxes(filteredRecordings) {
    const {wakeupTime, boxSizeUnit, boxSizeNumber} = useSelector(state => state.scheduleEssentials.value);
    const {timeboxHeight, overlayHeight, headerHeight} = useSelector(state => state.overlayDimensions.value);
    let recordingBoxes = [];
    useEffect(() => {
        if(filteredRecordings.length > 0) {
            filteredRecordings.forEach(element => {
                
                let pixelsToRecordingStart = calculatePixelsFromTopOfGridBasedOnTime(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions, dayjs(element.recordedStartTime));
                let pixelsToRecordingEnd = calculatePixelsFromTopOfGridBasedOnTime(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions, dayjs(element.recordedEndTime)) 
                let marginToRecording = pixelsToRecordingStart+headerHeight;
                let recordingBoxHeight = pixelsToRecordingEnd-marginToRecording;
                let availableSpace = (overlayHeight-marginToRecording);
                let biggerThanAvailableSpace = recordingBoxHeight > availableSpace;

                //error handling
                if(heightForBox < timeboxHeight) {
                    heightForBox = timeboxHeight;
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