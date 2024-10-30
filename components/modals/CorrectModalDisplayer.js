import CreateTimeboxForm from "../timeboxes/CreateTimeboxForm";
import TimeboxActionsForm from "../timeboxes/TimeboxActionsForm";

export default function CorrectModalDisplayer() {
    const modalVisible = useSelector(state => state.modalVisible.value);
    const timeboxNotCreated = ("dayName" in modalVisible);

    return (
    <>
        {timeboxNotCreated ? (<CreateTimeboxForm {...modalVisible.props}></CreateTimeboxForm>) : (<TimeboxActionsForm {...modalVisible.props}></TimeboxActionsForm>)}
    </>)
}