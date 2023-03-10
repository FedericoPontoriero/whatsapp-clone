import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice'
import chatSlice from './chatSlice'
import messagesSlice from './messagesSlice'
import userSlice from './userSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    users: userSlice,
    chats: chatSlice,
    messages: messagesSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
