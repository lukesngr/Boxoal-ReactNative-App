import Svg, { Circle, Text } from "react-native-svg";
import { View } from "react-native";
import PieChart from 'react-native-pie-chart'

export function StatisticsGraph(props) {
    let {percentage, text} = props;
    const widthAndHeight = 100

    const series = [
      { value: percentage, color: '#000' },
      { value: 1-percentage, color: '#495057' },
    ]
    return (
        <View style={{marginLeft: 10, marginRight: 10}}>             
            <PieChart widthAndHeight={widthAndHeight} series={series} />
        </View>
        )
}