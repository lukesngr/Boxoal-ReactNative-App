export function StatisticsProgressIndicator(props) {
    let {percentage, text} = props;
    let realPercentage = percentage * 100;
    const size = 50;
    let strokeWidth = 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (circumference * realPercentage) / 100;
    return (<>
        <Text style={{fontFamily: 'KameronRegular', fontSize: 20, color: 'black', marginTop: 20, marginHorizontal: 30}}>{text}</Text>
        <View style={{marginLeft: 10, marginRight: 10}}>
            <Svg width={size} height={size}>
                <Circle
                    stroke="#D9D9D9"
                    fill="none"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                />
                <Circle
                    stroke="#C5C27C"
                    fill="none"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    rotation="-90"
                    originX={size / 2}
                    originY={size / 2}
                />
                <Text
                    x={size / 2}
                    y={(size / 2)-8}
                    textAnchor="middle"
                    dy=".3em"
                    fontSize={15}
                    fill="black"
                >{realPercentage}%</Text>
            </Svg>
        </View>
        </>)
}