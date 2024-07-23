import {Alert, Pressable, Text, TextInput, View} from 'react-native';
import {styles} from '../../styles/styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { signUp, confirmSignUp } from 'aws-amplify/auth';
import Button from '../timeboxes/Button';

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
                
                <Text style={styles.signInLabel}>Code </Text>
                <TextInput style={styles.signInTextInput} onChangeText={setCode} value={code}></TextInput>
                <Button textStyle={styles.buttonTextStyle} outlineStyle={styles.signInButtonOutlineStyle} title="Verify Code" onPress={verifyCode} />
            </>) : (<>
                <Text style={styles.signInLabel}>Email</Text>
                <TextInput style={styles.signInTextInput} onChangeText={setEmail} value={email}></TextInput>
                <Text style={styles.signInLabel}>Username</Text>
                <TextInput style={styles.signInTextInput} onChangeText={setUsername} value={username}></TextInput>
                <Text style={styles.signInLabel}>Password</Text>
                <View style={{flexDirection: 'row'}}>
                    <TextInput secureTextEntry={passwordHidden} style={styles.signInTextInput} onChangeText={setPassword} value={password}></TextInput>
                    <Pressable onPress={() => setPasswordHidden(!passwordHidden)}>
                        <FontAwesomeIcon style={{ transform: [{translateX: -35}]}} icon={passwordHidden ? faEye : faEyeSlash} size={30} ></FontAwesomeIcon>
                    </Pressable>
                </View>
                <Text style={styles.signInLabel}>Confirm Password</Text>
                <View style={{flexDirection: 'row'}}>
                    <TextInput secureTextEntry={confirmPasswordHidden} style={styles.signInTextInput} onChangeText={setConfirmPassword} value={confirmPassword}></TextInput>
                    <Pressable onPress={() => setConfirmPassword(!confirmPasswordHidden)}>
                        <FontAwesomeIcon style={{ transform: [{translateX: -35}]}} icon={confirmPasswordHidden ? faEye : faEyeSlash} size={30} ></FontAwesomeIcon>
                    </Pressable>
                </View>
                <Button textStyle={styles.buttonTextStyle} outlineStyle={styles.signInButtonOutlineStyle} title="Sign Up" onPress={createAccount} />
                
            </>)
            }
        </>
    )
}