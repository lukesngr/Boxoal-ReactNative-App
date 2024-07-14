const { addBoxesToTime } = require("./coreLogic");

module.exports = async (taskData) => {
    let {schedule, timebox, recordingStartTime} = taskData;
    timebox = JSON.parse(timebox);
    schedule = JSON.parse(schedule);
    let currentTime = new Date();
    let endTime = addBoxesToTime(schedule.boxSizeUnit, schedule.boxSizeNumber, recordingStartTime, timebox.numberOfBoxes);
    let totalMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    let endMinutes = endTime.getHours() * 60 + endTime.getMinutes();
    let totalPercentage = (totalMinutes / endMinutes) * 100;
    console.log(totalPercentage);
    return Promise.resolve();
};