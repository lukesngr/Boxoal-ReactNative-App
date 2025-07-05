import { useEffect, useRef } from 'react';
import {View, Text, Image} from 'react-native';
import { Animated } from 'react-native';

export default function Erroring() {
    const boxoalSpinning = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(boxoalSpinning, {
                toValue: 100,
                duration: 5000,
                useNativeDriver: true
            })
        ).start();
    }, []);
    const inputRange = [0, 10, 13, 23, 26, 36, 39, 49, 52, 62, 65, 75, 78, 89, 92, 100];
    const outputRange = ['0deg', '45deg', '45deg', '90deg', '90deg', '135deg', '135deg', '180deg', '180deg', '225deg', '225deg', '270deg', '270deg', '315deg', '315deg', '360deg'];

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
            <Animated.View style={{transform: [{rotate: boxoalSpinning.interpolate({inputRange, outputRange})}]}}>
                <Image style={{width: 100, height: 100}} source={require('../assets/icon2.png')} />
            </Animated.View>
            <Text style={{fontSize: 20, color: 'black'}}>Experiencing errors...</Text>
        </View>
    )
}