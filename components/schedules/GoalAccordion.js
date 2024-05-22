export default function GoalAccordion(props) {
    const [accordionOpen, setAccordionOpen] = useState(false);

    return props.data.map((goal, index) => {
        return (
            <Pressable onPress={() => setAccordionOpen(!accordionOpen)}>
                <View key={index} style={{backgroundColor: 'white', padding: 10, margin: 10}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={{color: 'black', fontSize: 25}}>{goal.name}</Text>
                        <View style={{flexDirection: 'row'}}>
                            <FontAwesomeIcon icon={faGear} size={30} color="black" />
                            <FontAwesomeIcon icon={accordionOpen ? faChevronDown : faChevronUp} size={30} color="black" />
                        </View>
                    </View>
                    {accordionOpen && <></>}
                </View>
            </Pressable>
        )
    })
}