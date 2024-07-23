import {Pressable, Text, TextInput, View} from 'react-native';
import {styles} from '../../styles/styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import Button from '../timeboxes/Button';
import { signIn } from 'aws-amplify/auth';

export function Login({ navigation }) {
    const [passwordHidden, setPasswordHidden] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function login() {
        let result;
        try {
            result = await signIn({
                username: username,
                password: password,
            })
        } catch (error) {
            console.log(error.underlyingError)
        }

        if(result.nextStep?.signInStep === 'DONE') {
            navigation.navigate('FinalView');
        }
    }

    function createAccount() {
        navigation.navigate('SignUp')
    }

    function forgetPassword() {
        navigation.navigate('ResetPassword');
    }

    return (
        <>
            <Text style={styles.signInTitle}>Sign In</Text>
            <Text style={styles.signInLabel}>Username</Text>
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