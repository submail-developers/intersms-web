import { useState, useRef, MutableRefObject, useEffect } from 'react'
import { useAppSelector } from '@/store/hook'
import { accountInfoState } from '@/store/reducers/accountInfo'
import { Tabs, Button, App, Switch, Popconfirm } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TabsProps } from 'antd'
import { useSize } from '@/hooks'

import PriceConfig from './config/price'
import ChannelConfig from './config/channel'
import ErrorConfig from './config/error'
import PriceDialog from './dialog/priceDialog'
import ChannelDialog from './dialog/channelDialog'
import ErrorDialog from './dialog/errorDialog'

import {
  deleteAccountPrice,
  deleteAccountChannel,
  deleteAccountError,
} from '@/api'
import { API } from 'apis'
import './index.scss'

export default function Right() {
  const { message } = App.useApp()
  const accountInfoStore = useAppSelector(accountInfoState)
  const size = useSize()
  const [activeKey, setactiveKey] = useState<string>('1')

  const priceTableRef: MutableRefObject<any> = useRef(null)
  const channelTableRef: MutableRefObject<any> = useRef(null)
  const errorTableRef: MutableRefObject<any> = useRef(null)
  const priceDialogRef: MutableRefObject<any> = useRef(null)
  const channelDialogRef: MutableRefObject<any> = useRef(null)
  const errorDialogRef: MutableRefObject<any> = useRef(null)

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
  // 展示编辑弹框
  const showEditDialog = (
    record:
      | API.AccountPriceItem
      | API.AccountChannelItem
      | API.AccountErrorItem,
  ) => {
    switch (activeKey) {
      case '1':
        priceDialogRef.current.open(record)
        break
      case '2':
        channelDialogRef.current.open(record)
        break
      case '3':
        errorTableRef.current.open(record)
        break
    }
  }
  // 更新table数据
  const updateTable = () => {
    switch (activeKey) {
      case '1':
        priceTableRef.current.updateTableData()
        break
      case '2':
        channelTableRef.current.updateTableData()
        break
      case '3':
        errorTableRef.current.updateTableData()
        break
    }
  }

  // 删除
  const deleteEvent = async () => {
    let selectKeys = []
    switch (activeKey) {
      case '1':
        selectKeys = priceTableRef.current.getRowSelectKeys()
        if (selectKeys.length == 0) {
          message.warning('请选择要删除的配置项！')
          return
        }
        await deleteAccountPrice({ id: selectKeys.join(',') })
        message.success('删除成功')
        updateTable()
        break
      case '2':
        selectKeys = channelTableRef.current.getRowSelectKeys()
        if (selectKeys.length == 0) {
          message.warning('请选择要删除的配置项！')
          return
        }
        await deleteAccountChannel({ id: selectKeys.join(',') })
        message.success('删除成功')
        updateTable()
        break
      case '3':
        selectKeys = errorTableRef.current.getRowSelectKeys()
        if (selectKeys.length == 0) {
          message.warning('请选择要删除的配置项！')
          return
        }
        await deleteAccountError({ id: selectKeys.join(',') })
        message.success('删除成功')
        updateTable()
        break
    }
  }
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '国家价格配置',
      children: (
        <PriceConfig
          showEdit={showEditDialog}
          ref={priceTableRef}
          activeKey={activeKey}
          selfKey='1'
        />
      ),
    },
    {
      key: '2',
      label: `国家通道配置`,
      children: (
        <ChannelConfig
          ref={channelTableRef}
          showEdit={showEditDialog}
          activeKey={activeKey}
          selfKey='2'
        />
      ),
    },
    {
      key: '3',
      label: `失败处理配置`,
      children: (
        <ErrorConfig
          ref={errorTableRef}
          accountId={
            accountInfoStore.activeAccount
              ? accountInfoStore.activeAccount?.account
              : ''
          }
        />
      ),
    },
  ]

  // 自定义tabs导航
  const renderTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => {
    const changeALl = (checked: boolean) => {}
    const changeTest = (checked: boolean) => {}
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
        <div className={`fx-auto ext-switch fx-between-center ${size}`}>
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

  return accountInfoStore.activeAccount ? (
    <section
      data-class='account-right'
      className='right-wrap fx-auto fx-shrink'
      style={{ minWidth: `${size === 'small' ? '100%' : ''}` }}>
      <div className='fx-col'>
        <div className='btn-group'>
          <div className='btn' onClick={showAddDialog}>
            <i className='icon iconfont icon-xinzeng'></i>
            <span>新增</span>
          </div>
          <Popconfirm
            placement='bottom'
            title='警告'
            description='确定删除选中的客户吗？'
            onConfirm={deleteEvent}
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
            renderTabBar={renderTabBar}
          />
        </div>
      </div>
      <PriceDialog onUpdateTable={updateTable} ref={priceDialogRef} />
      <ChannelDialog onUpdateTable={updateTable} ref={channelDialogRef} />
      <ErrorDialog ref={errorDialogRef} />
    </section>
  ) : null
}
