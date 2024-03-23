import {View, Text, Image} from 'react-native';

export default function Loading() {
    return (
        <View style={{display: 'flex', justifyContentCenter: 'center', alignItems: 'center', flexDirection: 'column'}}>
            <Image source={require('../assets/icon2.png')} />
            <Text style={{fontSize: 20}}>Loading...</Text>
        </View>
    )
}