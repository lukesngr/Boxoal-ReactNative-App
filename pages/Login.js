import {useDispatch} from 'react-redux';
import axios from 'axios';
import {Text} from 'react-native';

export default function Login({ navigation, route }) {
    const { accessToken } = route.params;
    const dispatch = useDispatch();
    axios.get('https://api.github.com/user/emails', {
      headers: {
        Authorization: `token ${accessToken}`
      }
    }).then(response => {
      dispatch({type: 'username/set', payload: response.data[0].email});
      navigation.navigate('FinalView');
    }).catch(err => {
      console.log(err);
    });
    return <><Text>Login Successful!</Text></>
}