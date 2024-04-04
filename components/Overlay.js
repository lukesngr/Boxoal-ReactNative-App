import { useSelector } from "react-redux";
import { View } from "react-native";

export default function Overlay(props) {
    const overlayDimensions = useSelector(state => state.overlayDimensions.value);

    console.log(overlayDimensions, props.notActive);
    
    return (<>{!props.notActive && <View style={{width: overlayDimensions[0]+"px", 
        height: overlayDimensions[1]+"px", 
        backgroundColor: '#D9D9D9', opacity: 0.7, 
        zIndex: 999, elevation: 100, position: 'absolute', transform: 'translateX(-1px) translateY(1px)'}}></View>}</>);
}