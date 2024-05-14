import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { convertToDateTime } from "./coreLogic";

export function getArrayOfDayDateDayNameAndMonthForHeaders(todaysDate) {
    let dayToName = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"]
    let result = [];

    for(let i = 0; i < 7; i++) {
        let currentDay = dayjs(todaysDate).day(i);
        result.push({day: currentDay.day(), month: currentDay.month()+1, name: dayToName[i], date: currentDay.date()}); 
    }

    return result;
}


export function ifCurrentDay(number, returnIfTrue, returnIfFalse) {
    const {wakeupTime} = useSelector(state => state.scheduleEssentials.value);
    const dateObject = new Date();
    let currentDay = dateObject.getDay();
    let cutOffDateTime = convertToDateTime(wakeupTime, dateObject.getDay()+'/'+dateObject.getMonth());

    if(typeof number !== 'number') { 
        console.log("Non-number datatype given to comparison function");
        return returnIfFalse;
    }

    if(number == currentDay && dateObject >= cutOffDateTime) {
        return returnIfTrue;
    }else if(number == currentDay+1 && dateObject < cutOffDateTime) {
        return returnIfTrue;
    }
    return returnIfFalse;
}

export function ifEqualOrBeyondCurrentDay(number, returnIfTrue, returnIfFalse) {
    const {wakeupTime} = useSelector(state => state.scheduleEssentials.value);
    const dateObject = new Date();
    let currentDay = dateObject.getDay();
    let cutOffDateTime = convertToDateTime(wakeupTime, dateObject.getDay()+'/'+dateObject.getMonth());

    if(typeof number !== 'number') { 
        console.log("Non-number datatype given to comparison function");
        return returnIfFalse;
    }
    
    if(number >= currentDay && dateObject >= cutOffDateTime) {
        return returnIfTrue;
    }else if(number >= currentDay+1 && dateObject < cutOffDateTime) {
        return returnIfTrue;
    }
    return returnIfFalse;
}



