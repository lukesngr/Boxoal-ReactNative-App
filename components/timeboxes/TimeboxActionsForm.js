import { addBoxesToTime, calculateXPPoints, convertToDateTime, recordingNotificationsSetup, thereIsNoRecording } from "../../modules/coreLogic";
import axios from 'axios';
import { queryClient } from '../../modules/queryClient.js';
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveOverlayInterval, resetActiveOverlayInterval } from "../../redux/activeOverlayInterval";
import serverIP from "../../modules/serverIP";
import { Button } from "react-native-paper";
import EditTimeboxForm from "./EditTimeboxForm";
import { Dialog, Paragraph, Portal } from "react-native-paper";
import { useAuthenticator } from "@aws-amplify/ui-react-native";
import ManualEntryTimeModal from "../modals/ManualEntryTimeModal";
import { styles } from "../../styles/styles.js";
import NativeBackgroundModule from "../../specs/NativeBackgroundModule.ts";
import { useMutation } from "@tanstack/react-query";
import uuid from 'react-native-uuid';
import TimelineRecording from "./TimelineRecording.js";
import { reoccurringBoxOnOriginalDate } from "../../modules/dateCode.js";
import dayjs from "dayjs";
import useCreateBoxMut from "../../hooks/useCreateBoxMut.js";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { fetchAuthSession } from "aws-amplify/auth";
dayjs.extend(customParseFormat)

