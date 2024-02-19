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

export default function SignInButton() {

    async function SignIn() {
        const state = 'ipzmuRVqYj5r9LiNPks2dVsMR7XFNInHXWFYMxSC0'
        const clientId = 'a2dfc2d05c3a866886b7'
        const allowSignup = true
    
        const url=`https://github.com/login/oauth/authorize?client_id=${clientId}&state=${state}&allow_signup=${allowSignup}`
    
        await Linking.openURL(url);
    }

    return (
        <Pressable style={styles.signInButton} onPress={() =>  SignIn()}>
           <Text style={styles.signInButtonText}>Join Us</Text>
        </Pressable>
    )
}