import { Text } from "react-native-paper";
import { View } from "react-native";
import PieChart from 'react-native-pie-chart'
import { Surface } from "react-native-paper";
import {styles} from "../styles/styles";

export function StatisticsGraph(props) {
    let {percentage, title, property} = props;
    const widthAndHeight = 310

    const series = [
      { value: percentage, color: '#000' },
      { value: 1-percentage, color: '#495057' },
    ]
    return (
        <Surface style={{backgroundColor: styles.primaryColor, height: 'fit-content', width: '80%', marginTop: 30, marginHorizontal: 30}}  elevation={4}>
            
            <View style={{marginHorizontal: 10}}> 
                <Text style={{fontFamily: 'Koulen-Regular', fontSize: 19, color: 'white', marginTop: 20, marginBottom: 10}}>% Of Timeboxes {title}</Text>     
                <PieChart widthAndHeight={widthAndHeight} series={series} />
                <View style={{flexDirection: 'row', marginLeft: 10, marginTop: 20}}>
                    <View style={{height: 20, width: 20, backgroundColor: "#000", marginRight: 10, marginTop: 7}}></View>
                    <Text style={{fontFamily: 'Koulen-Regular', fontSize: 19, color: 'white'}}>{Math.round(percentage*100)}% {property}</Text>
                </View>
                <View style={{flexDirection: 'row', marginLeft: 10, marginTop: 5}}>
                    <View style={{height: 20, width: 20, backgroundColor: "#495057", marginRight: 10, marginTop: 7}}></View>
                    <Text style={{fontFamily: 'Koulen-Regular', fontSize: 19, color: 'white'}}>{Math.round((1-percentage)*100)}% Not {property}</Text>
                </View>
            </View>
        </Surface>
        )
}