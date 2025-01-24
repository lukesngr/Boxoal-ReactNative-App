import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { Surface, Text } from "react-native-paper"
import { faArrowDown } from "@fortawesome/free-solid-svg-icons"
import GoalProgressIndicator from "./GoalProgressIndicator"
export function GoalTreeNode(props) {
    return (<>
        <Surface style={{padding: 10, backgroundColor: '#D9D9D9', borderRadius: 50, alignSelf: 'center', paddingVertical: '10%'}}>
            <Text style={{fontFamily: 'KameronRegular', fontSize: 20, color: 'black'}}>{props.goal.title}</Text>
        </Surface>
        <GoalProgressIndicator size={50} textColor="white" circleBorderColor="#00C917" circleColor="#000000" goal={props.goal}></GoalProgressIndicator>
        <FontAwesomeIcon icon={faArrowDown} style={{alignSelf: 'center'}} color="black" size={36}></FontAwesomeIcon>
        </>)
}