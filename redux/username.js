import { createSlice } from '@reduxjs/toolkit'

export const username = createSlice({
  name: 'username',
  initialState: {
    value: '',
  },
  reducers: {
    set: (state, action) => {
      state.value = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { set } = username.actions

export default username.reducer