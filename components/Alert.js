import { Paragraph, Button, Dialog } from "react-native-paper";

export default function Alert(props) {
    return (
        <Dialog style={{backgroundColor: '#D9D9D9'}} visible={props.visible} onDismiss={props.close}>
            <Dialog.Title>{props.title}</Dialog.Title>
            <Dialog.Content>
                <Paragraph testID='alertMessage'>
                    {props.message}
                </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
                <Button textColor="black" testID="closeAlert" onPress={props.close}>Close</Button>
            </Dialog.Actions>
        </Dialog>
    )
}