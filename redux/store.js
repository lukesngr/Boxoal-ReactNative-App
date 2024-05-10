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
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';

const rootReducer = {
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
};

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['username', 'timeboxRecording'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);