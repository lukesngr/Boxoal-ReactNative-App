const { updateNotification } = require("./coreLogic");

module.exports = async (taskData) => {
    let {timebox, schedule, recordingStartTime} = taskData;
    updateNotification(timebox, schedule, recordingStartTime)
    setInterval(() => updateNotification(timebox, schedule, recordingStartTime), 2000);
    return Promise.resolve();
};