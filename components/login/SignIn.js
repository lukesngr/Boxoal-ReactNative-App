import {Text, TextInput} from 'react-native';
import {styles} from '../../styles/styles';

export function SignIn() {
    return (
        <>
            <Text style={styles.signInTitle}>Sign In</Text>
            <Text style={styles.signInLabel}>Title</Text>
            <TextInput style={styles.signInTextInput}></TextInput>
        </>
    )
}