import React from "react";
import { render } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import profileReducer from '../redux/profile'
import overlayDimensionsReducer from '../redux/overlayDimensions'
import activeOverlayHeightReducer from '../redux/activeOverlayHeight'
import activeOverlayIntervalReducer from '../redux/activeOverlayInterval'
import scheduleDataReducer from '../redux/scheduleData'
import timeboxGridReducer from '../redux/timeboxGrid'
import timeboxRecordingReducer from '../redux/timeboxRecording'
import timeboxDialogReducer from '../redux/timeboxDialog'
import usernameReducer from '../redux/username'
import selectedDateReducer from '../redux/selectedDate'
import { combineReducers } from '@reduxjs/toolkit'
import onDayViewReducer from '../redux/onDayView'
import daySelectedReducer from '../redux/daySelected'
import modalVisibleReducer from '../redux/modalVisible'

const rootReducer = combineReducers({
  profile: profileReducer,
  overlayDimensions: overlayDimensionsReducer,
  activeOverlayHeight: activeOverlayHeightReducer,
  activeOverlayInterval: activeOverlayIntervalReducer,
  scheduleData: scheduleDataReducer,
  timeboxGrid: timeboxGridReducer,
  timeboxRecording: timeboxRecordingReducer,
  timeboxDialog: timeboxDialogReducer,
  username: usernameReducer,
  selectedDate: selectedDateReducer,
  onDayView: onDayViewReducer,
  daySelected: daySelectedReducer,
  modalVisible: modalVisibleReducer,
});

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = configureStore({
      reducer: rootReducer ,
      preloadedState,
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}