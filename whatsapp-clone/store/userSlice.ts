import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: "users",
  initialState: {
    storedUsers: {},
    userData: null,
  },
  reducers: {
    setStoredUsers: (state, action) => {
      const newUsers = action.payload.newUsers
      const existingUsers = state.storedUsers

      const usersArray = Object.values(newUsers)
      for (let i = 0; i < usersArray.length; i++) {
        const userData: any = usersArray[i]
        existingUsers[userData.userId] = userData
      }

      state.storedUsers = existingUsers
    },
  }
})

export const setStoredUsers = userSlice.actions.setStoredUsers;
export default userSlice.reducer;
