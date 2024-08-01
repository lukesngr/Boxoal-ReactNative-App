import { createSlice } from '@reduxjs/toolkit'

export const viewType = createSlice({
  name: 'viewType',
  initialState: {
    value: 'week',
  },
  reducers: {
    set: (state, action) => {
      state.value = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { set } = viewType.actions

export default viewType.reducer