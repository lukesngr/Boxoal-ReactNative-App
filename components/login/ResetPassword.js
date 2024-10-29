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
    const [confirmationCode, setConfirmationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [codeSent, setCodeSent] = useState(false);
    const [username, setUsername] = useState("");

    async function sendCode() {
        Alert.alert("Code Sent", "Check your email for the code");
        try {
            const output = await resetPassword({ username });
            if(output.nextStep.resetPasswordStep == 'CONFIRM_RESET_PASSWORD_WITH_CODE') {
                setCodeSent(true);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function confirmAndSetPassword() {
        try {
            await confirmResetPassword({ username, confirmationCode, newPassword});
            Alert.alert("Password Reset", "Your password has been reset");
            navigation.navigate("Login");
        }catch(error) {
            Alert.alert("Error", error.message);
        }
        
    }

    return (
        <>
            <Text style={styles.signInTitle}>Reset Password</Text>
            {codeSent ? ( <>
                <TextInput label="Code" value={confirmationCode} onChangeText={setConfirmationCode} {...styles.paperInput}></TextInput>
                <TextInput label="Password" value={newPassword} onChangeText={setNewPassword} secureTextEntry={passwordHidden} {...styles.paperInput} right={
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