import Svg, { Circle, Path } from "react-native-svg";
import { getProgressWithGoal } from "../../modules/coreLogic";
import { getDateWithSuffix } from "../../modules/formatters";
import dayjs from "dayjs";
import { View, Text } from "react-native";
import { styles } from "../../styles/styles";

export function GoalTreeNode(props) {
    return (
        <View style={{alignSelf: 'center'}}>
            <View onClick={props.setTimeboxView({data: props.goal, open: true})} style={{backgroundColor: styles.primaryColor, maxWidth: '80%', paddingHorizontal: '10%', paddingVertical: '5%'}}>
                <Text style={{fontFamily: 'Koulen-Regular', fontSize: 30, color: 'white'}}>{props.goal.title}</Text>
                {props.goal.state == "completed" && <Text style={{fontFamily: 'Koulen-Regular', color: '#4FF38E', fontSize: 15, textAlign: 'center'}} className="goalCardUndertext">Completed</Text>}
                {props.goal.state == "failed" && <Text style={{fontFamily: 'Koulen-Regular', color: '#FF0606', fontSize: 15, textAlign: 'center'}} className="goalCardUndertext">Failed</Text>}
                {props.goal.state == "active" && <Text className="goalCardUndertext">{props.goal.percentageCompleted}%</Text>}
                <Text style={{fontFamily: 'Koulen-Regular', color: 'white', fontSize: 15, textAlign: 'center'}} >{dayjs(props.goal.targetDate).format('D MMM')}</Text>
            </View>
            <Svg style={{alignSelf: 'center'}} width={25} height={45} viewBox="0 0 24 30">
                <Path 
                    d="M12 0 L12 24 M5 17 L12 24 L19 17" 
                    stroke="black" 
                    strokeWidth={2}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </Svg>
      </View>
    )
}