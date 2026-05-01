
import axios from "axios";
import { useState } from "react";
import serverIP from "../../modules/serverIP";
import { queryClient } from '../../modules/queryClient.js';
import { useDispatch } from "react-redux";
import { Dialog, Portal, TextInput, Button } from "react-native-paper";
import { styles } from "../../styles/styles";
import { useAuthenticator } from "@aws-amplify/ui-react-native";
import { fetchAuthSession } from "aws-amplify/auth";


export default function CreateScheduleForm(props) {
    const [title, setTitle] = useState("");
    const {user} = useAuthenticator();
    const dispatch = useDispatch();
    
    async function createSchedule() {
        const session = await fetchAuthSession();
        const accessToken = session.tokens?.accessToken.toString();
        const headers = {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        try {
            await axios.post(serverIP+'/createSchedule', {
                title,
                userUUID: user.userId, 
            }, headers);
            props.close();
            dispatch({type: 'alert/set', payload: {open: true, title: "Timebox", message: "Created schedule!"}});
            await queryClient.refetchQueries();
        } catch(error) {
            props.close();
            dispatch({type: 'alert/set', payload: {open: true, title: "Error", message: "An error occurred, please try again or contact the developer"}});
            
        }
    }

    return (
    <>
        <Portal>
          <Dialog style={styles.forms.dialogStyle} visible={props.visible} onDismiss={props.close}>
            <Dialog.Title style={styles.forms.dialogTitleStyle}>Create Schedule</Dialog.Title>
            <Dialog.Content>
                <TextInput label="Title" testID="scheduleTitle" value={title} onChangeText={setTitle} {...styles.paperInput}/>
            </Dialog.Content>
            <Dialog.Actions>
                <Button testID="createSchedule" {...styles.forms.actionButton} mode="contained" onPress={createSchedule}>Create</Button>
                <Button {...styles.forms.nonActionButton} onPress={props.close}>Close</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
    </>)
}