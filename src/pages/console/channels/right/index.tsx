import { useState, useRef, MutableRefObject } from 'react'
import { useAppSelector } from '@/store/hook'
import { accountInfoState } from '@/store/reducers/accountInfo'
import { Tabs, Button, Space, Switch, Popconfirm } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TabsProps } from 'antd'
import { useSize } from '@/hooks'

import ChannelConfig from './config/channel'
import ChannelDialog from './dialog/channelDialog'

import './index.scss'

export default function Right() {
  const accountInfoStore = useAppSelector(accountInfoState)
  const channelDialogRef: MutableRefObject<any> = useRef(null)

  const [activeKey, setactiveKey] = useState<string>('1')
  const onChange = (key: string) => {
    console.log(key)
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '通道管理配置',
      children: <ChannelConfig accountId={accountInfoStore.activeAccountId} />,
    },
  ]

  const size = useSize()
  // 展示新增弹框
  const showAddDialog = () => {
    switch (activeKey) {
      case '1':
        channelDialogRef.current.open()
        break
    }
  }

  // 自定义tabs导航
  const renderTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => {
    const changeALl = (checked: boolean) => {
      console.log(checked)
    }
    const changeTest = (checked: boolean) => {
      console.log(checked)
    }
    return (
      <div className={`tabbar-head ${size == 'small' ? '' : 'fx fx-wrap'}`}>
        <div className={`fx panle-list ${size}`}>
          {items.map((item) => (
            <div
              key={item.key}
              onClick={() => setactiveKey(item.key)}
              className={`panle ${size} ${
                item.key == activeKey ? 'active' : ''
              } ${
                Number(item.key) - Number(activeKey) > 1 ? 'left-line' : ''
              } ${
                Number(item.key) - Number(activeKey) < -1 ? 'right-line' : ''
              }`}>
              {item.label}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return accountInfoStore.activeAccountId ? (
    <section
      data-class='channels-right'
      className='right-wrap fx-auto fx-shrink'
      style={{ minWidth: `${size === 'small' ? '100%' : ''}` }}>
      <div className='fx-col'>
        <div className='btn-group'>
          <div className='btn' onClick={showAddDialog}>
            <i className='icon iconfont icon-xinzeng'></i>
            <span>新增</span>
          </div>
          <div className='btn'>
            <i className='icon iconfont icon-bianji'></i>
            <span>编辑</span>
          </div>
          <Popconfirm
            placement='bottom'
            title='警告'
            description='确定删除选中的客户吗？'
            // onConfirm={deleteEvent}
            okText='确定'
            cancelText='取消'>
            <div className='btn delete'>
              <i className='icon iconfont icon-shanchu'></i>
              <span>删除</span>
            </div>
          </Popconfirm>
        </div>
        <div className='tabs'>
          <Tabs
            type='card'
            activeKey={activeKey}
            items={items}
            onChange={onChange}
            renderTabBar={renderTabBar}
          />
        </div>
      </div>
      <ChannelDialog ref={channelDialogRef} />
    </section>
  ) : null
}
