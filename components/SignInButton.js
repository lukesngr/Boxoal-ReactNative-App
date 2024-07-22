import { Pressable, StyleSheet, Text, Linking } from "react-native";
import { styles } from "../styles/styles";

export default function SignInButton(props) {

    return (
        <Pressable style={styles.signInButton} onPress={props.signIn}>
           <Text style={styles.signInButtonText}>Join Us</Text>
        </Pressable>
    )
}