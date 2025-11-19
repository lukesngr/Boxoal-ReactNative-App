import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { useState, useEffect } from 'react';
import { LandingTimeboxingBackground } from '../components/login/LandingTimeboxingBackground';

export default function Auth() {
    const { authStatus } = useAuthenticator();
    const [componentDisplayed, setComponentDisplayed] = useState("landing");

    useEffect(() => {
        if(authStatus == 'authenticated') { navigation.navigate('FinalView'); }
    }, [authStatus]);

    return (
            <>
                
                <LandingTimeboxingBackground>
                {/*{componentDisplayed == "landing" && <LandingPage setComponentDisplayed={setComponentDisplayed} />}
                {componentDisplayed == "signIn" && <SignInCard setComponentDisplayed={setComponentDisplayed} />}
                {componentDisplayed == "createAccount" && <CreateAccountCard setComponentDisplayed={setComponentDisplayed} />}
                {componentDisplayed == "forgotPassword" && <ForgotPasswordCard setComponentDisplayed={setComponentDisplayed} />}*/}
                </LandingTimeboxingBackground>
    </>)
}