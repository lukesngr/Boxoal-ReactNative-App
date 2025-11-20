import {Alert, Pressable, Text, View} from 'react-native';
import {styles} from '../../styles/styles';
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
    const matchesPasswordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9\s]).{8,}$/;

    async function sendCode() {
        if(username == "") {
            Alert.alert("Please enter a username");
        }else {
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
    }

    async function confirmAndSetPassword() {
        if(confirmationCode == "") {
            Alert.alert("Please enter a code");
        }else if(password == "") {
            Alert.alert("Please enter new password");
        }else if(confirmPassword == "") {
            Alert.alert("Please confirm password");
        }else if(confirmPassword != password) {
            Alert.alert("Please ensure your passwords match");
        }else if(!matchesPasswordPolicy.test(password)) {
            Alert.alert("Please ensure your password has at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character");
        }else{
            try {
                await confirmResetPassword({ username, confirmationCode, newPassword});
                Alert.alert("Password Reset", "Your password has been reset");
                navigation.navigate("Login");
            }catch(error) {
                Alert.alert("Error", error.message);
            }
        }
        
    }

    return (
        <View style={{justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%'}}>
            <View style={{ backgroundColor: styles.primaryColor, width: 300, height: 400, padding: 10}}>
            <Image style={{width: 85, height: 85, marginLeft: 'auto', marginRight: 'auto', display: 'block'}} source={require('../../assets/icon2.png')} />
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
                <Pressable onPress={() => confirmAndSetPassword()}>
                    <View style={{height: 50, backgroundColor: 'black', width: 300, marginTop: 10, marginBottom: 10}}>
                        <Text style={{fontFamily: 'Koulen-Regular', fontSize: 22, color: 'white', textAlign: 'center'}} >Reset Password</Text>
                    </View>
                </Pressable>
            </>) : (<>
                <TextInput label="Username" value={username} onChangeText={setUsername} {...styles.paperInput}></TextInput>
                <Pressable onPress={() => sendCode()}>
                    <View style={{height: 50, backgroundColor: 'black', width: 300, marginTop: 10, marginBottom: 10}}>
                        <Text style={{fontFamily: 'Koulen-Regular', fontSize: 22, color: 'white', textAlign: 'center'}} >Send Code To SMS/Email</Text>
                    </View>
                </Pressable>
            </>)
            }
        </View>
    </View>
    )
}