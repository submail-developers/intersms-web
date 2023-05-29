import { useState, useRef, MutableRefObject } from 'react'
import { useAppSelector } from '@/store/hook'
import { accountInfoState } from '@/store/reducers/accountInfo'
import { Tabs, App, Switch, Popconfirm, Checkbox } from 'antd'
import type { TabsProps } from 'antd'
import { useSize } from '@/hooks'

import PriceConfig from './config/price'
import ChannelConfig from './config/channel'
import ErrorConfig from './config/error'
import PriceDialog from './dialog/priceDialog'
import ChannelDialog from './dialog/channelDialog'
import ErrorDialog from './dialog/errorDialog'

import { GetRegioncodeByCountry, changeMkState, changeTestState } from '@/api'
import { API } from 'apis'
import './index.scss'

interface Props {
  forceUpdateLeft: () => void
}

export default function Right(props: Props) {
  const { message } = App.useApp()
  const accountInfoStore = useAppSelector(accountInfoState)
  const size = useSize()
  const [activeKey, setactiveKey] = useState<string>('1')
  const [allCountry, setallCountry] = useState<API.CountryItem[]>([])

  const priceTableRef: MutableRefObject<any> = useRef(null)
  const channelTableRef: MutableRefObject<any> = useRef(null)
  const errorTableRef: MutableRefObject<any> = useRef(null)
  const priceDialogRef: MutableRefObject<any> = useRef(null)
  const channelDialogRef: MutableRefObject<any> = useRef(null)
  const errorDialogRef: MutableRefObject<any> = useRef(null)

  // 展示新增弹框
  const showAddDialog = () => {
    if (allCountry.length == 0) {
      getCountryList()
    }
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
    if (allCountry.length == 0) {
      getCountryList()
    }
    switch (activeKey) {
      case '1':
        priceDialogRef.current.open(record)
        break
      case '2':
        channelDialogRef.current.open(record)
        break
      case '3':
        errorDialogRef.current.open(record)
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
    switch (activeKey) {
      case '1':
        await priceTableRef.current.deleteSelectEvent()
        break
      case '2':
        await channelTableRef.current.deleteSelectEvent()
        break
      case '3':
        await errorTableRef.current.deleteSelectEvent()
        break
    }
  }
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '国家价格配置',
      children: (
        <PriceConfig
          ref={priceTableRef}
          showEdit={showEditDialog}
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
          showEdit={showEditDialog}
          activeKey={activeKey}
          selfKey='3'
        />
      ),
    },
  ]
  const getCountryList = async () => {
    const res = await GetRegioncodeByCountry()
    let countrys: API.CountryItem[] = []
    res.data.forEach((item) => {
      countrys = [...countrys, ...item.children]
    })
    setallCountry(countrys)
  }

  // 自定义tabs导航
  const renderTabBar: TabsProps['renderTabBar'] = (tabprops, DefaultTabBar) => {
    const [loading, setloading] = useState(false)
    const [disabled, setdisabled] = useState(false)
    const changeALl = async () => {
      setloading(true)
      await changeMkState({
        account: accountInfoStore.activeAccount?.account || '',
        mke_flg: accountInfoStore.activeAccount?.mke_flg == '0' ? '1' : '0',
      })
      await props.forceUpdateLeft()
      setloading(false)
    }
    const changeTest = async () => {
      await changeTestState({
        account: accountInfoStore.activeAccount?.account || '',
        test_flg: accountInfoStore.activeAccount?.test_flg == '1' ? '0' : '1',
      })
      await props.forceUpdateLeft()
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
        <div className={`fx-auto ext-switch fx-between-center ${size}`}>
          {activeKey == '1' ? (
            <div className='switch-all fx-shrink'>
              <Switch
                size={'small'}
                loading={loading}
                checked={accountInfoStore.activeAccount?.mke_flg == '1'}
                onClick={changeALl}></Switch>
              <span> 开启全部营销</span>
            </div>
          ) : (
            <div></div>
          )}
          <div className='switch-test'>
            <Checkbox
              disabled={disabled}
              onChange={changeTest}
              checked={
                accountInfoStore.activeAccount?.test_flg == '1' ? true : false
              }></Checkbox>
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
            description='确定删除选中的配置吗？'
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
      <PriceDialog
        onUpdateTable={updateTable}
        ref={priceDialogRef}
        allCountry={allCountry}
      />
      <ChannelDialog
        onUpdateTable={updateTable}
        ref={channelDialogRef}
        allCountry={allCountry}
      />
      <ErrorDialog
        onUpdateTable={updateTable}
        ref={errorDialogRef}
        allCountry={allCountry}
      />
    </section>
  ) : null
}
