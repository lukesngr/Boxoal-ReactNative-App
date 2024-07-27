import TimeboxHeading from '../components/timeboxes/TimeboxHeading';
import TimeboxGrid from '../components/timeboxes/TimeboxGrid';

export default function Timeboxes(props) {
  return (
    <>
      <TimeboxHeading />
      <TimeboxGrid data={props.data}></TimeboxGrid>
    </>
  )
  
}