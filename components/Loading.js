import {View, Text, Image} from 'react-native';

export default function Loading() {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
            <Image style={{width: 100, height: 100}} source={require('../assets/icon2.png')} />
            <Text style={{fontSize: 20, color: 'black'}}>Loading...</Text>
        </View>
    )
}