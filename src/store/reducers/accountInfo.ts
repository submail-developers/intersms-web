import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/store'
import { API } from 'apis'
// 为 slice state 定义一个类型
interface Account {
  activeAccount: API.AccountListItem | null
}

// 使用该类型定义初始 state
const initialState: Account = {
  activeAccount: null,
}

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    // 当前点击/被选中的客户
    changeActiveAccount: (
      state,
      actions: PayloadAction<API.AccountListItem | null>,
    ) => {
      state.activeAccount = actions.payload
    },
  },
})

// 导出action
export const { changeActiveAccount } = accountSlice.actions

// 导出state
export const accountInfoState = (state: RootState) => state.accountReducer

export default accountSlice.reducer
