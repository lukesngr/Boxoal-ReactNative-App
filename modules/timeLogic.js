export function returnTimesSeperatedForSchedule(schedule) {

    let listOfTimes = [];
    let wakeUpTimeSeperatedIntoHoursAndMins;
    let currentHour;
    let currentMinute;

    try {
        wakeUpTimeSeperatedIntoHoursAndMins = schedule.wakeupTime.split(":").map(function(num) { return parseInt(num); });
        currentHour = wakeUpTimeSeperatedIntoHoursAndMins[0]; //hours and minutes start off at wakeup time
        currentMinute = wakeUpTimeSeperatedIntoHoursAndMins[1];

        if(currentMinute == undefined) {
            throw "Wakeup time provided to function is not in correct format";
        }else if(currentMinute > 60 || currentMinute < 0) { //do minutes for readability sake
            throw "Wakeup time must be between 0:00 and 24:00";
        }else if((currentHour >= 24 && currentMinute > 0) || currentHour < 0  ) {
            throw "Wakeup time must be between 0:00 and 24:00";
        }

    }catch(error) {
        if(error.name == 'TypeError') {
            console.log("Wakeup time provided to function is not a string");
        }else{
            console.log(error);
        }
        return [];
    }

    if(!Number.isInteger(schedule.boxSizeNumber)) {
        schedule.boxSizeNumber = Math.floor(schedule.boxSizeNumber);
        console.log("Beware decimal passed as box size number, was ignored");
    }

    if(schedule.boxSizeUnit == "min") { 
        
        while(currentHour < 24 && currentMinute < 60) {
            listOfTimes.push(`${currentHour}:${currentMinute < 10 ? '0' : ''}${currentMinute}`);  //push to list of times in format hh:mm 
            
            currentMinute += schedule.boxSizeNumber;
            if(currentMinute >= 60) {
                currentHour++;
                currentMinute -= 60;
            }

        }

        currentHour = 0;
        currentMinute = 0;

        while(currentHour < wakeUpTimeSeperatedIntoHoursAndMins[0] || currentMinute < wakeUpTimeSeperatedIntoHoursAndMins[1]) {
            listOfTimes.push(`${currentHour}:${currentMinute < 10 ? '0' : ''}${currentMinute}`);
            
            currentMinute += schedule.boxSizeNumber;
            if(currentMinute >= 60) {
                currentHour++;
                currentMinute -= 60;
            }

        }
    }else if(schedule.boxSizeUnit == "hr") {
        let currentHour = wakeUpTimeSeperatedIntoHoursAndMins[0]; //hours  start off at wakeup time
        const currentMinute = wakeUpTimeSeperatedIntoHoursAndMins[1]; //minute doesn't change due to unit being hours
        
        while(currentHour < 24) {
            listOfTimes.push(`${currentHour}:${currentMinute < 10 ? '0' : ''}${currentMinute}`);  //push to list of times in format hh:mm 
            currentHour += schedule.boxSizeNumber;
        }

        currentHour = 0;

        while(currentHour < wakeUpTimeSeperatedIntoHoursAndMins[0]) {
            listOfTimes.push(`${currentHour}:${currentMinute < 10 ? '0' : ''}${currentMinute}`);
            
            currentHour += schedule.boxSizeNumber;
        }
    }

    return listOfTimes;
}

export function calculateRemainderTimeBetweenTwoTimes(time1, time2, boxSizeUnit, boxSizeNumber) {
    let remainderTime = 0;

    if(boxSizeUnit == "min") {
        remainderTime += ((time2.hour() - time1.hour())*60) % boxSizeNumber;
        remainderTime += (time2.minute() - time1.minute()) % boxSizeNumber;
    }else if(boxSizeUnit == "hr") {
        remainderTime += (time2.hour() - time1.hour()) / boxSizeNumber;
        remainderTime += (time2.minute() - time1.minute()) / (boxSizeNumber*60);
    }

    return remainderTime;

}