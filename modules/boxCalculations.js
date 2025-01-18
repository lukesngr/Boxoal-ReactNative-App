import { convertToDayjs } from "./formatters";
import dayjs from "dayjs";

export function getHeightForBoxes(numberOfBoxes) { return `calc(${(numberOfBoxes * 100)}% + ${(numberOfBoxes - 1) * 2}px)` }

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

export function calculateBoxesBetweenTwoTimes(time1, time2, boxSizeUnit, boxSizeNumber) {
    let numberOfBoxes = 0;
    const minuteConversionDivisor = 60000;
    const hoursConversionDivisor = 3600000;

    if(boxSizeUnit == "min") {
        numberOfBoxes += Math.floor(((time2.valueOf() - time1.valueOf()) / minuteConversionDivisor) / boxSizeNumber);
    }else if(boxSizeUnit == "hr") {
        numberOfBoxes += Math.floor(((time2.valueOf() - time1.valueOf()) / hoursConversionDivisor) / boxSizeNumber);
    }

    if(time1 > time2) {
        return -numberOfBoxes;
    }else{
        return numberOfBoxes;
    }
}

export function calculateRemainderTimeBetweenTwoTimes(time1, time2, boxSizeUnit, boxSizeNumber) {
    let remainderTime = 0;
    const minuteConversionDivisor = 60000;
    const hoursConversionDivisor = 3600000;

    if(boxSizeUnit == "min") {
        remainderTime += Math.round(((time2.valueOf() - time1.valueOf()) / minuteConversionDivisor) % boxSizeNumber);
    }else if(boxSizeUnit == "hr") {
        remainderTime += ((time2.valueOf() - time1.valueOf()) / hoursConversionDivisor) % boxSizeNumber;
    }

    return remainderTime;

}

