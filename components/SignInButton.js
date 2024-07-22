import { Pressable, StyleSheet, Text, Linking } from "react-native";
import { useEffect } from "react";

const styles = StyleSheet.create({
    signInButton: {
        backgroundColor: '#7FFFD4',
        borderColor: 'black',
        borderWidth: 1,
        marginTop: 80,
    },
    signInButtonText: {
        color: 'black',
        fontSize: 25,
        textAlign: 'center',
    }
});

export default function SignInButton(props) {

    return (
        <Pressable style={styles.signInButton} onPress={props.signIn}>
           <Text style={styles.signInButtonText}>Join Us</Text>
        </Pressable>
    )
}