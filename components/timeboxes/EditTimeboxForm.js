export default function EditTimeboxForm() {
    return (
    <View style={styles.overallModal}>
            <View style={styles.titleBarContainer}>  
                <Text style={styles.title}>Timebox Actions</Text>
                <Pressable onPress={() => props.close(false)}>
                    <FontAwesomeIcon icon={faXmark} size={25}/>
                </Pressable>
            </View>
            {noPreviousRecording && timeboxIsntRecording && <>
                <Button outlineStyle={styles.buttonOutlineStyle} textStyle={styles.buttonTextStyle} title="Record" onPress={startRecording}></Button>
                <Button outlineStyle={styles.buttonOutlineStyle} textStyle={styles.buttonTextStyle} title="Complete" onPress={autoRecord}></Button> 
            </>}
            {noPreviousRecording && timeboxIsRecording && 
            <Button outlineStyle={styles.buttonOutlineStyle} textStyle={styles.buttonTextStyle} title="Stop Recording" onPress={stopRecording}></Button>}
            <Button outlineStyle={styles.buttonOutlineStyle} textStyle={styles.buttonTextStyle} title="Edit" onPress={() => setShowEditTimeboxForm(true)}></Button>
        </View>)
}