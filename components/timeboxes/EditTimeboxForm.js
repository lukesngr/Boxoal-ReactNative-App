import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { StyleSheet, View, Text, Pressable } from "react-native";

const styles = StyleSheet.create({
    overallModal: {
        backgroundColor: 'white',
        padding: 10,
        width: '80%',
        height: 'auto',
    },
    title: {
        color: 'black',
        fontSize: 22,
        padding: 0,
        margin: 0,
    },
    buttonOutlineStyle: {
        backgroundColor: '#7FFFD4',
        padding: 5,
        marginTop: 10,
    },
    buttonTextStyle: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
    },
    titleBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 'auto',
        margin: 0,
        padding: 0,
    },
});

export default function EditTimeboxForm(props) {
    return (
    <View style={styles.overallModal}>
            <View style={styles.titleBarContainer}>  
                <Text style={styles.title}>Edit Timebox</Text>
                <Pressable onPress={props.close}>
                    <FontAwesomeIcon icon={faArrowLeft} size={25}/>
                </Pressable>
            </View>
    </View>)
}