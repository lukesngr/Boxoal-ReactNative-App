import {Pressable, Text, View} from 'react-native';
import {styles} from '../../styles/styles';
import { useState } from 'react';
import { Button } from 'react-native-paper';
import { signIn } from 'aws-amplify/auth';
import { TextInput } from 'react-native-paper';
import { Alert } from 'react-native';
import { Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export function Login({setComponentDisplayed}) {
    const dispatch = useDispatch();
    const [passwordHidden, setPasswordHidden] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function login() {
        if(username != "" && password != "") {
            try {
                const result = await signIn({username, password});
                setComponentDisplayed("signIn");
            } catch (error) {
                dispatch({type: 'alert/set', payload: { open: true, title: "Error", message: error.message }});
            }
        }else if(username == "") {
            dispatch({type: 'alert/set', payload: { open: true, title: "Error", message: "Username is required"}});
        }else if(password == "") {
            dispatch({type: 'alert/set', payload: { open: true, title: "Error", message: "Password is required"}});
        }
    }

    return (
        <View style={{justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%'}}>
            <View style={{ backgroundColor: styles.primaryColor, width: 300, height: 425, padding: 10}}>
                <Image style={{width: 85, height: 85, marginLeft: 'auto', marginRight: 'auto', display: 'block'}} source={require('../../assets/icon2.png')} />
                <Text style={styles.signInTitle}>Sign In</Text>
                <TextInput label="Username" testID='loginUsername' value={username} onChangeText={setUsername}  {...styles.paperInput} ></TextInput>
                <TextInput label="Password" testID='loginPassword' value={password} onChangeText={setPassword}  {...styles.paperInput} secureTextEntry={passwordHidden} right={
                    <TextInput.Icon
                    icon={passwordHidden ? 'eye' : 'eye-off'}
                    onPress={() => setPasswordHidden(!passwordHidden)}
                    forceTextInputFocus={false}
                    />
                }></TextInput>
                <Pressable onPress={() => login()}>
                    <View style={{height: 50, backgroundColor: 'black', width: 300, marginTop: 10, marginBottom: 10}}>
                        <Text style={{fontFamily: 'Koulen-Regular', fontSize: 22, color: 'white', textAlign: 'center'}} >Sign In</Text>
                    </View>
                </Pressable>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                    <Pressable onPress={() => setComponentDisplayed('forgotPassword')}>
                        <Text style={styles.signInUnderText}>Forget Password</Text>
                    </Pressable>
                    <Pressable onPress={() => setComponentDisplayed('createAccount')}>
                        <Text style={styles.signInUnderText}>Create Account</Text>
                    </Pressable>            
                </View>
            </View>
        </View>
    )
}
