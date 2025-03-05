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
    const matchesPasswordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9\s]).{8,}$/;
    const noAtSymbol = /^[^@]*$/;
    

    async function verifyCode() {
        if(code == "") {
            Alert.alert("Please enter a code");
        }else{}
            const { isSignUpComplete, nextStep } = await confirmSignUp({
                username: username,
                confirmationCode: code,
            });
        }


        if(isSignUpComplete) {
            Alert.alert("Signed up, please login")
            navigation.navigate('Login');
        }
    }

    async function createAccount() {
        if(noAtSymbol.test(email) || username == "" || password == "" || confirmPassword == "") {
            if(noAtSymbol.test(email)) {
                Alert.alert("Please enter a valid email address");
            }

            if(username == "") {
                Alert.alert("Please enter a username");
            }
            
            if(password == "") {
                Alert.alert("Please enter new password");
            }
            
            if(confirmPassword == "") {
                Alert.alert("Please confirm password");
            } 
        }else if(!matchesPasswordPolicy.test(password)) {
            Alert.alert("Please ensure that the two passwords match");
        }else if(password != confirmPassword) {
            Alert.alert("Please ensure your password has at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character");
        }else {
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
    }

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