import CreateTimeboxForm from "../timeboxes/CreateTimeboxForm";
import TimeboxActionsForm from "../timeboxes/TimeboxActionsForm";
import { useSelector } from "react-redux";

export default function CorrectModalDisplayer() {
    const modalVisible = useSelector(state => state.modalVisible.value);
    const timeboxNotCreated = ("dayName" in modalVisible.props);

    if(modalVisible.visible) {
        return (<>  
            {timeboxNotCreated ? 
                (<CreateTimeboxForm visible={modalVisible.visible} {...modalVisible.props}></CreateTimeboxForm>) : 
                (<TimeboxActionsForm visible={modalVisible.visible} {...modalVisible.props}></TimeboxActionsForm>)
            }
        </>)
    }else{
        return <></>
    }
}