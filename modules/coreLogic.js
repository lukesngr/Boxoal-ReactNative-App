import { calculateBoxesBetweenTwoTimes, calculateMaxNumberOfBoxes, calculateRemainderTimeBetweenTwoTimes } from "./boxCalculations";

import dayjs from "dayjs";
var isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isSameOrBefore)

export function convertToDayjs(time, date) {
    let timeSeparated = time.split(":").map(function(num) { return parseInt(num); });
    let dateSeparated = date.split("/").map(function(num) { return parseInt(num); });
    let dayjsInstance = dayjs().hour(timeSeparated[0]).minute(timeSeparated[1]).date(dateSeparated[0]).month(dateSeparated[1]-1).second(0).millisecond(0);
    return dayjsInstance;
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

    if(hours == 0) {
        hours = "00";
    }

    if(minutes < 10 && minutes != "00") {
        minutes = "0"+minutes;
    }

    if(hours < 10 && hours != "00") {
        hours = "0"+hours;
    }

    return [hours+':'+minutes, date+'/'+month];
}

export function calculatePixelsFromTopOfGridBasedOnTime(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions, time) {

    if(overlayDimensions.headerWidth == 0 ) { //hasn't been set yet
        return 0;
    }

    const pixelsPerBox = overlayDimensions.timeboxHeight;

    let wakeupDateTime = time.hour(wakeupTime.split(":")[0]).minute(wakeupTime.split(":")[1]);

    if(time.isBefore(wakeupDateTime)) {
        wakeupDateTime = wakeupDateTime.subtract(1, 'day');
    }

    let boxesBetween = calculateBoxesBetweenTwoTimes(wakeupDateTime, time, boxSizeUnit, boxSizeNumber);
    let remainderTime = calculateRemainderTimeBetweenTwoTimes(wakeupDateTime, time, boxSizeUnit, boxSizeNumber);

    if(remainderTime < 0) { //if negative remainder e.g. time is behind number of boxes
        remainderTime = boxSizeNumber + remainderTime; //if remainder is negative then u need to get the minutes that are left
    }
    
    const justBoxesHeight = pixelsPerBox * boxesBetween;
    const inBetweenHeight = (pixelsPerBox / boxSizeNumber) * remainderTime;

    return justBoxesHeight+inBetweenHeight;
}

export function calculateOverlayHeightForNow(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions) {
    const currentDate = dayjs();

    return calculatePixelsFromTopOfGridBasedOnTime(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions, currentDate);
}

export function calculateSizeOfRecordingOverlay(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions, originalOverlayHeight, day, recordedStartTime) {
    //could do much more math but choosing easy route
    const currentDate = dayjs();
    let recordedStartDate = dayjs(recordedStartTime);
    if(recordedStartDate.isBefore(currentDate, 'date')) {
        if(day.date < currentDate.date()) {
            return [overlayDimensions.overlayHeight, overlayDimensions.headerHeight];
        }else if(day.date == currentDate.date()) {
            let overlayTotalHeight = calculatePixelsFromTopOfGridBasedOnTime(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions, currentDate)
            return [overlayTotalHeight, overlayDimensions.headerHeight];
        }else if(day.date > currentDate.date()){
            return [0, 0];
        }
    }else if(recordedStartDate.isSame(currentDate, 'date')) {
        let overlaysTotalHeight = calculatePixelsFromTopOfGridBasedOnTime(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions, currentDate);
        let recordingOverlayHeight = overlaysTotalHeight - originalOverlayHeight;
        return [recordingOverlayHeight, originalOverlayHeight+overlayDimensions.headerHeight];
    }
}


