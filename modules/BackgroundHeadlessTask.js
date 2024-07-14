const { updateNotification } = require("./coreLogic");

module.exports = async (taskData) => {
    let {timebox, schedule, recordingStartTime} = taskData;
    updateNotification(timebox, schedule, recordingStartTime)
    for(let i = 1; i < 6; i++) {
        setTimeout(() => updateNotification(timebox, schedule, recordingStartTime), 2000*i);
    }
    return Promise.resolve();
};