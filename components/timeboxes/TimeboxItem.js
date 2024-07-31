import { View } from "react-native";
import { Text, Checkbox } from "react-native-paper";
import { useState } from "react";

export default function TimeboxItem(props) {
    const [checked, setChecked] = useState(false);
    return (
         <View style={{marginLeft: 40, flexDirection: 'row', paddingBottom: 15}}>
            <Text style={{color: 'black', fontSize: 20, width: 265, paddingTop: 10}}>{props.timebox.title}</Text>
            <Checkbox status={checked ? 'checked' : 'unchecked'} onPress={() => {setChecked(!checked);}}/>
         </View>
    )
}