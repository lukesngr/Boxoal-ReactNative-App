const { updateNotification } = require("./coreLogic");

module.exports = async (taskData) => {
    let {timebox, schedule, recordingStartTime} = taskData;
    
    function updateThenWait() {
        updateNotification(timebox, schedule, recordingStartTime)
        setInterval(updateThenWait, 2000);
    }

    updateThenWait();
    
    return Promise.resolve();
};