import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import recordingPattern from '../../assets/recordingbox.png'; // Adjust path as needed

export default function TimelineRecording({timeboxStart, timeboxEnd, recordingStart, recordingEnd}) {
  const timeboxStartTime = new Date(timeboxStart);
  const timeboxEndTime = new Date(timeboxEnd);
  const recordingStartTime = new Date(recordingStart);
  const recordingEndTime = new Date(recordingEnd);
  const hoursConversionDivisor = 3600000;
  const minuteConversionDivisor = 60000;
  let totalDurationInEpoch = Math.max(recordingEndTime, timeboxEndTime) - Math.min(recordingStartTime, timeboxStartTime);
  let totalDuration = '0'; 

  if((totalDurationInEpoch / minuteConversionDivisor) >= 60) {
    totalDuration = `${Math.round(totalDurationInEpoch / hoursConversionDivisor)}hr`;
  }else{
    totalDuration = `${Math.round(totalDurationInEpoch / minuteConversionDivisor)}min`;
  }
  
  let recordingBlockWidth = Math.round(((recordingEndTime - recordingStartTime) / totalDurationInEpoch)*100);
  let timeboxBlockWidth = Math.round(((timeboxEndTime - timeboxStartTime) / totalDurationInEpoch)*100);
  let startInEpoch = Math.min(recordingStartTime, timeboxStartTime);
  let recordingMargin = Math.round(((recordingStartTime - startInEpoch) / totalDurationInEpoch)*100);
  let timeboxMargin = Math.round(((timeboxStartTime - startInEpoch) / totalDurationInEpoch)*100);

  return (
    <View style={styles.timelineContainer}>
      <View style={styles.timelineBar}>
        <View 
          style={[
            styles.timelineRecordingBar,
            { 
              width: `${recordingBlockWidth}%`, 
              marginLeft: `${recordingMargin}%` 
            }
          ]}
        >
          <Image 
            source={recordingPattern}
            style={styles.patternImage}
            resizeMode="repeat"
          />
        </View>
        
        <View 
          style={[
            styles.timelineTimeboxBar,
            { 
              width: `${timeboxBlockWidth}%`, 
              marginLeft: `${timeboxMargin}%` 
            }
          ]}
        />
      </View>
      
      <Text style={styles.durationLabel}>
        {totalDuration}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  timelineContainer: {
    // Add your container styles here
  },
  timelineBar: {
    height: 40,
    width: '100%',
    backgroundColor: 'white',
    position: 'relative',
  },
  timelineRecordingBar: {
    position: 'absolute',
    height: '100%',
    borderWidth: 1,
    borderColor: 'red',
    overflow: 'hidden',
    zIndex: 2,
  },
  patternImage: {
    width: '100%',
    height: '100%',
  },
  timelineTimeboxBar: {
    position: 'absolute',
    zIndex: 1,
    height: '100%',
    backgroundColor: 'black',
  },
  durationLabel: {
    color: 'white',
    fontFamily: 'Kameron',
    alignSelf: 'flex-end',
  },
});