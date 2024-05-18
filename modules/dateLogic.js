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



