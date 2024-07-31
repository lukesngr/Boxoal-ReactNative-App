import { View } from "react-native";
import { Text, Checkbox, Surface } from "react-native-paper";
import { useState } from "react";

export default function TimeboxItem(props) {
    const [checked, setChecked] = useState(false);
    return (
         <Surface style={{paddingLeft: 40, flexDirection: 'row', paddingBottom: 15, backgroundColor: 'white'}}>
            <Text style={{color: 'black', fontSize: 20, width: 265, paddingTop: 10}}>{props.timebox.title}</Text>
            <Checkbox color='black' status={checked ? 'checked' : 'unchecked'} onPress={() => {setChecked(!checked);}}/>
         </Surface>
    )
}