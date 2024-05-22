import { faChevronDown, faChevronUp, faGear } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { Pressable } from "react-native";
import GoalAccordion from "./GoalAccordion";
import { Text, View } from "react-native";
import { useState } from "react";

export default function ScheduleItem(props) {
    const [accordionOpen, setAccordionOpen] = useState(false);

    return (
        <Pressable onPress={() => setAccordionOpen(!accordionOpen)}>
            <View style={{backgroundColor: 'white', padding: 10, margin: 10}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{color: 'black', fontSize: 25}}>{props.schedule.name}</Text>
                    <View style={{flexDirection: 'row'}}>
                        <FontAwesomeIcon icon={faGear} size={30} color="black" />
                        <FontAwesomeIcon icon={accordionOpen ? faChevronDown : faChevronUp} size={30} color="black" />
                    </View>
                </View>
                {accordionOpen && <GoalAccordion data={schedule.goals}></GoalAccordion>}
            </View>
        </Pressable>
    )
}