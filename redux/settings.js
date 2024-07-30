import { createSlice } from '@reduxjs/toolkit'

export const settings = createSlice({
  name: 'settings',
  initialState: {
    value: {viewType: 'week', selectedSchedule: 0},
  },
  reducers: {
    set: (state, action) => {
      state.value = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { set } = settings.actions

export default settings.reducer