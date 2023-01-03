import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: "users",
  initialState: {
    storedUsers: {},
    userData: null,
  },
  reducers: {
    setStoredUsers: (state, action) => {
      state.userData = { ...state.userData, ...action.payload.newData }
    },
  }
})

export const updateLoggedInUserData = userSlice.actions.setStoredUsers;
export default userSlice.reducer;
