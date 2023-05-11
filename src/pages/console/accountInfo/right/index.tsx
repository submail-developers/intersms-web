import { useState, useRef, MutableRefObject } from 'react'
import { useAppSelector } from '@/store/hook'
import { accountInfoState } from '@/store/reducers/accountInfo'
import { Tabs, Button, Space, Switch } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TabsProps } from 'antd'
import { useSize } from '@/hooks'

import PriceConfig from './config/price'
import ChannelConfig from './config/channel'
import ErrorConfig from './config/error'
import PriceDialog from './dialog/priceDialog'
import ChannelDialog from './dialog/channelDialog'
import ErrorDialog from './dialog/errorDialog'

import './index.scss'

export default function Right() {
  const accountInfoStore = useAppSelector(accountInfoState)
  const priceDialogRef: MutableRefObject<any> = useRef(null)
  const channelDialogRef: MutableRefObject<any> = useRef(null)
  const errorDialogRef: MutableRefObject<any> = useRef(null)
  const [activeKey, setactiveKey] = useState<string>('1')
  const onChange = (key: string) => {
    console.log(key)
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '国家价格配置',
      children: <PriceConfig accountId={accountInfoStore.activeAccountId} />,
    },
    {
      key: '2',
      label: `国家通道配置`,
      children: <ChannelConfig accountId={accountInfoStore.activeAccountId} />,
    },
    {
      key: '3',
      label: `失败处理配置`,
      children: <ErrorConfig accountId={accountInfoStore.activeAccountId} />,
    },
  ]

  const size = useSize()
  // 展示新增弹框
  const showAddDialog = () => {
    switch (activeKey) {
      case '1':
        priceDialogRef.current.open()
        break
      case '2':
        channelDialogRef.current.open()
        break
      case '3':
        errorDialogRef.current.open()
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
      <div className={`tabbar-head ${size == 'small' ? '' : 'fx'}`}>
        <div
          className={`fx panle-list ${size == 'small' ? 'small' : 'middle'}`}>
          {items.map((item) => (
            <div
              key={item.key}
              onClick={() => setactiveKey(item.key)}
              className={`panle ${size == 'small' ? 'small' : 'middle'} ${
                item.key == activeKey ? 'active' : ''
              }`}>
              {item.label}
            </div>
          ))}
        </div>
        <div
          className={`fx-auto ext-switch fx-between-center ${
            size == 'small' ? 'small' : 'middle'
          }`}>
          {activeKey == '1' ? (
            <div className='switch-all fx-shrink'>
              <Switch size={'small'} onChange={changeALl}></Switch>
              <span> 开启全部营销</span>
            </div>
          ) : (
            <div></div>
          )}
          <div className='switch-test'>
            <Switch size={'small'} onChange={changeTest}></Switch>
            <span> 测试用户</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    accountInfoStore.activeAccountId && (
      <section
        data-class='account-right'
        className='right-wrap fx-auto fx-shrink'
        style={{ minWidth: `${size === 'small' ? '100%' : ''}` }}>
        <div className='fx-col'>
          <Space.Compact size={size == 'small' ? 'small' : 'middle'}>
            <Button
              type='primary'
              onClick={showAddDialog}
              icon={
                <i
                  className={`icon iconfont icon-xinzeng ${
                    size == 'small' ? 'small' : 'middle'
                  }`}
                />
              }>
              新增
            </Button>
            <Button
              type='primary'
              icon={
                <i
                  className={`icon iconfont icon-bianji ${
                    size == 'small' ? 'small' : 'middle'
                  }`}
                />
              }>
              编辑
            </Button>
            <Button
              type='primary'
              danger
              icon={
                <i
                  className={`icon iconfont icon-shanchu ${
                    size == 'small' ? 'small' : 'middle'
                  }`}
                />
              }>
              删除
            </Button>
          </Space.Compact>
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
        <PriceDialog ref={priceDialogRef} />
        <ChannelDialog ref={channelDialogRef} />
        <ErrorDialog ref={errorDialogRef} />
      </section>
    )
  )
}
