import TimeboxHeading from '../components/timeboxes/TimeboxHeading';
import TimeboxGrid from '../components/timeboxes/TimeboxGrid';
import { useSelector } from 'react-redux';
import Alert from '../components/Alert';
import { useDispatch } from 'react-redux';

export default function Timeboxes(props) {
  const {open, title, message} = useSelector(state => state.alert.value);
  const dispatch = useDispatch();
  return (
    <>
      <TimeboxHeading data={props.data} />
      <TimeboxGrid data={props.data}></TimeboxGrid>
      <Alert open={open} title={title} message={message} close={() => dispatch({type: 'alert/set', payload: { open: false, title: "", message: "" }})}></Alert>
    </>
  )
  
}