import { configureStore } from '@reduxjs/toolkit'
import scheduleEssentialsReducer from './scheduleEssentials'
import overlayDimensionsReducer from './overlayDimensions'
import activeOverlayHeightReducer from './activeOverlayHeight'
import activeOverlayIntervalReducer from './activeOverlayInterval'
import scheduleDataReducer from './scheduleData'
import timeboxGridReducer from './timeboxGrid'
import timeboxRecordingReducer from './timeboxRecording'
import timeboxDialogReducer from './timeboxDialog'
import usernameReducer from './username'
import selectedDateReducer from './selectedDate'
import selectedScheduleReducer from './selectedSchedule'

export default configureStore({
  reducer: {
    scheduleEssentials: scheduleEssentialsReducer,
    overlayDimensions: overlayDimensionsReducer,
    activeOverlayHeight: activeOverlayHeightReducer,
    activeOverlayInterval: activeOverlayIntervalReducer,
    scheduleData: scheduleDataReducer,
    timeboxGrid: timeboxGridReducer,
    timeboxRecording: timeboxRecordingReducer,
    timeboxDialog: timeboxDialogReducer,
    username: usernameReducer,
    selectedDate: selectedDateReducer,
    selectedSchedule: selectedScheduleReducer,
  },
})