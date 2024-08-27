import {Alert, Pressable, Text, View} from 'react-native';
import {styles} from '../../styles/styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { signIn } from 'aws-amplify/auth';
import { Button, TextInput } from 'react-native-paper';

export function ResetPassword({navigation}) {
    const [confirmPasswordHidden, setConfirmPasswordHidden] = useState(true);
    const [passwordHidden, setPasswordHidden] = useState(true);
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [enteredCode, setEnteredCode] = useState(false);
    const [email, setEmail] = useState("");

    async function sendCodeToEmail() {
        Alert.alert("Code Sent", "Check your email for the code");
       
    }

    function verifyCode() {
        setEnteredCode(true);
    }

    function resetPassword() {}

    return (
        <>
            <Text style={styles.signInTitle}>Reset Password</Text>
            {enteredCode ? ( <>
                <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry={passwordHidden} {...styles.paperInput} right={
                    <TextInput.Icon
                    icon={passwordHidden ? 'eye' : 'eye-off'}
                    onPress={() => setPasswordHidden(!passwordHidden)}
                    forceTextInputFocus={false}
                    />}>
                </TextInput>
                <TextInput label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={confirmPasswordHidden} {...styles.paperInput} right={
                    <TextInput.Icon
                    icon={confirmPasswordHidden ? 'eye' : 'eye-off'}
                    onPress={() => setConfirmPasswordHidden(!confirmPasswordHidden)}
                    forceTextInputFocus={false}
                    />}>
                </TextInput>
                <Button mode="contained" style={{...styles.welcomeButtonOutlineStyle, marginTop: 20}} onPress={resetPassword}>Reset Password</Button>
            </>) : (<>
                <TextInput label="Email" value={email} onChangeText={setEmail} {...styles.paperInput}></TextInput>
                
                <TextInput label="Code" value={code} onChangeText={setCode} {...styles.paperInput}></TextInput>
                <Button mode="contained" style={{...styles.welcomeButtonOutlineStyle, marginTop: 20}} onPress={sendCodeToEmail}>Send Code To Email</Button>
                <Button mode="contained" style={{...styles.welcomeButtonOutlineStyle, marginTop: 20}} onPress={verifyCode}>Verify Code</Button>
            </>)
            }
        </>
    )
}