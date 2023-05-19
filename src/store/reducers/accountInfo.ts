import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/store'

// 为 slice state 定义一个类型
interface Account {
  activeAccountId: string
}

// 使用该类型定义初始 state
const initialState: Account = {
  activeAccountId: '',
}

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    changeActiveAccountId: (state, actions: PayloadAction<string>) => {
      state.activeAccountId = actions.payload
    },
  },
})

// 导出action
export const { changeActiveAccountId } = accountSlice.actions

// 导出state
export const accountInfoState = (state: RootState) => state.accountReducer

export default accountSlice.reducer
