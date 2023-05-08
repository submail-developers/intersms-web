/**
 * 如何使用reduxjs/toolkit
 * 包含同步和异步
 * 中文文档https://cn.redux.js.org/tutorials/fundamentals/part-8-modern-redux
 */

import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '@/store'

interface ListItem {
  id: number
  name: string
}

interface State {
  number: number
  list: ListItem[]
}

// 初始数据
const initialState: State = {
  number: 0,
  list: [],
}

// 模拟接口
const fetchCount = (amount = 1) => {
  return new Promise<number>((resolve) =>
    setTimeout(() => resolve(amount), 500),
  )
}
const fetchList = () => {
  return new Promise<ListItem[]>((resolve) =>
    setTimeout(() => resolve([{ id: Math.random(), name: 'a' }]), 500),
  )
}

// 异步方法
export const addNumberAsync = createAsyncThunk(
  'addnumber',
  async (state: number, action) => {
    const newnumber = await fetchCount(1)
    return newnumber
  },
)
export const addListAsync = createAsyncThunk('addlist', async () => {
  const newList = await fetchList()
  return newList
})

// 初始化slice
export const testStore = createSlice({
  name: 'test',
  initialState,
  // 同步reducers
  reducers: {
    addNumber(state, action) {
      state.number += action.payload
    },
    addList(state) {
      state.list = [...state.list, ...[{ id: Math.random(), name: 'a' }]]
    },
  },
  // 异步redicer
  extraReducers(builder) {
    builder.addCase(
      addNumberAsync.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.number += action.payload
      },
    )
    builder.addCase(
      addListAsync.fulfilled,
      (state, action: PayloadAction<ListItem[]>) => {
        state.list = [...state.list, ...action.payload]
      },
    )
  },
})

// 导出action
export const { addNumber, addList } = testStore.actions

// 统一导出state
export const testState = (state: RootState) => state.testReducer
// 也可以单独导出
// export const testListState = (state: RootState) => state.testReducer.list

// 导出reducer
export default testStore.reducer