export default function TimeboxActionsForm(props) {
    const {data, date, time} = props;
    const [manualEntryModalShown, setManualEntryModalShown] = useState(false);
    const [showEditTimeboxForm, setShowEditTimeboxForm] = useState(false);
    const timeboxRecording = useSelector(state => state.timeboxRecording.value);
    const recordedTimeboxesMap = useSelector(state => state.scheduleData.value.recordedTimeboxes);
    const {boxSizeUnit, boxSizeNumber, scheduleID, scheduleIndex} = useSelector(state => state.profile.value);
    const dispatch = useDispatch();
     
    const recordedTimebox = recordedTimeboxesMap ? recordedTimeboxesMap.getFromK2(data.objectUUID) : null;
    const noPreviousRecording = thereIsNoRecording(recordedTimebox, data.reoccuring, date, time);
    const timeboxIsntRecording = timeboxRecording.timeboxID == -1;
    const timeboxIsRecording = timeboxRecording.timeboxID == data.id && timeboxRecording.timeboxDate == date;
    function closeModal() {
    	setManualEntryModalShown(false)
        dispatch({type: 'modalVisible/set', payload: {visible: false, props: {}}});
    }
    
    const createTimeboxMutation = useCreateBoxMut(data.goalID, closeModal)

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
                recordingDataCopy.timeBox = data
                copyOfOld[scheduleIndex].recordedTimeboxes.push(recordingDataCopy);

                //recordedTimeboxes in timeboxes
                let timeboxIndex = copyOfOld[scheduleIndex].timeboxes.findIndex(element => element.objectUUID == data.objectUUID);
                copyOfOld[scheduleIndex].timeboxes[timeboxIndex].recordedTimeBoxes.push(recordingDataCopy);

                //recordedTimeBoxes in goals
                let goalIndex = copyOfOld[scheduleIndex].goals.findIndex(element => element.id == Number(data.goalID));
                let timeboxGoalIndex = copyOfOld[scheduleIndex].goals[goalIndex].timeboxes.findIndex(element => element.objectUUID == data.objectUUID);
                
                copyOfOld[scheduleIndex].goals[goalIndex].timeboxes[timeboxGoalIndex].recordedTimeBoxes.push(recordingDataCopy);
                return copyOfOld;
            });
            
            
            return { previousSchedule };
        },
        onSuccess: () => {
            closeModal();
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
            
            closeModal();
        }
    });

    async function startRecording() {
        NativeBackgroundModule.startBackgroundWork(JSON.stringify(data), JSON.stringify({id: scheduleID, boxSizeNumber, boxSizeUnit}), new Date().toISOString());
        dispatch({type: 'timeboxRecording/set', payload: {timeboxID: data.id, timeboxDate: date, recordingStartTime: new Date().toISOString()}});
        dispatch(resetActiveOverlayInterval());
    }

    async function stopRecording() {
        NativeBackgroundModule.stopBackgroundWork();
        let recordedStartTime = new Date(timeboxRecording.recordingStartTime);
        dispatch({type: 'timeboxRecording/set', payload: {timeboxID: -1, timeboxDate: 0, recordingStartTime: 0}});
        dispatch(setActiveOverlayInterval());
	let timeboxData;
	if(!reoccurringBoxOnOriginalDate(data.startTime, date, time)) {
	  	const differenceInMinutes = (new Date(data.endTime).getTime() - new Date(data.startTime).getTime()) / 60000;
		const startTime = dayjs(`${dayjs().date()+'/'+(dayjs().month()+1)} ${time} ${dayjs().year()}`, 'D/M H:mm YYYY');
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
                      recordedStartTime: recordedStartTime, 
                      recordedEndTime: new Date().toISOString(), 
                      schedule: { connect: { id: scheduleID } },
            	      objectUUID: uuid.v4(),
		    }
                  }
                }
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
              	  recordedStartTime: recordedStartTime, 
                    recordedEndTime: new Date().toISOString(), 
                    timeBox: { connect: { objectUUID: timeboxData.objectUUID } }, 
                    schedule: { connect: { id: scheduleID } },
                    objectUUID: uuid.v4(),
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

    }
    
    
    return (
    <>
        {showEditTimeboxForm ? ( <EditTimeboxForm data={data} previousRecording={!noPreviousRecording} back={() => setShowEditTimeboxForm(false)}></EditTimeboxForm>) : (<>
        <Portal>
            <Dialog style={styles.forms.dialogStyle} visible={props.visible} onDismiss={closeModal}>
                <Dialog.Title style={styles.forms.dialogTitleStyle}>{data.title}</Dialog.Title>
                <Dialog.Content>
                    <Paragraph style={{color: 'white', fontFamily: 'KameronRegular', fontSize: 20}}>
                       {noPreviousRecording ? (`Actions for ${data.title} ${data.isTimeblock ? "timeblock" : "timebox"}`) :
                        ("Timebox and recording comparison")}
                    </Paragraph>
                    {!noPreviousRecording && recordedTimebox && <TimelineRecording timeboxStart={data.startTime}
                            timeboxEnd={data.endTime}
                            recordingStart={recordedTimebox.recordedStartTime}
                            recordingEnd={recordedTimebox.recordedEndTime}></TimelineRecording>}
                </Dialog.Content>
                <Dialog.Actions>
                    {noPreviousRecording && timeboxIsntRecording && <>
                        <Button {...styles.forms.actionButton} mode="contained" onPress={() => setManualEntryModalShown(true)}>Time Entry</Button> 
                        <Button {...styles.forms.actionButton} testID="recordButton" mode="contained" onPress={startRecording}>Record</Button>
                    </>}
                    {noPreviousRecording && timeboxIsRecording && 
                    <Button {...styles.forms.actionButton} mode="contained" onPress={stopRecording}>Stop Recording</Button>}
                    {timeboxIsntRecording && <Button textColor="black" {...styles.forms.actionButton} testID="editTimebox" buttonColor="white" mode="contained" onPress={() => setShowEditTimeboxForm(true)}>Edit</Button>}
                    <Button {...styles.forms.nonActionButton} onPress={closeModal}>Close</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
        <ManualEntryTimeModal dispatch={dispatch} visible={manualEntryModalShown} close={closeModal} data={data} scheduleID={scheduleID}></ManualEntryTimeModal>
        </>)}
    </>);
}
