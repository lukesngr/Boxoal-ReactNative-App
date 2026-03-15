import { timeboxGrid } from "../redux/timeboxGrid";
import { convertToDayjs, convertToTimeAndDate } from "./formatters";

import dayjs from "dayjs";
var isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isSameOrBefore)




export function thereIsNoRecording(recordedBox, reoccuring, date, time) {
    if(recordedBox == null) {
        return true;
    }else{
	return false;
    }
}

export function generateTimeBoxGrid(schedule, selectedDate) {
    let timeBoxGrid = {};

    schedule.timeboxes.forEach(function (element) { //for each timebox
        const [time, date] = convertToTimeAndDate(element.startTime); //convert the datetime to a time and date e.g. format hh:mm dd/mm
        if(element.reoccuring != null) {
            let startOfDayRange = element.reoccuring.startOfDayRange < element.reoccuring.endOfDayRange ? element.reoccuring.startOfDayRange : element.reoccuring.endOfDayRange;
            let endOfDayRange = element.reoccuring.startOfDayRange < element.reoccuring.endOfDayRange ? element.reoccuring.endOfDayRange : element.reoccuring.startOfDayRange;
             while(startOfDayRange <= endOfDayRange) {
                let currentDate = dayjs(selectedDate).day(startOfDayRange).format('D/M');
                if (!Object.hasOwn(timeBoxGrid, currentDate)) { timeBoxGrid[currentDate] = {}; } //if date key not in map than set empty map to date key
                if(!Object.hasOwn(timeBoxGrid[currentDate], time)) {
                	timeBoxGrid[currentDate][time] = element; //lookup date key and set the map inside it to key of time with value of the element itself
		} //lookup date key and set the map inside it to key of time with value of the element itself
                startOfDayRange++;
            }
        }else{
            if(!Object.hasOwn(timeBoxGrid, date)) { timeBoxGrid[date] = {}; } //if date key not in map than set empty map to date key
            timeBoxGrid[date][time] = element; //lookup date key and set the map inside it to key of time with value of the element itself
        }
    });

    return timeBoxGrid
}




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

export function getMaxNumberOfGoals(goalsCompleted) {
    if(goalsCompleted == 0) {
        return 1;
    }else if(goalsCompleted >= 1 && goalsCompleted < 6) {
        return 2;
    }else if(goalsCompleted >= 6 && goalsCompleted < 12) {
        return 3;
    }else if(goalsCompleted >= 12 && goalsCompleted < 24) {
        return 4;
    }else if(goalsCompleted >= 24) {
        return 100000000000; //whoever hits this is a god
    }
}
