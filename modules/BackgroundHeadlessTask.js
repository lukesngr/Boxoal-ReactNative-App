const { addBoxesToTime } = require("./coreLogic");

module.exports = async (taskData) => {
    let {schedule, timebox, recordingStartTime} = taskData;
    timebox = JSON.parse(timebox);
    schedule = JSON.parse(schedule);
    let recordingStartTimeInMinutes = new Date(recordingStartTime).getHours() * 60 + new Date(recordingStartTime).getMinutes();
    let currentTimeInMinutes = new Date().getHours() * 60 + new Date().getMinutes();
    let timeboxSizeInMinutes;

    if(schedule.boxSizeUnit == "min") {
        timeboxSizeInMinutes = schedule.boxSizeNumber;
    }else if(schedule.boxSizeUnit == "hr") {
        timeboxSizeInMinutes = schedule.boxSizeNumber * 60;
    }

    let differenceInMinutes = currentTimeInMinutes - recordingStartTimeInMinutes;
    let totalPercentage = (differenceInMinutes / timeboxSizeInMinutes) * 100;
    console.log(totalPercentage);
    return Promise.resolve();
};