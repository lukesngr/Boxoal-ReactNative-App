import { calculateRemainderTimeBetweenTwoTimes } from "./timeLogic";
import notifee, {EventType} from '@notifee/react-native';
import { Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setActiveOverlayInterval, resetActiveOverlayInterval } from "../redux/activeOverlayInterval";
import axios from 'axios';
import { queryClient } from '../App';
import serverIP from "./serverIP";
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

export function calculateBoxesBetweenTwoTimes(time1, time2, boxSizeUnit, boxSizeNumber) {
    let numberOfBoxes = 0;

    if(boxSizeUnit == "min") {
        numberOfBoxes += Math.floor(((time2.hour() - time1.hour())*60) / boxSizeNumber);
        numberOfBoxes += Math.floor((time2.minute() - time1.minute()) / boxSizeNumber);
    }else if(boxSizeUnit == "hr") {
        numberOfBoxes += Math.floor((time2.hour() - time1.hour()) / boxSizeNumber);
    }

    if(time1 > time2) {
        return -numberOfBoxes;
    }else{
        return numberOfBoxes;
    }
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
        if(endHours > 24) {
            endHours = endHours - 24;
        }
    }

    return `${endHours}:${endMinutes < 10 ? '0' : ''}${endMinutes}`;
}

export function calculatePixelsFromTopOfGridBasedOnTime(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions, time) {

    if(overlayDimensions[0] == 0 ) { //hasn't been set yet
        return 0;
    }

    const pixelsPerBox = overlayDimensions[2];

    let wakeupDateTime = time.hour(wakeupTime.split(":")[0]).minute(wakeupTime.split(":")[1]);
    let boxesBetween = calculateBoxesBetweenTwoTimes(wakeupDateTime, time, boxSizeUnit, boxSizeNumber);
    let remainderTime = calculateRemainderTimeBetweenTwoTimes(wakeupDateTime, time, boxSizeUnit, boxSizeNumber);

    if(remainderTime < 0) { //if negative remainder e.g. time is behind number of boxes
        remainderTime = boxSizeNumber + remainderTime; 
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
            return [overlayDimensions[1], overlayDimensions[3]];
        }else if(day.date == currentDate.date()) {
            let overlayTotalHeight = calculatePixelsFromTopOfGridBasedOnTime(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions, currentDate)
            return [overlayTotalHeight, overlayDimensions[3]];
        }else if(day.date > currentDate.date()){
            //console.log(day.date)
            return [0, 0];
        }
    }else if(recordedStartDate.isSame(currentDate, 'date')) {
        let overlaysTotalHeight = calculatePixelsFromTopOfGridBasedOnTime(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions, currentDate);
        let recordingOverlayHeight = overlaysTotalHeight - originalOverlayHeight;
        return [recordingOverlayHeight, originalOverlayHeight+overlayDimensions[3]];
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

export function getHeightForBoxes(numberOfBoxes) { return `calc(${(numberOfBoxes * 100)}% + ${(numberOfBoxes - 1) * 2}px)` }

export async function initialNotificationSetup() {
    await notifee.requestPermission()

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'boxoal',
      name: 'boxoal notification channel',
    });
}

export function recordIfNotificationPressed(type, detail, dispatch, timeboxRecording) {
    if (type === EventType.ACTION_PRESS && detail.pressAction.id) {
        let ids = detail.pressAction.id.split("-");
        let recordedStartTime = new Date(timeboxRecording[2]);
        dispatch({type: 'timeboxRecording/set', payload: [-1, 0, 0]});
        dispatch(setActiveOverlayInterval());
        axios.post(serverIP+'/createRecordedTimebox', 
            {recordedStartTime: recordedStartTime, recordedEndTime: new Date(), timeBox: {connect: {id: ids[1]}}, schedule: {connect: {id: ids[2]}}},
            {headers: { 'Origin': 'http://localhost:3000' }}
        ).then(() => {
            queryClient.refetchQueries();
            Alert.alert("Added recorded timebox");
        }).catch(function(error) {
            Alert.alert("Error contact developer");
            console.log(error); 
        })  
    }
}

export async function recordingNotificationsSetup(timebox, schedule) {

    notifee.registerForegroundService((notification) => {
        return new Promise((resolve, reject) => {
            const updateNotification = () => {
                let currentTime = new Date();
                let totalMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
                let endMinutes = timebox.endTime.getHours() * 60 + timebox.endTime.getMinutes();
                let totalPercentage = (totalMinutes / endMinutes) * 100;
    
                notifee.displayNotification({
                    id: 'recordingNotification',
                    title: 'Boxoal',
                    body: `Recording for ${timebox.title} started...`,
                    android: {
                        channelId: 'boxoal',
                        actions: [{
                            pressAction: {
                                id: `stopRecording-${timebox.id}-${schedule.id}`,
                                launchActivity: 'default',
                            },
                            title: 'Stop'
                        }],
                        progress: {
                            max: 100,
                            current: totalPercentage,
                        },
                    },
                });
    
                if (totalPercentage < 100) {
                    setTimeout(updateNotification, 2000);
                }
            };
    
            updateNotification();
            resolve();
        });
    });
}