export function calculateMaxNumberOfBoxes(wakeupTime, boxSizeUnit, boxSizeNumber, timeboxes, time, date) {
    let wakeUpTimeSeparated = wakeupTime.split(":").map(function(num) { return parseInt(num); });
    let timeSeparated = time.split(":").map(function(num) { return parseInt(num); });
    let currentTime = convertToDayjs(time, date);
    let maxNumberOfBoxes = 0;

    for(let i = 0; i < timeboxes.length; i++) { //for each time box
        let timeboxStartTime = dayjs(timeboxes[i].startTime);

        if(currentTime.isBefore(timeboxStartTime)) { //if timebox occurs after the time of a timebox
            maxNumberOfBoxes = calculateBoxesBetweenTwoTimes(currentTime, timeboxStartTime, boxSizeUnit, boxSizeNumber);
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
        if(endHours >= 24) {
            endHours = endHours - 24;
        }
    }

    return `${endHours}:${endMinutes < 10 ? '0' : ''}${endMinutes}`;
}

export function getPercentageOfBoxSizeFilled(boxSizeUnit, boxSizeNumber, startTime, endTime) {
    const minuteConversionDivisor = 60000;
    let minutesOfTimeBox = (endTime.valueOf() - startTime.valueOf()) / minuteConversionDivisor;
    let percentageOfBoxSizeFilled =  0;

    if(boxSizeUnit == "min") {
        percentageOfBoxSizeFilled = minutesOfTimeBox / boxSizeNumber;
    }else if(boxSizeUnit == "hr") {
        percentageOfBoxSizeFilled = minutesOfTimeBox / (boxSizeNumber * 60);
    }
    return percentageOfBoxSizeFilled;
}

export function filterTimeGridBasedOnSpace(timeGridFilteredByDate, boxSizeUnit, boxSizeNumber, time) {
    let times = Object.keys(timeGridFilteredByDate);
    let endTime = addBoxesToTime(boxSizeUnit, boxSizeNumber, time, 1);
    let filteredTimes = [];
    let i = 0;
    for(i = 0; i < times.length; i++) {
        let startTimeAsDate = convertToDayjs(time, '1/1').toDate();
        let timeAsDate = convertToDayjs(times[i], '1/1').toDate();
        let endTimeAsDate = convertToDayjs(endTime, '1/1').toDate();

        if(timeAsDate >= startTimeAsDate && timeAsDate < endTimeAsDate) {
            filteredTimes.push(times[i]);
        }
    }

    return filteredTimes;
}

export function getMarginFromTopOfTimebox(boxSizeUnit, boxSizeNumber, timeboxTime, startOfTimeboxTime, timeboxHeight) {
    let minutesBetweenTimes = convertToDayjs(startOfTimeboxTime, '1/1').diff(convertToDayjs(timeboxTime, '1/1'), 'minute');
    let marginFromTop = 0;

    if(boxSizeUnit == "min") {
        marginFromTop = (minutesBetweenTimes / boxSizeNumber) * timeboxHeight;
    }else if(boxSizeUnit == "hr") {
        marginFromTop = (minutesBetweenTimes / (boxSizeNumber * 60)) * timeboxHeight;
    }

    return marginFromTop;
}

export function findSmallestTimeBoxLengthInSpace(timeboxGridFilteredByDate, timeboxesInSpace) {
    let smallestTimeboxLength = 1000000;
    const minuteConversionDivisor = 60000;

    for(let i = 0; i < timeboxesInSpace.length; i++) {
        let timeboxTime = timeboxesInSpace[i];
        let timebox = timeboxGridFilteredByDate[timeboxTime];

        let currentTimeboxLength = (new Date(timebox.endTime) - new Date(timebox.startTime)) / minuteConversionDivisor;
        if(currentTimeboxLength < smallestTimeboxLength) {
            smallestTimeboxLength = currentTimeboxLength;
        }
    }

    

    return smallestTimeboxLength;
} 

export function getStatistics(recordedTimeboxes) {
    let reschedules = 0;
    let minutesOverBy = 0;
    let averageTimeStartedOffBy = 0;
    let timeboxesThatMatchPredictedStart = 0;
    let timeboxesThatMatchCorrectTime = 0;
    for(let i = 0; i < recordedTimeboxes.length; i++) {
        let recordedTimebox = recordedTimeboxes[i];
        let recordedTimeboxStartTime = new Date(recordedTimebox.recordedStartTime);
        let recordedTimeboxEndTime = new Date(recordedTimebox.recordedEndTime);
        let timeboxStartTime = new Date(recordedTimebox.timeBox.startTime);
        let timeboxEndTime = new Date(recordedTimebox.timeBox.endTime);
        
        //reschedule rate
        if(recordedTimeboxStartTime.getDate() != timeboxStartTime.getDate()) {
            reschedules++;
        }

        ///average minutes over by
        let currentMinutesOverBy = ((recordedTimeboxEndTime - recordedTimeboxStartTime) - (timeboxEndTime - timeboxStartTime));
        if(currentMinutesOverBy == 0) {
            timeboxesThatMatchCorrectTime++;
        }
        minutesOverBy += currentMinutesOverBy;
        
        //time started accuracy
        let timeStartedAccuracyForTimebox = Math.abs(recordedTimeboxStartTime.getMinutes() - timeboxStartTime.getMinutes());
        timeStartedAccuracyForTimebox += (Math.abs(recordedTimeboxStartTime.getHours() - timeboxStartTime.getHours()))*60;
        if(timeStartedAccuracyForTimebox == 0) {
            timeboxesThatMatchPredictedStart++;
        }
        averageTimeStartedOffBy += timeStartedAccuracyForTimebox;
    }


    minutesOverBy = minutesOverBy / 60000;
    let averageTimeOverBy = minutesOverBy / recordedTimeboxes.length;
    let percentageRescheduled = reschedules / recordedTimeboxes.length;
    averageTimeStartedOffBy = averageTimeStartedOffBy / recordedTimeboxes.length;
    let percentagePredictedStart = timeboxesThatMatchPredictedStart / recordedTimeboxes.length;
    let percentageCorrectTime = timeboxesThatMatchCorrectTime / recordedTimeboxes.length;
    return {averageTimeOverBy, averageTimeStartedOffBy, percentagePredictedStart, percentageCorrectTime, percentageRescheduled};
}