import { useSelector } from "react-redux";
import { View } from "react-native";

export default function Overlay(props) {
    const overlayDimensions = useSelector(state => state.overlayDimensions.value);
    
    return (<>{!props.notActive && <View style={{width: overlayDimensions[0], 
        height: overlayDimensions[1], 
        backgroundColor: '#D9D9D9', opacity: 1, 
        zIndex: 998, elevation: 1, top: 0, position: 'absolute', transform: [{translateY: overlayDimensions[3]}]}}></View>}</>);
}