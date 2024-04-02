import { createSlice } from '@reduxjs/toolkit'

export const selectedSchedule = createSlice({
  name: 'selectedSchedule',
  initialState: {
    value: 0,
  },
  reducers: {
    set: (state, action) => {
      state.value = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { set } = selectedSchedule.actions

export default selectedSchedule.reducer