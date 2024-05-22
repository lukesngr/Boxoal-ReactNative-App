import ScheduleItem from "./ScheduleItem"

export default function ScheduleAccordion(props) {

    return props.data.map((schedule, index) => {
        <ScheduleItem key={index} schedule={schedule}></ScheduleItem>
    })
}