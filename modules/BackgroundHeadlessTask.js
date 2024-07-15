import notifee from '@notifee/react-native';

module.exports = async (taskData) => {
    let {timebox, schedule, recordingStartTime} = taskData;
    let totalPercentage = 0;
    timebox = JSON.parse(timebox);
    schedule = JSON.parse(schedule);

    async function delay(microseconds) {
        return new Promise(resolve => setTimeout(resolve, microseconds));
    }

    for(let i = 0; i < 17; i++) {    
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
        
        if(totalPercentage >= 100) {
            await notifee.displayNotification({
                id: 'recordingNotification',
                title: 'Boxoal',
                body: timebox.title+' has gone over number of boxes...',
                android: {
                    channelId: 'boxoal',
                    actions: [{
                        pressAction: {
                            id: `stopRecording-${timebox.id}-${schedule.id}`,
                            launchActivity: 'default',
                        },
                        title: 'Stop'}
                    ],
                },
            });
            break;
        }else{
            await notifee.displayNotification({
                id: 'recordingNotification',
                title: 'Boxoal',
                body: 'Recording for '+timebox.title+' started...',
                android: {
                    channelId: 'boxoal',
                    actions: [{
                        pressAction: {
                            id: `stopRecording-${timebox.id}-${schedule.id}`,
                            launchActivity: 'default',
                        },
                        title: 'Stop'}
                    ],
                    progress: {
                        max: 100,
                        current: totalPercentage,
                    },
                },
            });
            await delay(60000);
        }
    }
    
    return Promise.resolve();
};