import { faChevronDown, faChevronUp, faGear } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { Pressable } from "react-native";
import GoalAccordion from "./GoalAccordion";

export default function ScheduleAccordion(props) {
    const [accordionOpen, setAccordionOpen] = useState(false);

    return props.data.map((schedule, index) => {
        return (
            <Pressable onPress={() => setAccordionOpen(!accordionOpen)}>
                <View key={index} style={{backgroundColor: 'white', padding: 10, margin: 10}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text>{schedule.name}</Text>
                        <FontAwesomeIcon icon={faGear} size={24} color="black" />
                        <FontAwesomeIcon icon={accordionOpen ? faChevronDown : faChevronUp} size={24} color="black" />
                    </View>
                    {accordionOpen && <GoalAccordion data={schedule.goals}></GoalAccordion>}
                </View>
            </Pressable>
        )
    })
}