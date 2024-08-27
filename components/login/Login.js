import {Pressable, Text, View} from 'react-native';
import {styles} from '../../styles/styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { Button } from 'react-native-paper';
import { signIn } from 'aws-amplify/auth';
import { TextInput } from 'react-native-paper';

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
        <View style={{width: '90%', marginLeft: '5%'}}>
            <Text style={styles.signInTitle}>Sign In</Text>
            <TextInput label="Username" value={username} onChangeText={setUsername} {...styles.paperInput}></TextInput>
            <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry={passwordHidden} {...styles.paperInput} right={
                <TextInput.Icon
                icon={passwordHidden ? 'eye' : 'eye-off'}
                onPress={() => setPasswordHidden(!passwordHidden)}
                forceTextInputFocus={false}
                />
            }></TextInput>
            <Button mode="contained" style={{...styles.welcomeButtonOutlineStyle, marginTop: 20}} onPress={login}>Sign In</Button>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '90%'}}>
                <Pressable onPress={forgetPassword}>
                    <Text style={styles.signInUnderText}>Forget Password</Text>
                </Pressable>
                <Pressable onPress={createAccount}>
                    <Text style={styles.signInUnderText}>Create Account</Text>
                </Pressable>            
            </View>
        </View>
    )
}