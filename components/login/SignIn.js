import {Text, TextInput} from 'react-native';
import {styles} from '../../styles/styles';

export function SignIn() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <>
            <Text style={styles.signInTitle}>Sign In</Text>
            <Text style={styles.signInLabel}>Username</Text>
            <TextInput style={styles.signInTextInput} onChangeText={setUsername} value={username}></TextInput>
            <Text style={styles.signInLabel}>Password</Text>
            <TextInput style={styles.signInTextInput} onChangeText={setPassword} value={password}></TextInput>
        </>
    )
}