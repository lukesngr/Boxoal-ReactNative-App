import { createSlice } from '@reduxjs/toolkit'

export const overlayDimensions = createSlice({
  name: 'overlayDimensions',
  initialState: {
    value: [0, 0, 0, 0],
  },
  reducers: {
    set: (state, action) => {
      state.value = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { set } = overlayDimensions.actions

export default overlayDimensions.reducer