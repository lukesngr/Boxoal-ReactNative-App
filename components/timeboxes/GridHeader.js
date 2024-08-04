import { Text, View } from "react-native";
import ActiveOverlay from "../overlay/ActiveOverlay";
import RecordingOverlay from "../overlay/RecordingOverlay";
import { ifCurrentDay, ifEqualOrBeyondCurrentDay } from "../../modules/dateLogic";
import Overlay from "../overlay/Overlay";
import { getCurrentDay } from "../../modules/dateLogic";

export default function GridHeader(props) {
    const onDayView = useSelector(state => state.onDayView.value);
    let dayToName = props.dayToName;
    let overridingStyles = [{}, {}];

    if(onDayView) {
        dayToName = [dayToName[getCurrentDay()]]; 
        overridingStyles = [{width: 49}, {fontSize: 25}];
    } 

    return (<>
        {dayToName.map((day, index) => {
            return (<>
            <View style={{...styles.timeboxCell, ...overridingStyles[0]}}></View>
            <View key={day.day} style={{backgroundColor: ifCurrentDay(day.day, 'black', 'white'), ...styles.timeboxCell}}
                        onLayout={(event) => {
                            if(index == 0) {
                                setHeaderHeight(event.nativeEvent.layout.height);
                                setHeaderWidth(event.nativeEvent.layout.width);
                            }
                        }}>
                <Text style={{fontSize: 16, color: ifCurrentDay(day.day, 'white', 'black'), ...overridingStyles[1]}}>{day.name+" ("+day.date+"/"+day.month+")"}</Text>
                {ifCurrentDay(day.day, true, false) && <ActiveOverlay></ActiveOverlay>}
                {ifEqualOrBeyondCurrentDay(day.day, false, true) && <Overlay></Overlay>}
                <RecordingOverlay day={day}></RecordingOverlay>
            </View></>)
        })}
    </>)
}