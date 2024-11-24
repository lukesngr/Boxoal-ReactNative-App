import { createSlice } from '@reduxjs/toolkit'

export const scheduleEssentials = createSlice({
  name: 'scheduleEssentials',
  initialState: {
    value: {id: 0, boxSizeUnit: 'min', boxSizeNumber: 30, wakeupTime: '07:00'},
  },
  reducers: {
    set: (state, action) => {
      state.value = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { set } = scheduleEssentials.actions

export default scheduleEssentials.reducer