import Svg, { Circle, Text } from "react-native-svg";
import { View } from "react-native";
import PieChart from 'react-native-pie-chart'
import { Surface } from "react-native-paper";
import { styles } from "../styles/styles";

export function StatisticsGraph(props) {
    let {percentage, text} = props;
    const widthAndHeight = 100

    const series = [
      { value: percentage, color: '#000' },
      { value: 1-percentage, color: '#495057' },
    ]
    return (
        <Surface style={{backgroundColor: styles.primaryColor, height: 'fit-content', width: '80%', marginTop: 30, marginHorizontal: 30}}  elevation={4}>
            <View style={{marginLeft: 10, marginRight: 10}}>             
                <PieChart widthAndHeight={widthAndHeight} series={series} />
            </View>
        </Surface>
        )
}