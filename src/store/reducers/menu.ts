import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/store';

// 为 slice state 定义一个类型
interface Menu {
  isclose: boolean
}

// 使用该类型定义初始 state
const initialState: Menu = {
  isclose: false
}

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    changeClose: (state) => {
      state.isclose = !state.isclose
    }
  },
})

// 导出action
export const { changeClose } = menuSlice.actions;

// 导出state
export const menuCloseStatus = (state: RootState) => state.menuReducer.isclose

export default menuSlice.reducer