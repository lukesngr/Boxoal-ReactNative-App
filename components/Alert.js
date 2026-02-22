import { Paragraph, Button, Dialog } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";

export default function Alert() {
    const {open, title, message} = useSelector(state => state.alert.value);
    const dispatch = useDispatch();
    return (
        <Dialog style={{backgroundColor: '#875F9A', position: 'absolute', width: '90%'}} visible={open} 
		onDismiss={() => dispatch({type: 'alert/set', payload: {open: false, title: '', message: ''}})}>
            <Dialog.Title style={{color: 'white'}}>{title}</Dialog.Title>
            <Dialog.Content>
                <Paragraph style={{color: 'white'}} testID='alertMessage'>
                    {message}
                </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
                <Button textColor="white" testID="closeAlert" 
			onPress={() => dispatch({type: 'alert/set', payload: {open: false, title: '', message: ''}})}>Close</Button>
            </Dialog.Actions>
        </Dialog>
    )
}
