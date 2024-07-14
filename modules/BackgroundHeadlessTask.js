import { useSelector } from "react-redux";

module.exports = async (taskData) => {
    console.log(taskData.scheduleID, taskData.timebox);
    let {scheduleID, timebox} = taskData;
    timebox = JSON.parse(timebox);
    let currentTime = new Date();
    let endTime = new Date(timebox.endTime);
    console.log(endTime, currentTime);
    let totalMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    let endMinutes = endTime.getHours() * 60 + endTime.getMinutes();
    let totalPercentage = (totalMinutes / endMinutes) * 100;
    console.log(totalPercentage);
    return Promise.resolve();
};