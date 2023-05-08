import { configureStore } from '@reduxjs/toolkit'
import menuReducer from './reducers/menu'
import testReducer from './reducers/test'
import loadingReducer from './reducers/loading'

// 合并切片
export const store = configureStore({
  reducer: {
    loadingReducer,
    menuReducer,
    testReducer,
  },
})

// 从 store 本身推断出 `RootState` 和 `AppDispatch` 类型
export type RootState = ReturnType<typeof store.getState>
// 推断出类型: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
