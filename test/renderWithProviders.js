import React from "react";
import { render } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import timeboxGridReducer from './timeboxGrid'
import timeboxRecordingReducer from './timeboxRecording'
import timeboxDialogReducer from './timeboxDialog'
import usernameReducer from './username'
import selectedDateReducer from './selectedDate'
import selectedScheduleReducer from './selectedSchedule'
import { combineReducers } from '@reduxjs/toolkit'
import onDayViewReducer from './onDayView'
import daySelectedReducer from './daySelected'
import modalVisibleReducer from './modalVisible'

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
      reducer: { reducer: rootReducer },
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