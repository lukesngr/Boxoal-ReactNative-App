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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from '@reduxjs/toolkit'
import settingsReducer from './settings'

const rootReducer = combineReducers({
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
  settings: settingsReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['username', 'timeboxRecording', 'activeOverlayInterval', 'activeOverlayHeight', 'overlayDimensions'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);