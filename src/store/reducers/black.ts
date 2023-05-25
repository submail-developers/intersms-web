import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/store'
import { API } from 'apis'

// 为 slice state 定义一个类型
interface Black {
  activeBlack: API.GetBlackListItems | null // 当前被点击点项
}

// 使用该类型定义初始 state
const initialState: Black = {
  activeBlack: null,
}

export const blackSlice = createSlice({
  name: 'black',
  initialState,
  reducers: {
    changeActiveBlack: (
      state,
      actions: PayloadAction<API.GetBlackListItems | null>,
    ) => {
      state.activeBlack = actions.payload
    },
  },
})

// 导出action
export const { changeActiveBlack } = blackSlice.actions

// 导出state
export const blackState = (state: RootState) => state.blackReducer

export default blackSlice.reducer
