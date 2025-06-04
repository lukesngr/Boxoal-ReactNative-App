
import axios from "axios";
import { useState } from "react";
import serverIP from "../../modules/serverIP";
import { queryClient } from '../../modules/queryClient.js';

import { Dialog, Portal, TextInput, Button } from "react-native-paper";
import Alert from "../Alert";
import { styles } from "../../styles/styles";
import { useAuthenticator } from "@aws-amplify/ui-react-native";

export default function CreateScheduleForm(props) {
    const [title, setTitle] = useState("");
    const [alert, setAlert] = useState({shown: false, title: "", message: ""});
    const {user} = useAuthenticator();
    
    async function createSchedule() {
        axios.post(serverIP+'/createSchedule', {
            title,
            userUUID: user.userId, 
        }).then(async () => {
            props.close();
            setAlert({shown: true, title: "Timebox", message: "Created schedule!"});
            await queryClient.refetchQueries();
        }).catch(function(error) {
            props.close();
            setAlert({shown: true, title: "Error", message: "An error occurred, please try again or contact the developer"});
            console.log(error); 
        })
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
            {alert.shown && <Alert visible={alert.shown} close={() => setAlert({...alert, shown: false})} title={alert.title} message={alert.message}/> }
        </Portal>
    </>)
}