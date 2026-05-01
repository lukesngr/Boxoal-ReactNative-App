import axios from "axios";
import { Dialog, Button, Portal } from "react-native-paper";
import { useState } from "react";
import DatePicker from "react-native-date-picker";
import serverIP from "../../modules/serverIP";
import { queryClient } from '../../modules/queryClient.js';
import { useDispatch, useSelector } from "react-redux";
import { convertToTimeAndDate } from "../../modules/formatters.js";
import { styles } from "../../styles/styles.js";
import { reoccurringBoxOnOriginalDate } from "../../modules/dateCode.js";
import { useMutation } from "@tanstack/react-query";
import uuid from 'react-native-uuid';
import useCreateBoxMut from "../../hooks/useCreateBoxMut.js";
import dayjs from "dayjs";
import { fetchAuthSession } from "aws-amplify/auth";

export default function ManualEntryTimeModal(props) {
    const {data} = props;
    const [recordedStartTime, setRecordedStartTime] = useState(new Date(props.data.startTime));
    const [recordedEndTime, setRecordedEndTime] = useState(new Date(props.data.endTime));
    const [startTimePickerVisible, setStartTimePickerVisible] = useState(false);
    const [endTimePickerVisible, setEndTimePickerVisible] = useState(false);
    const {scheduleIndex, scheduleID} = useSelector(state => state.profile.value);
    const dispatch = useDispatch();
    const createTimeboxMutation = useCreateBoxMut(props.data.goalID, props.close)
    
    const createRecordingMutation = useMutation({
        mutationFn: ({ recordingData, headers }) => axios.post(serverIP+'/createRecordedTimebox', recordingData, headers),
        onMutate: async ({ recordingData, headers }) => {
            await queryClient.cancelQueries(['schedule']); 
            
            const previousSchedule = queryClient.getQueryData(['schedule']);
            
            queryClient.setQueryData(['schedule'], (old) => {
                if (!old) return old;
                //recordedTimeBoxes in schedule
                let copyOfOld = JSON.parse(JSON.stringify(old));
                let recordingDataCopy = JSON.parse(JSON.stringify(recordingData));
                recordingDataCopy.timeBox = props.data
                copyOfOld[scheduleIndex].recordedTimeboxes.push(recordingDataCopy);

                //recordedTimeboxes in timeboxes
                let timeboxIndex = copyOfOld[scheduleIndex].timeboxes.findIndex(element => element.objectUUID == props.data.objectUUID);
                copyOfOld[scheduleIndex].timeboxes[timeboxIndex].recordedTimeBox = recordingDataCopy;

                //recordedTimeBoxes in goals
                let goalIndex = copyOfOld[scheduleIndex].goals.findIndex(element => element.id == Number(props.data.goalID));
                let timeboxGoalIndex = copyOfOld[scheduleIndex].goals[goalIndex].timeboxes.findIndex(element => element.objectUUID == props.data.objectUUID);
                
                copyOfOld[scheduleIndex].goals[goalIndex].timeboxes[timeboxGoalIndex].recordedTimeBox = recordingDataCopy;
                return copyOfOld;
            });
            
            
            return { previousSchedule };
        },
        onSuccess: () => {
            props.close()
            dispatch({type: 'alert/set', payload: {
                open: true,
                title: "Timebox",
                message: "Added recorded timebox!"
            }});
            queryClient.invalidateQueries(['schedule']); // Refetch to get real data
        },
        onError: (error, goalData, context) => {
            queryClient.setQueryData(['schedule'], context.previousSchedule);
            dispatch({type: 'alert/set', payload: { open: true, title: "Error", message: "An error occurred, please try again or contact the developer" }});
            queryClient.invalidateQueries(['schedule']);
            
            props.close();
        }
    });

async function submitManualEntry() {
        let objectUUID = uuid.v4();
        let timeboxData; //alot of redundant code here but alas dont want to fix just yet
        let [time, date] = convertToTimeAndDate(recordedStartTime);
        if(!reoccurringBoxOnOriginalDate(data.startTime, date, time)) {
            const startTimeAsDate = new Date(data.startTime)
            const differenceInMinutes = (new Date(data.endTime).getTime() - startTimeAsDate.getTime()) / 60000;
            const startTime = dayjs().hour(startTimeAsDate.getHours()).minute(startTimeAsDate.getMinutes())
                .year(recordedStartTime.getFullYear()).month(recordedStartTime.getMonth()).date(recordedStartTime.getDate());
            let endTime = startTime;
            endTime = endTime.add(differenceInMinutes, 'm')
            timeboxData = {...data,
                objectUUID: uuid.v4(),
                startTime: startTime.utc().format(),
                endTime: endTime.utc().format(),
                schedule: {connect: {id: scheduleID}},
                goal: {connect: {id: data.goalID}},
                recordedTimeBox: {
                    create: {
                        recordedStartTime: recordedStartTime.toISOString(), 
                        recordedEndTime: recordedEndTime.toISOString(), 
                        schedule: { connect: { id: scheduleID } },
                        objectUUID: objectUUID,
                    }
                }
            };
            delete timeboxData.goalID;
            delete timeboxData.reoccuring;
            const session = await fetchAuthSession();
            const accessToken = session.tokens?.accessToken.toString();
            const headers = {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            };
            createTimeboxMutation.mutate({ timeboxData, headers });
        }else{
            timeboxData = data;
            const recordingData = {
                recordedStartTime: recordedStartTime.toISOString(), 
                recordedEndTime: recordedEndTime.toISOString(), 
                timeBox: { connect: { objectUUID: timeboxData.objectUUID } }, 
                schedule: { connect: { id: scheduleID } },
                objectUUID: objectUUID,
            };
            const session = await fetchAuthSession();
            const accessToken = session.tokens?.accessToken.toString();
            const headers = {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            };
            createRecordingMutation.mutate({ recordingData, headers });
        }
        
        
        let timeboxTitle = props.data.title;
        let timebox = {...props.data, recordedTimeBox: {recordedStartTime, recordedEndTime, title: timeboxTitle}};
        props.dispatch({type: 'modalVisible/set', payload: {visible: true, props: {data: timebox, date, time}}});
    }

    return (<Portal>
    <Dialog style={styles.forms.dialogStyle} visible={props.visible} onDismiss={props.close}>
        <Dialog.Title style={styles.forms.dialogTitleStyle}>Manual Entry Of Recorded Time</Dialog.Title>
        <Dialog.Content>
            <Button {...styles.forms.actionButton} style={{marginBottom: 2}} onPress={() => setStartTimePickerVisible(true)}>Pick Recorded Start Time</Button>
            <Button {...styles.forms.actionButton} mode="contained" onPress={() => setEndTimePickerVisible(true)}>Pick Recorded End Time</Button>
        </Dialog.Content>
        <Dialog.Actions>
            <Button {...styles.forms.actionButton} mode="contained" onPress={submitManualEntry}>Enter</Button>
            <Button {...styles.forms.nonActionButton} textColor="white" onPress={props.close}>Close</Button>
        </Dialog.Actions>
    </Dialog>
    <DatePicker modal mode="datetime" date={recordedStartTime}
        onDateChange={(date) => setRecordedStartTime(date)}
        open={startTimePickerVisible}
        onConfirm={(date) => 
            {
                setRecordedStartTime(date)
                setStartTimePickerVisible(false);
            }
        }
        onCancel={() => setStartTimePickerVisible(false)}>
    </DatePicker>
    <DatePicker modal mode="datetime" date={recordedEndTime}
        onDateChange={(date) => setRecordedEndTime(date)}
        open={endTimePickerVisible}
        onConfirm={(date) => 
            {
                setRecordedEndTime(date)
                setEndTimePickerVisible(false);
            }
        }
        onCancel={() => setEndTimePickerVisible(false)}>
    </DatePicker>
    </Portal>)
}
