import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { useState, useEffect } from 'react';
import { LandingTimeboxingBackground } from '../components/login/LandingTimeboxingBackground';
import LandingPage from '../components/login/LandingPage';
import { Login } from '../components/login/Login';
import { ResetPassword } from '../components/login/ResetPassword';

export default function Auth({navigation}) {
    const { authStatus } = useAuthenticator();
    const [componentDisplayed, setComponentDisplayed] = useState("landing");

    useEffect(() => {
        if(authStatus == 'authenticated') { navigation.navigate('FinalView'); }
    }, [authStatus]);

    return (
            <>
                
                <LandingTimeboxingBackground>
                {componentDisplayed == "landing" && <LandingPage setComponentDisplayed={setComponentDisplayed} />}
                {componentDisplayed == "signIn" && <Login setComponentDisplayed={setComponentDisplayed} />}
                {/*{componentDisplayed == "createAccount" && <CreateAccountCard setComponentDisplayed={setComponentDisplayed} />}*/}
                {componentDisplayed == "forgotPassword" && <ResetPassword setComponentDisplayed={setComponentDisplayed} />}
                </LandingTimeboxingBackground>
    </>)
}