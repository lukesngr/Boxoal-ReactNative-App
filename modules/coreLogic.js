import { calculateRemainderTimeBetweenTwoDateTimes } from "./timeLogic";
import dayjs from "dayjs";

export function convertToDateTime(time, date) {
    let timeSeparated = time.split(":").map(function(num) { return parseInt(num); });
    let dateSeparated = date.split("/").map(function(num) { return parseInt(num); });
    let datetime = new Date();
    datetime.setHours(timeSeparated[0]);
    datetime.setMinutes(timeSeparated[1]);
    datetime.setDate(dateSeparated[0]);
    datetime.setMonth(dateSeparated[1]-1);
    datetime.setSeconds(0);
    datetime.setMilliseconds(0);
    return datetime;
}

export function convertToTimeAndDate(input) {
    let datetime = new Date(input);
    let hours = datetime.getHours();
    let minutes = datetime.getMinutes();
    let date = datetime.getDate();
    let month = datetime.getMonth()+1;

    if(minutes == 0) {
        minutes = "00";
    }

    return [hours+':'+minutes, date+'/'+month];
}

export function calculateMaxNumberOfBoxesAfterTimeIfEmpty(boxSizeUnit, boxSizeNumber, timeSeparated, wakeUpTimeSeparated) {

    let [timeHours, timeMinutes] = timeSeparated;
    let [wakeupTimeHours, wakeupTimeMinutes] = wakeUpTimeSeparated;

    if(boxSizeUnit == "min") {
        const minutesInOneDay = 24 * 60; //idk why but this works //update this works cause I stuffed up 24 hour time
        let maxNumberOfBoxes = Math.floor(minutesInOneDay / boxSizeNumber);

        //if time hours bigger than wakeup hour or time hours equals wakeup hours and time minutes bigger. basically if time ahead of wakeup
        if(timeHours > wakeupTimeHours || (timeHours == wakeupTimeHours && timeMinutes > wakeupTimeMinutes)) {  
            let boxesMadeUpOfHours = ((timeHours-wakeupTimeHours)*60) / boxSizeNumber;
            let boxesMadeUpOfMinutes = (timeMinutes-wakeupTimeMinutes) / boxSizeNumber;
            maxNumberOfBoxes -= boxesMadeUpOfHours;
            maxNumberOfBoxes -= boxesMadeUpOfMinutes;
        //if time hours smaller than wakeup hour or time hours equals wakeup hours and time minutes smaller. basically if time behind of wakeup
        }else if(timeHours < wakeupTimeHours || (timeHours == wakeupTimeHours && timeMinutes < wakeupTimeMinutes)){
            let boxesMadeUpOfHours = (timeHours*60) / boxSizeNumber; //from 00:00 to time hours
            let boxesMadeUpOfMinutes = timeMinutes / boxSizeNumber; //from 00:00 to time minutes
            boxesMadeUpOfHours += ((23-wakeupTimeHours)*60) / boxSizeNumber; //from wakeup time hours to 24:00
            boxesMadeUpOfHours += (wakeupTimeMinutes / boxSizeNumber);
            maxNumberOfBoxes -= boxesMadeUpOfHours;
            maxNumberOfBoxes -= boxesMadeUpOfMinutes;
        }

        if(!Number.isInteger(maxNumberOfBoxes)) {
            console.log("Minutes aren't divisible by boxSizeNumber, just gonna ignore");
            maxNumberOfBoxes = Math.round(maxNumberOfBoxes);
        }

        return maxNumberOfBoxes;
    }else if(boxSizeUnit == "hr") {
        let maxNumberOfBoxes = Math.floor(24 / boxSizeNumber);

        if(timeHours > wakeupTimeHours) {  
            let boxesMadeUpOfHours = (timeHours-wakeupTimeHours) / boxSizeNumber;
            maxNumberOfBoxes -= boxesMadeUpOfHours;
        }else if(timeHours < wakeupTimeHours){
            let boxesMadeUpOfHours = timeHours / boxSizeNumber; //from 00:00 to time hours
            boxesMadeUpOfHours += (24-wakeupTimeHours) / boxSizeNumber; //from wakeup time hours to 24:00
            maxNumberOfBoxes -= boxesMadeUpOfHours;
        }
        return maxNumberOfBoxes;
    }
}

export function calculateBoxesBetweenTwoDateTimes(dateTime1, dateTime2, boxSizeUnit, boxSizeNumber) {
    let numberOfBoxes = 0;

    if(boxSizeUnit == "min") {
        numberOfBoxes += Math.floor(((dateTime2.getHours() - dateTime1.getHours())*60) / boxSizeNumber);
        numberOfBoxes += Math.floor((dateTime2.getMinutes() - dateTime1.getMinutes()) / boxSizeNumber);
    }else if(boxSizeUnit == "hr") {
        numberOfBoxes += Math.floor((dateTime2.getHours() - dateTime1.getHours()) / boxSizeNumber);
    }

    if(dateTime1 > dateTime2) {
        return -numberOfBoxes;
    }else{
        return numberOfBoxes;
    }
}

