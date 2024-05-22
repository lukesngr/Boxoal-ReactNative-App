import ScheduleItem from "./ScheduleItem"
import { ScrollView } from "react-native"

export default function ScheduleAccordion(props) {

    return <ScrollView> 
        {props.data.map((schedule, index) => {
            return <ScheduleItem key={index} schedule={schedule}></ScheduleItem>
        })}
    </ScrollView>
}