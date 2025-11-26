import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { useState, useEffect } from 'react';
import { LandingTimeboxingBackground } from '../components/login/LandingTimeboxingBackground';
import LandingPage from '../components/login/LandingPage';
import { Login } from '../components/login/Login';
import { ResetPassword } from '../components/login/ResetPassword';
import Alert from "../components/Alert";
import { useSelector } from 'react-redux';

export default function Auth({navigation}) {
    const { authStatus } = useAuthenticator();
    const [componentDisplayed, setComponentDisplayed] = useState("landing");
    const {open, title, message} = useSelector(state => state.alert.value);

    useEffect(() => {
        if(authStatus == 'authenticated') { navigation.navigate('FinalView'); }
    }, [authStatus]);

    return (
    <>
        <Alert open={open} title={title} message={message} close={() => dispatch({type: 'alert/set', payload: { open: false, title: "", message: "" }})}></Alert>
        <LandingTimeboxingBackground>
        {componentDisplayed == "landing" && <LandingPage setComponentDisplayed={setComponentDisplayed} />}
        {componentDisplayed == "signIn" && <Login setComponentDisplayed={setComponentDisplayed} />}
        {componentDisplayed == "createAccount" && <ResetPassword setComponentDisplayed={setComponentDisplayed} />}
        {componentDisplayed == "forgotPassword" && <ResetPassword setComponentDisplayed={setComponentDisplayed} />}
        </LandingTimeboxingBackground>
    </>)
}