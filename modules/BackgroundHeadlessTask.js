import notifee from '@notifee/react-native';

module.exports = async (taskData) => {
    
    let {totalPercentage, recordingStartTime, schedule, timebox} = taskData;
    timebox = JSON.parse(timebox);
    schedule = JSON.parse(schedule);
    console.log(totalPercentage)
    if(totalPercentage >= 100){
            await notifee.displayNotification({
                id: '1',
                title: 'Recording...',
                body: timebox.title+' has gone over number of boxes...',
                android: {
                    channelId: 'boxoal',
                    actions: [{
                        pressAction: {
                            id: `stopRecording+${timebox.id}+${schedule.id}+${recordingStartTime}`,
                            launchActivity: 'default',
                        },
                        title: 'Stop'}
                    ],
                },
            });
        }else{
            await notifee.displayNotification({
                id: '1',
                title: 'Recording...',
                body: 'for '+timebox.title,
                android: {
                    channelId: 'boxoal',
                    actions: [{
                        pressAction: {
                            id: `stopRecording+${timebox.id}+${schedule.id}+${recordingStartTime}`,
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
        }
    
    return Promise.resolve();
};