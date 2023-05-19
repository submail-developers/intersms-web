import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/store'
import { API } from 'apis'

// 为 slice state 定义一个类型
interface Channels {
  activeChannels: API.GetChannelGroupListItem | null // 当前被点击点项
}

// 使用该类型定义初始 state
const initialState: Channels = {
  activeChannels: null,
}

export const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    changeActiveChannels: (
      state,
      actions: PayloadAction<API.GetChannelGroupListItem | null>,
    ) => {
      state.activeChannels = actions.payload
    },
  },
})

// 导出action
export const { changeActiveChannels } = channelsSlice.actions

// 导出state
export const channelsState = (state: RootState) => state.channelsReducer

export default channelsSlice.reducer
