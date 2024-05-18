import { useSelector } from "react-redux";
import { View } from "react-native";

export default function ActiveOverlay() {
    const overlayDimensions = useSelector(state => state.overlayDimensions.value);
    const activeOverlayHeight = useSelector(state => state.activeOverlayHeight.value);
    console.log(activeOverlayHeight);
    return <View style={{width: overlayDimensions[0], height: activeOverlayHeight, backgroundColor: '#D9D9D9', opacity: 1, 
    zIndex: 999, top: 0, position: 'absolute', transform: [{translateY: overlayDimensions[3]}]}}></View>
}