import { Amplify } from "aws-amplify"

export function configureAmplify() {

    Amplify.configure({
        Auth: {
            Cognito: {
            userPoolId: "ap-southeast-2_ECFGGKxov",
            userPoolClientId: "2eu8i9mj20p0lrn5rv5bi8vuhi",
            loginWith: {
                email: true,
                username: true
            },
            signUpVerificationMethod: "email",
            userAttributes: {
                username: {
                required: true,
                },
            },
            passwordFormat: {
                minLength: 8,
                requireLowercase: true,
                requireUppercase: true,
                requireNumbers: true,
                requireSpecialCharacters: true,
            },
            },
        },
    })
}