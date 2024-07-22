import { StyleSheet, Text, View } from 'react-native';
import { Animated, Easing } from 'react-native';
import { useEffect, useRef } from 'react';
import SignInButton from '../components/SignInButton';
import {useSelector} from 'react-redux';
import { Pressable } from 'react-native';

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        paddingTop: 200,
        backgroundColor: '#fff',
        paddingLeft: 40,
        paddingRight: 40,
    },
    textContainer: {
      overflow: 'hidden',
      borderRightWidth: 8,
    },
    splashText: {
      fontSize: 50,
      fontFamily: 'BlueScreen',
      color: 'black'
    },
});

function stepFunction(steps, t) {
    let stepSize = 1 / 20.0;
    return Math.floor(t / stepSize)*stepSize;
}

const firstStepFunction = (t) => stepFunction(20.0, t);
const secondStepFunction = (t) => stepFunction(14.0, t);
const thirdStepFunction = (t) => stepFunction(16.0, t);

export default function SplashScreen({navigation}) {

  const username = useSelector(state => state.username.value);

  const firstLineDisplayed = useRef(new Animated.Value(0)).current;
  const secondLineDisplayed = useRef(new Animated.Value(0)).current;
  const thirdLineDisplayed = useRef(new Animated.Value(0)).current;

  const blinkingCaretOne = useRef(new Animated.Value(0)).current;
  const blinkingCaretTwo = useRef(new Animated.Value(0)).current;
  const blinkingCaretThree = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if(username != '') {
      navigation.navigate('FinalView');
    }
    Animated.sequence([
      Animated.timing(firstLineDisplayed, {
        toValue: 100,
        useNativeDriver: false,
        duration: 2000,
        easing: firstStepFunction
      }),
      Animated.timing(secondLineDisplayed, {
        toValue: 100,
        useNativeDriver: false,
        duration: 2000,
        easing: secondStepFunction
      }),
      Animated.timing(thirdLineDisplayed, {
        toValue: 100,
        useNativeDriver: false,
        duration: 2000,
        easing: thirdStepFunction
      })
    ]).start();

    Animated.sequence([
      Animated.loop(
        Animated.sequence([
          Animated.timing(blinkingCaretOne, {
            toValue: 1,
            useNativeDriver: false,
            duration: 500,
            easing: Easing.linear
          }),
          Animated.timing(blinkingCaretOne, {
            toValue: 0,
            useNativeDriver: false,
            duration: 0
          })
        ]),
        { iterations: 4 }
      ), 
      Animated.loop(
        Animated.sequence([
          Animated.timing(blinkingCaretTwo, {
            toValue: 1,
            useNativeDriver: false,
            duration: 500,
            easing: Easing.linear
          }),
          Animated.timing(blinkingCaretTwo, {
            toValue: 0,
            useNativeDriver: false,
            duration: 0
          })
        ]),
        { iterations: 4 }
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(blinkingCaretThree, {
            toValue: 1,
            useNativeDriver: false,
            duration: 500,
            easing: Easing.linear
          }),
          Animated.timing(blinkingCaretThree, {
            toValue: 0,
            useNativeDriver: false,
            duration: 0
          })
        ]),
        { iterations: 4 }
      )
    ]).start();
  });

  return (
  <View style={styles.container}>
    <Animated.View style={[styles.textContainer, {width: firstLineDisplayed.interpolate({inputRange: [0, 100], outputRange: ['0%', '100%']}),
    borderRightColor: blinkingCaretOne.interpolate({inputRange: [0, 0.5, 0.6, 1], outputRange: ['transparent', 'transparent', '#7FFFD4', '#7FFFD4']})}]}>
      <Text numberOfLines={1} style={styles.splashText}>Timeboxing</Text>
    </Animated.View>
    <Animated.View style={[styles.textContainer, {width: secondLineDisplayed.interpolate({inputRange: [0, 100], outputRange: ['0%', '100%']}),
    borderRightColor: blinkingCaretTwo.interpolate({inputRange: [0, 0.5, 0.6, 1], outputRange: ['transparent', 'transparent', '#7FFFD4', '#7FFFD4']})}]}>
      <Text  numberOfLines={1} style={styles.splashText}>For The</Text>
    </Animated.View>
    <Animated.View style={[styles.textContainer, {width: thirdLineDisplayed.interpolate({inputRange: [0, 100], outputRange: ['0%', '100%']}),
    borderRightColor: blinkingCaretThree.interpolate({inputRange: [0, 0.5, 0.6, 1], outputRange: ['transparent', 'transparent', '#7FFFD4', '#7FFFD4']})}]}>
      <Text numberOfLines={1} style={styles.splashText}>Everyman</Text>
    </Animated.View>
    <SignInButton signIn={() => navigation.navigate('Login')}></SignInButton>
  </View>
  );
}