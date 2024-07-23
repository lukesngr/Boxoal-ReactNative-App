import {Pressable, Text, TextInput, View} from 'react-native';
import {styles} from '../../styles/styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { signIn } from 'aws-amplify/auth';
import Button from '../timeboxes/Button';

export function SignIn() {
    const [confirmPasswordHidden, setConfirmPasswordHidden] = useState(true);
    const [passwordHidden, setPasswordHidden] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function sendCodeToEmail() {
    }

    function createAccount() {}

    function forgetPassword() {}

    return (
        <>
            <Text style={styles.signInTitle}>Reset Password</Text>
            <Button textStyle={styles.buttonTextStyle} outlineStyle={styles.signInButtonOutlineStyle} title="Send Code to Email" onPress={sendCodeToEmail} />
            <Text style={styles.signInLabel}>Enter your code: </Text>
            <TextInput style={styles.signInTextInput} onChangeText={setUsername} value={username}></TextInput>
            <Text style={styles.signInLabel}>Password</Text>
            <View style={{flexDirection: 'row'}}>
                <TextInput secureTextEntry={passwordHidden} style={styles.signInTextInput} onChangeText={setPassword} value={password}></TextInput>
                <Pressable onPress={() => setPasswordHidden(!passwordHidden)}>
                    <FontAwesomeIcon style={{ transform: [{translateX: -35}]}} icon={passwordHidden ? faEye : faEyeSlash} size={30} ></FontAwesomeIcon>
                </Pressable>
            </View>
            <Button textStyle={styles.buttonTextStyle} outlineStyle={styles.signInButtonOutlineStyle} title="Sign In" onPress={login} />
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '90%'}}>
                <Pressable onPress={forgetPassword}>
                    <Text style={styles.signInUnderText}>Forget Password</Text>
                </Pressable>
                <Pressable onPress={createAccount}>
                    <Text style={styles.signInUnderText}>Create Account</Text>
                </Pressable>            
            </View>
        </>
    )
}