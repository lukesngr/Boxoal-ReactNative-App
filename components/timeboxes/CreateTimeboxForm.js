import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {convertToDateTime, addBoxesToTime, calculateMaxNumberOfBoxes} from '../../modules/dateLogic';
import { Alert, TextInput } from 'react-native';

export default function CreateTimeboxForm() {
    const listOfColors = ["#00E3DD", "#00C5E6", "#00A4E7", "#0081DC", "#1E5ABF", "#348D9D", "#67D6FF"];
    let {time, date, dayName} = props;
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [goalSelected, setGoalSelected] = useState(1);
    const [reoccurFrequency, setReoccurFrequency] = useState("no");
    const [weeklyDate, setWeeklyDate] = useState(new Date());
    const [numberOfBoxes, setNumberOfBoxes] = useState(1);
    const {id, wakeupTime, boxSizeUnit, boxSizeNumber} = useSelector(state => state.scheduleEssentials.value);
    const {timeboxes, goals} = useSelector(state => state.scheduleData.value);


    let maxNumberOfBoxes = calculateMaxNumberOfBoxes(wakeupTime, boxSizeUnit, boxSizeNumber, timeboxes, time, date);

    useEffect(() => {
        setTimeboxFormData({...timeboxFormData, goalSelected: goals.length == 0 ? 1 : goals[0].id});
    }, []);
    
    function handleSubmit(e) {
        e.preventDefault();
        let startTime = convertToDateTime(time, date);
        let endTime = convertToDateTime(addBoxesToTime(boxSizeUnit, boxSizeNumber, time, numberOfBoxes), date); //add boxes to start time to get end time
        let color = listOfColors[Math.floor(Math.random() * listOfColors.length)]; //randomly pick a box color     
        let data = {
            title, 
            description, 
            startTime, 
            endTime, 
            numberOfBoxes: parseInt(numberOfBoxes), 
            color, 
            schedule: {connect: {id}}, 
            goal: {connect: {id: parseInt(goalSelected)}}
        }

        console.log(goalSelected);

        if(reoccurFrequency != "no") { data["reoccuring"] = {create: {reoccurFrequency: "no"}}; }
        if(reoccurFrequency == "weekly") {data.reoccuring.create.weeklyDay = new Date(weeklyDate).getDay();}

        //post to api
        axios.post('/api/createTimebox', data).then(() => {
            //reset the form
            queryClient.refetchQueries();
            e.target.reset();
            toast.success("Added timebox!", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }).catch(function(error) {
            toast.error("Error occurred please try again or contact developer");
            console.log(error); 
        })

    }

    function sanitizedSetNumberOfBoxes(number) {
        if(number > maxNumberOfBoxes) {
            Alert.alert("Number of Boxes", `You can only add ${maxNumberOfBoxes} boxes to this timebox`);
            setNumberOfBoxes(1);
        }else {
            setNumberOfBoxes(number);
        }
    }

    return (
        <View> 
            <Text>Add TimeBox</Text>
            <TextInput onChangeText={setTitle} value={title} placeholder='Title'></TextInput>
            <Text>Description</Text>
            <TextInput onChangeText={setDescription} value={description} placeholder='Description'></TextInput>
            <Text>Boxes</Text>
            <TextInput keyboardType="numeric" onChangeText={sanitizedSetNumberOfBoxes} value={numberOfBoxes} placeholder='Boxes'></TextInput>
            <Text>Reoccuring?</Text>
            <Picker selectedValue={reoccurFrequency} onValueChange={setReoccurFrequency}>
                <Picker.Item label="No" value="no" />
                <Picker.Item label="Daily" value="daily" />
                <Picker.Item label="Weekly" value="weekly" />
            </Picker>
            {reoccurFrequency == 'weekly' && 
                <>
                    <Text>Weekly Date</Text>
                    <DatePicker onChange={setWeeklyDate} value={weeklyDate} />
                </>
            }
            {goals.length == 0 ? (<Text>Must create a goal first</Text>) : (
                <>
                    <Text>Goal</Text>
                    <Picker selectedValue={goalSelected} onValueChange={setGoalSelected}>
                        {goals.map((goal, index) => (
                            <Picker.Item key={index} label={goal.name} value={String(goal.id)} />
                        ))}
                    </Picker>
                </>
            )}
            <Button title="Add TimeBox" disabled={goals.length == 0} onPress={handleSubmit} />
        </View>
    );
}