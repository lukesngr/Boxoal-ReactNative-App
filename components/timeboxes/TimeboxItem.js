import { Text, Checkbox, Surface } from "react-native-paper";
import axios from "axios";
import { queryClient } from "../../App";
import serverIP from "../../modules/serverIP";
import { set } from "../../redux/activeOverlayInterval";

export default function TimeboxItem(props) {
    const [checked, setChecked] = useState(props.timebox.recordedTimeBoxes.length > 0);

    function completeTimebox() {
        axios.post(serverIP+'/createRecordedTimebox', {
            recordedStartTime: props.timebox.startTime, 
            recordedEndTime: props.timebox.endTime,
            timeBox: {connect: {id: props.timebox.id}}, 
            schedule: {connect: {id: props.scheduleID}}
        }).then(() => {
            queryClient.refetchQueries();
        }).catch(function(error) {
            console.log(error); 
        })  
    }

    function deleteTimebox() {
        
        axios.post(serverIP+'/deleteTimebox', {id: props.timebox.id}).then(
            async () => { await queryClient.refetchQueries();}
        ).catch(function(error) {
            console.log(error); 
        });
    }

    return (
    <Surface style={{paddingLeft: 40, flexDirection: 'row', paddingBottom: 15, backgroundColor: 'white'}}>
        <Text style={{color: 'black', fontSize: 20, width: 265, paddingTop: 10}}>{props.timebox.title}</Text>
        <Checkbox 
            color='black' 
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => {
                if(checked) {
                    deleteTimebox();
                    setChecked(false);
                } else {
                    completeTimebox();
                    setChecked(true);
                }
            }}/>
    </Surface>
    )
}