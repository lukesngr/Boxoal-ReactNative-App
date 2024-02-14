import { Pressable, StyleSheet, Text } from "react-native";
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

export default function SignInButton() {

    return (
        <Pressable style={styles.signInButton} onPress={() =>  console.log("yea")}>
           <Text style={styles.signInButtonText}>Join Us</Text>
        </Pressable>
    )
}