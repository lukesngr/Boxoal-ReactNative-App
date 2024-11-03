import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { convertToDateTime } from "./coreLogic";

export const dayToName = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

export function getArrayOfDayDateDayNameAndMonthForHeaders(todaysDate) {
    
    let result = [];

    for(let i = 0; i < 7; i++) {
        let currentDay = dayjs(todaysDate).day(i);
        result.push({day: currentDay.day(), month: currentDay.month()+1, name: dayToName[i], date: currentDay.date()}); 
    }

    return result;
}

export function getCurrentDay() {
    const {wakeupTime} = useSelector(state => state.scheduleEssentials.value);
    const dateObject = dayjs();
    let currentDay = dateObject.day();
    let cutOffDateTime = dateObject.hour(wakeupTime.split(':')[0]).minute(wakeupTime.split(':')[1]);

    if(dateObject.isBefore(cutOffDateTime)) {
        return currentDay-1;
    }else{
        return currentDay;
    }
}


export function ifCurrentDay(number, returnIfTrue, returnIfFalse) {
    const {wakeupTime} = useSelector(state => state.scheduleEssentials.value);
    const dateObject = dayjs();
    let currentDay = dateObject.day();
    let cutOffDateTime = dateObject.hour(wakeupTime.split(':')[0]).minute(wakeupTime.split(':')[1]);

    if(typeof number !== 'number') { 
        console.log("Non-number datatype given to comparison function");
        return returnIfFalse;
    }

    if(number == currentDay &&  cutOffDateTime.isSameOrBefore(dateObject)) {
        return returnIfTrue;
    }else if((number+1) == currentDay && dateObject.isBefore(cutOffDateTime)) {
        return returnIfTrue;
    }
    return returnIfFalse;
}

export function ifEqualOrBeyondCurrentDay(number, returnIfTrue, returnIfFalse) {
    const {wakeupTime} = useSelector(state => state.scheduleEssentials.value);
    const dateObject = dayjs();
    let currentDay = dateObject.day();
    let cutOffDateTime = dateObject.hour(wakeupTime.split(':')[0]).minute(wakeupTime.split(':')[1]);

    if(typeof number !== 'number') { 
        console.log("Non-number datatype given to comparison function");
        return returnIfFalse;
    }
    
    if(number >= currentDay && cutOffDateTime.isSameOrBefore(dateObject)) {
        return returnIfTrue;
    }else if((number+1) >= currentDay && dateObject.isBefore(cutOffDateTime)) {
        return returnIfTrue;
    }
    return returnIfFalse;
}

function timeboxesDateBinarySearch(timeboxes, selectedDate) {
    let middle = timeboxes.length / 2;
    let middleStartTime = new Date(timeboxes[middle].startTime); 
    
    if(middleStartTime == selectedDate || timeboxes.length == 1) {
        return middle;
    }else if(middleStartTime < selectedDate) {
        return timeboxesDateBinarySearch(timeboxes.slice(middle), selectedDate);
    }else if(middleStartTime > selectedDate) {
        return timeboxesDateBinarySearch(timeboxes.slice(0, middle), selectedDate);
    }
}

function binarySearch(array, value) {
    let middle = array.length / 2;
    let center = array[middle];
    console.log(array, value)
    if(center == value) {
        console.log(center, value)
        return Math.round(middle);
    }else if(array.length == 1) {
        return Math.round(middle);
    }else if(value > center) {
        return middle+binarySearch(array.slice(middle), value);
    }else if(value < center) {
        return binarySearch(array.slice(0, middle), value);
    }
}

function filterTimeboxesBasedOnWeekRange(timeboxes, selectedDate) {
    let startOfWeek = dayjs(selectedDate).startOf('week').hour(0).minute(0).toDate();
    let endOfWeek = dayjs(selectedDate).endOf('week').add(1, 'day').hour(23).minute(59).toDate();
    let indexOfStartOfRange = timeboxesDateBinarySearch(timeboxes, startOfWeek);
    timeboxes = timeboxes.slice(indexOfStartOfRange); //do before to remove useless info
    let indexOfEndOfRange = timeboxesDateBinarySearch(timeboxes, endOfWeek);
    timeboxes = timeboxes.slice(0, indexOfEndOfRange+1);
    return timeboxes;
}
