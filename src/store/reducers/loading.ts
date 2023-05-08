import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/store'

// 为 slice state 定义一个类型
interface Loading {
  show: boolean
}

// 使用该类型定义初始 state
const initialState: Loading = {
  show: false,
}

export const loadingSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    changeLoading: (state, actions: PayloadAction<boolean>) => {
      state.show = actions.payload
    },
  },
})

loadingSlice.caseReducers.changeLoading(
  { show: false },
  { type: 'changeLoading', payload: false },
)

// 导出action
export const { changeLoading } = loadingSlice.actions

// 导出state
export const loadingStatus = (state: RootState) => state.loadingReducer.show

export default loadingSlice.reducer
