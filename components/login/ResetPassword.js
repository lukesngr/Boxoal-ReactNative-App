import {Alert, Pressable, Text, View} from 'react-native';
import {styles} from '../../styles/styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { confirmResetPassword, resetPassword } from 'aws-amplify/auth';
import { Button, TextInput } from 'react-native-paper';
import { set } from '../../redux/activeOverlayInterval';

export function ResetPassword({navigation}) {
    const [confirmPasswordHidden, setConfirmPasswordHidden] = useState(true);
    const [passwordHidden, setPasswordHidden] = useState(true);
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [codeSent, setCodeSent] = useState(false);
    const [username, setUsername] = useState("");

    async function sendCode() {
        Alert.alert("Code Sent", "Check your email for the code");
        try {
            const output = await resetPassword({ username });
            console.log(output);
            if(output.nextStep.resetPasswordStep == 'CONFIRM_RESET_PASSWORD_WITH_CODE') {
                setCodeSent(true);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function confirmAndSetPassword() {
        setCodeSent(true);
        try {
            const output = await confirmResetPassword({ username, code, newPassword: password });
            if(output.nextStep.resetPasswordStep == 'DONE') {
                Alert.alert("Password Reset", "Your password has been reset");
                navigation.navigate("SignIn");
            }
        }catch(error) {
            console.log(error);
        }
        
    }

    return (
        <>
            <Text style={styles.signInTitle}>Reset Password</Text>
            {codeSent ? ( <>
                <TextInput label="Code" value={code} onChangeText={setCode} {...styles.paperInput}></TextInput>
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
                <Button mode="contained" style={{...styles.welcomeButtonOutlineStyle, marginTop: 20}} onPress={confirmAndSetPassword}>Reset Password</Button>
            </>) : (<>
                <TextInput label="Username" value={username} onChangeText={setUsername} {...styles.paperInput}></TextInput>
                <Button mode="contained" style={{...styles.welcomeButtonOutlineStyle, marginTop: 20}} onPress={sendCode}>Send Code To SMS/Email</Button>
            </>)
            }
        </>
    )
}