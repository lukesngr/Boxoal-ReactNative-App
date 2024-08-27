import {Alert, Pressable, Text, View} from 'react-native';
import {styles} from '../../styles/styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { signUp, confirmSignUp } from 'aws-amplify/auth';
import { Button, TextInput } from 'react-native-paper';

export function SignUp({navigation}) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordHidden, setPasswordHidden] = useState(true);
    const [confirmPasswordHidden, setConfirmPasswordHidden] = useState(true);
    const [code, setCode] = useState("")
    const [enteredDetails, setEnteredDetails] = useState(false);
    

    async function verifyCode() {
        const { isSignUpComplete, nextStep } = await confirmSignUp({
            username: username,
            confirmationCode: code,
        });

        if(isSignUpComplete) {
            Alert.alert("Signed up, please login")
            navigation.navigate('Login');
        }
    }

    async function createAccount() {
        const { isSignUpComplete, userId, nextStep } = await signUp({
            username: username,
            password: password,
            options: {
              userAttributes: {
                email: email,
              },
            }
        });

        if(isSignUpComplete) {
            Alert.alert("Signed up")
            navigation.navigate('Login');
        }

        if(nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
            setEnteredDetails(true);
        }
    }

    function resetPassword() {}

    return (
        <>
            <Text style={styles.signInTitle}>Sign Up</Text>
            {enteredDetails ? ( <>
                <TextInput label="Code" value={code} onChangeText={setCode} {...styles.paperInput}></TextInput>
                <Button mode="contained" style={{...styles.welcomeButtonOutlineStyle, marginTop: 20}} onPress={verifyCode}>Verify Code</Button>
            </>) : (<>
                <TextInput label="Email" value={email} onChangeText={setEmail} {...styles.paperInput}></TextInput>
                <TextInput label="Username" value={username} onChangeText={setUsername} {...styles.paperInput}></TextInput>
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
                <Button mode="contained" style={{...styles.welcomeButtonOutlineStyle, marginTop: 20}} onPress={createAccount}>Sign Up</Button>
            </>)
            }
        </>
    )
}