export function calculateMaxNumberOfBoxes(wakeupTime, boxSizeUnit, boxSizeNumber, timeboxes, time, date) {
    let wakeUpTimeSeparated = wakeupTime.split(":").map(function(num) { return parseInt(num); });
    let timeSeparated = time.split(":").map(function(num) { return parseInt(num); });
    let currentDateTime = convertToDateTime(time, date);
    let maxNumberOfBoxes = 0;

    for(let i = 0; i < timeboxes.length; i++) { //for each time box
        let timeboxStartTimeInDateTime = new Date(timeboxes[i].startTime);

        if(currentDateTime < timeboxStartTimeInDateTime) { //if timebox occurs after the time of a timebox
            maxNumberOfBoxes = calculateBoxesBetweenTwoDateTimes(currentDateTime, timeboxStartTimeInDateTime, boxSizeUnit, boxSizeNumber);
            i = timeboxes.length;
        }else{
            i++;
        }
    }

    if(maxNumberOfBoxes <= 0) {
        maxNumberOfBoxes = calculateMaxNumberOfBoxesAfterTimeIfEmpty(boxSizeUnit, boxSizeNumber, timeSeparated, wakeUpTimeSeparated);
    }

    return maxNumberOfBoxes;
}

export function addBoxesToTime(boxSizeUnit, boxSizeNumber, time, numberOfBoxes) {
    let [timeHours, timeMinutes] = time.split(":").map(function(num) { return parseInt(num); });
    let endHours = timeHours;
    let endMinutes = timeMinutes;

    if(boxSizeUnit == "min") {
        for(let i = 0; i < numberOfBoxes; i++) {
            endMinutes += boxSizeNumber;

            if(endMinutes >= 60) {
                if(endHours == 23) {
                    endHours = 0;
                }else{
                    endHours += 1;
                }
                endMinutes -= 60;
            }
        }
    }else if(boxSizeUnit == "hr") {
        endHours += numberOfBoxes * boxSizeNumber;
        if(endHours > 24) {
            endHours = endHours - 24;
        }
    }

    return `${endHours}:${endMinutes < 10 ? '0' : ''}${endMinutes}`;
}

export function calculatePixelsFromTopOfGridBasedOnTime(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions, time) {

    if(overlayDimensions == 0 ) { //hasn't been set yet
        return 0;
    }

    const pixelsPerBox = overlayDimensions[2];

    let wakeupDateTime = convertToDateTime(wakeupTime, time.getDate()+"/"+time.getMonth());

    let boxesBetween = calculateBoxesBetweenTwoDateTimes(wakeupDateTime, time, boxSizeUnit, boxSizeNumber);
    let remainderTime = calculateRemainderTimeBetweenTwoDateTimes(wakeupDateTime, time, boxSizeUnit, boxSizeNumber);

    if(remainderTime < 0) { //if negative remainder e.g. time is behind number of boxes
        remainderTime = boxSizeNumber + remainderTime; 
    }
    
    const justBoxesHeight = pixelsPerBox * boxesBetween;
    const inBetweenHeight = (pixelsPerBox / boxSizeNumber) * remainderTime;
    
    return justBoxesHeight+inBetweenHeight;
}

export function calculateOverlayHeightForNow(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions) {
    const currentDate = new Date();

    return calculatePixelsFromTopOfGridBasedOnTime(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions, currentDate);
}

export function calculateSizeOfRecordingOverlay(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions, originalOverlayHeight) {
    //could do much more math but choosing easy route
    console.log(overlayDimensions);
    let overlaysTotalHeight = calculateOverlayHeightForNow(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions);
    let recordingOverlayHeight = overlaysTotalHeight - originalOverlayHeight;
    return recordingOverlayHeight;
}


export function thereIsNoRecording(recordedBoxes, reoccuring, date, time) {
    if(recordedBoxes.length == 0) {
        return true;
    }else if(reoccuring != null) {
        if(reoccuring.reoccurFrequency == "daily") {
            let timeboxDateTime = convertToDateTime(time, date);
            let result = true
            recordedBoxes.forEach(element => {
                if(dayjs(timeboxDateTime).isSame(dayjs(element.recordedStartTime), 'date')) {
                    result = false;
                    
                }
            });
            return result;
        }
    }
    return false;
}

export function generateTimeBoxGrid(schedule, selectedDate) {
    let timeBoxGrid = {};

    schedule.timeboxes.forEach(function (element) { //for each timebox
        const [time, date] = convertToTimeAndDate(element.startTime); //convert the datetime to a time and date e.g. format hh:mm dd/mm
        console.log(time, date);
        if(element.reoccuring != null) {
            if(element.reoccuring.reoccurFrequency === "daily") {
                for(let i = 0; i < 7; i++) {
                    let currentDate = dayjs(selectedDate).day(i).format('D/M');
                    if (!Object.hasOwn(timeBoxGrid, currentDate)) { timeBoxGrid.currentDate = {}; } //if date key not in map than set empty map to date key
                    timeBoxGrid[currentDate] = {time: element}; //lookup date key and set the map inside it to key of time with value of the element itself
                }
            }else if(element.reoccuring.reoccurFrequency === "weekly") {
                let currentDate = dayjs(selectedDate).day(element.reoccuring.weeklyDay).format('D/M');
                if (!Object.hasOwn(timeBoxGrid, currentDate)) { timeBoxGrid.currentDate = {}; } //if date key not in map than set empty map to date key
                timeBoxGrid[currentDate] = {time: element}; //lookup date key and set the map inside it to key of time with value of the element itself
            }
        }else{
            if(!Object.hasOwn(timeBoxGrid, date)) { timeBoxGrid.date = {}; } //if date key not in map than set empty map to date key
            timeBoxGrid[date] = {time: element}; //lookup date key and set the map inside it to key of time with value of the element itself
        }
    });

    return timeBoxGrid
}

export function getHeightForBoxes(numberOfBoxes) { return `calc(${(numberOfBoxes * 100)}% + ${(numberOfBoxes - 1) * 2}px)` }

    