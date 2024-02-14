import { Pressable, StyleSheet, Text } from "react-native";
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { useEffect } from "react";

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
};

const styles = StyleSheet.create({
    signInButton: {
        backgroundColor: '#7FFFD4',
        borderColor: 'black',
        borderWidth: 1,
        marginTop: 80,
    },
    signInButtonText: {
        color: 'black',
        fontSize: 25,
        textAlign: 'center',
    }
});

export default function SignInButton() {

    const [request, response, promptAsync] = useAuthRequest(
        {
          clientId: 'a2dfc2d05c3a866886b7',
          scopes: ['identity'],
          redirectUri: makeRedirectUri({
            scheme: 'boxoal'
          }),
        },
        discovery
      );
    
      useEffect(() => {
        if (response?.type === 'success') {
          const { code } = response.params;
        }
      }, [response]);

    return (
        <Pressable style={styles.signInButton} onPress={() =>  promptAsync()}>
           <Text style={styles.signInButtonText}>Join Us</Text>
        </Pressable>
    )
}