export function thereIsNoRecording(recordedBoxes, reoccuring, date, time) {
    if(recordedBoxes.length == 0) {
        return true;
    }else if(reoccuring != null) {
        if(reoccuring.reoccurFrequency == "daily") {
            let timeboxTime = convertToDayjs(time, date);
            let result = true
            recordedBoxes.forEach(element => {
                if(timeboxTime.isSame(dayjs(element.recordedStartTime), 'date')) {
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
        if(element.reoccuring != null) {
            if(element.reoccuring.reoccurFrequency === "daily") {
                for(let i = 0; i < 7; i++) {
                    let currentDate = dayjs(selectedDate).day(i).format('D/M');
                    if (!Object.hasOwn(timeBoxGrid, currentDate)) { timeBoxGrid[currentDate] = {}; } //if date key not in map than set empty map to date key
                    timeBoxGrid[currentDate][time] = element; //lookup date key and set the map inside it to key of time with value of the element itself
                }
            }else if(element.reoccuring.reoccurFrequency === "weekly") {
                let currentDate = dayjs(selectedDate).day(element.reoccuring.weeklyDay).format('D/M');
                if (!Object.hasOwn(timeBoxGrid, currentDate)) { timeBoxGrid[currentDate] = {}; } //if date key not in map than set empty map to date key
                timeBoxGrid[currentDate][time] = element; //lookup date key and set the map inside it to key of time with value of the element itself
            }
        }else{
            if(!Object.hasOwn(timeBoxGrid, date)) { timeBoxGrid[date] = {}; } //if date key not in map than set empty map to date key
            timeBoxGrid[date][time] = element; //lookup date key and set the map inside it to key of time with value of the element itself
        }
    });

    return timeBoxGrid
}



export function getProgressWithGoal(timeboxes) {
    let percentage = 0.0;

    if(timeboxes.length == 0) {
        percentage = 100.0;
    }

    timeboxes.forEach(element => {
        if(element.recordedTimeBoxes.length > 0) {
            if(element.goalPercentage == 0) {
                percentage += (1/timeboxes.length);
            }else{
                percentage += element.goalPercentage;
            }
        }
    });

    return Math.round(percentage);
}

export function getDateWithSuffix(date) {
    if (date > 3 && date < 21) {
        return `${date}th`
    };

    switch (date % 10) {
      case 1: return `${date}st`;
      case 2: return `${date}nd`;
      case 3: return `${date}rd`;
      default: return `${date}th`;
    }
};

export function goToDay(dispatch, daySelected, direction) {
    if(direction == 'left') {
        if(daySelected > 0) {
            dispatch({type: 'daySelected/set', payload: daySelected-1});
        }else if(daySelected == 0) {
            dispatch({type: 'daySelected/set', payload: 6});
        }
    }else if(direction == 'right') {
        if(daySelected < 6) {
            dispatch({type: 'daySelected/set', payload: daySelected+1});
        }else if(daySelected == 6) {
            dispatch({type: 'daySelected/set', payload: 0});
        }
    }
}

export function filterRecordingBasedOnDay(day) { //used closure first time doing so, so nice
    return function(obj) {
        let recordedStartTime = dayjs(obj.recordedStartTime);
        let monthNotBasedOnZeroAsFirst = recordedStartTime.month()+1;
        return monthNotBasedOnZeroAsFirst == day.month && (recordedStartTime.date()) == day.date;
    }
}

export function calculateXPPoints(timeboxData, recordedStartTime, recordedEndTime) {
    const minuteConversionDivisor = 60000;
    let timeboxDuration = (new Date(timeboxData.endTime) - new Date(timeboxData.startTime)) / minuteConversionDivisor;
    let differenceBetweenStartTimes = Math.abs(recordedStartTime - new Date(timeboxData.startTime)) / minuteConversionDivisor;
    let firstPoint = 0;
    let slightlyMoreThanTimeboxDuration = timeboxDuration*1.3;
    if(differenceBetweenStartTimes >= slightlyMoreThanTimeboxDuration) {
        firstPoint = timeboxDuration / differenceBetweenStartTimes;
    }else if(differenceBetweenStartTimes < slightlyMoreThanTimeboxDuration) {
        let gradient = ((1/1.3)-1) / slightlyMoreThanTimeboxDuration; //using y=mx+c, using graphs for this logic as it makes calculating points based on certain values be linear
        firstPoint = gradient*differenceBetweenStartTimes + 1;
    }

    let recordingDuration = (recordedEndTime - recordedStartTime) / minuteConversionDivisor;
    let secondPoint = 1;

    if(recordingDuration > timeboxDuration) {
        secondPoint = timeboxDuration / recordingDuration;
    }
    return firstPoint + secondPoint;

}

export function getProgressAndLevel(xpPoints) {
    if(xpPoints < 10) {
        return {progress: 0, level: 1};
    }else{
        let level = Math.floor(33*Math.log10(xpPoints - 9) + 1);
        let xpPointsNeededForCurrentLevel = Math.pow(10, (level-1)/33) + 9;
        let xpPointsNeededForNextLevel = Math.pow(10, level/33) + 9;
        let differenceInPointsBetweenLevels = xpPointsNeededForNextLevel - xpPointsNeededForCurrentLevel;
        let progress = ((xpPoints - xpPointsNeededForCurrentLevel) / differenceInPointsBetweenLevels);
        return {progress: progress, level: Math.round(level)};
    }
}