import TimeboxHeading from '../components/timeboxes/TimeboxHeading';
import TimeboxGrid from '../components/timeboxes/TimeboxGrid';

export default function Timeboxes(props) {
  return (
    <>
      <TimeboxHeading data={props.data} />
      <TimeboxGrid data={props.data}></TimeboxGrid>
    </>
  )
  
}