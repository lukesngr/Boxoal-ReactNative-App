import {Pressable, Text, TextInput, View} from 'react-native';
import {styles} from '../../styles/styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { signIn } from 'aws-amplify/auth';
import Button from '../timeboxes/Button';

export function ResetPassword() {
    const [confirmPasswordHidden, setConfirmPasswordHidden] = useState(true);
    const [passwordHidden, setPasswordHidden] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [enteredCode, setEnteredCode] = useState(false);

    function sendCodeToEmail() {
    }

    function createAccount() {}

    function forgetPassword() {}

    return (
        <>
            <Text style={styles.signInTitle}>Reset Password</Text>
            {enteredCode ? ( <>
                <Text style={styles.signInLabel}>Password</Text>
                <View style={{flexDirection: 'row'}}>
                    <TextInput secureTextEntry={passwordHidden} style={styles.signInTextInput} onChangeText={setPassword} value={password}></TextInput>
                    <Pressable onPress={() => setPasswordHidden(!passwordHidden)}>
                        <FontAwesomeIcon style={{ transform: [{translateX: -35}]}} icon={passwordHidden ? faEye : faEyeSlash} size={30} ></FontAwesomeIcon>
                    </Pressable>
                </View>
                <Button textStyle={styles.buttonTextStyle} outlineStyle={styles.signInButtonOutlineStyle} title="Sign In" onPress={login} />
            </>) : (<>
                <Button textStyle={styles.buttonTextStyle} outlineStyle={styles.signInButtonOutlineStyle} title="Send Code to Email" onPress={sendCodeToEmail} />
                <Text style={styles.signInLabel}>Enter your Code: </Text>
                <TextInput style={styles.signInTextInput} onChangeText={setUsername} value={username}></TextInput>
            </>)
            }
        </>
    )
}