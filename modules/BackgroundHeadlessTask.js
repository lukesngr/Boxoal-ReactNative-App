module.exports = async (taskData) => {
    let {timebox, schedule, recordingStartTime} = taskData;
    let totalPercentage = 0;
    timebox = JSON.parse(timebox);
    schedule = JSON.parse(schedule);

    async function delay(microseconds) {
        return new Promise(resolve => setTimeout(resolve, microseconds));
    }

    for(let i = 0; i < 8; i++) {    
        let recordingStartTimeInMinutes = new Date(recordingStartTime).getHours() * 60 + new Date(recordingStartTime).getMinutes();
        let currentTimeInMinutes = new Date().getHours() * 60 + new Date().getMinutes();
        let timeboxSizeInMinutes;

        if(schedule.boxSizeUnit == "min") {
            timeboxSizeInMinutes = schedule.boxSizeNumber;
        }else if(schedule.boxSizeUnit == "hr") {
            timeboxSizeInMinutes = schedule.boxSizeNumber * 60;
        }

        let differenceInMinutes = currentTimeInMinutes - recordingStartTimeInMinutes;
        totalPercentage = (differenceInMinutes / timeboxSizeInMinutes) * 100;
        console.log(totalPercentage);
        await delay(120000);
    }
    
    return Promise.resolve();
};