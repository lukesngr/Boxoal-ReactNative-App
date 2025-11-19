import { View } from "react-native";
import { styles } from "../../styles/styles";
import { Image } from "react-native";
import { Text } from "react-native-paper";
import { Pressable } from "react-native";

export default function LandingPage(props) {
    const {setComponentDisplayed} = props;
    return (
        <View style={{justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%'}}>
        <View style={{ backgroundColor: styles.primaryColor, width: 300, height: 350, padding: 10}}>
            <Image style={{width: 85, height: 85, marginLeft: 'auto', marginRight: 'auto', display: 'block'}} source={require('../../assets/icon2.png')} />
            <Text style={styles.landingLines}>Make Every</Text>
            <Text style={styles.landingLines}>Second Work</Text>
            <Text style={styles.landingLines}>For</Text>
            <Text style={styles.landingLines}>Your Dreams</Text>
            <Pressable onPress={() => setComponentDisplayed('signIn')}>
                <View style={{height: 50, backgroundColor: 'black', width: 300, marginTop: 30, marginBottom: 10}}>
                    <Text style={{fontFamily: 'Koulen-Regular', fontSize: 27, color: 'white', textAlign: 'center'}} >Get Started Timeboxing</Text>
                </View>
            </Pressable>
        </View>
        
        
        </View>
    )
}