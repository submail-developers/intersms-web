import { useAppDispatch, useAppSelector } from '@/store/hook'
// import {changeActiveAccountId,} from '@/store/reducers/accountInfo'
import { useState, useEffect, useRef, MutableRefObject } from 'react'
import {
  Button,
  Input,
  Affix,
  ConfigProvider,
  Table,
  Switch,
  Checkbox,
  Popconfirm,
  App,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import AddDialog from './addDialog/addDialog'

import { useSize } from '@/hooks'
import { getAccountList, deleteAccount } from '@/api'
import { API } from 'apis'
import './index.scss'

interface DataType extends API.AccountListItem {}

/**
 * 客户信息
 */
export default function Left() {
  const dialogRef: MutableRefObject<any> = useRef(null)
  const { message } = App.useApp()
  const dispatch = useAppDispatch()
  // const accountInfoStore = useAppSelector(accountInfoState)
  const size = useSize()
  // 列表
  const [tableData, settableData] = useState<API.AccountListItem[]>([])
  // 被点击的客户(不是被checkbox选中的客户)
  const [activeIndex, setactiveIndex] = useState<number>()
  const onRow = (record: DataType, index?: number) => {
    return {
      onClick: () => {
        setactiveIndex(index)
      },
    }
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'sender',
      dataIndex: 'sender',
      className: 'paddingL30',
      ellipsis: true,
    },
    {
      title: 'account',
      dataIndex: 'account',
      ellipsis: true,
      width: 50,
      render: (_, record) => {
        return (
          <div className='fx-end-start' style={{ paddingRight: '10px' }}>
            <Switch size='small' />
          </div>
        )
      },
    },
  ]

  useEffect(() => {
    initData()
  }, [])
  const initData = async () => {
    settableData([
      {
        id: 'string',
        account: 'string',
        sender: 'string',
        region_code: 'string',
        channel_id: 'string',
        network: 'string',
      },
      {
        id: 'string2',
        account: 'string2',
        sender: 'string2',
        region_code: 'string',
        channel_id: 'string',
        network: 'string',
      },
    ])
    // dispatch(changeActiveAccountId('string'))
    setactiveIndex(0)
  }

  // 删除事件
  const deleteEvent = async () => {}
  // 开启dialog
  const openAddDialog = () => {
    dialogRef.current.open()
  }

  return (
    <section data-class='account-left' className={`${size}`}>
      <div className='btn-group'>
        <div className='btn' onClick={openAddDialog}>
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
          description='确定删除选中的黑名单表吗？'
          onConfirm={deleteEvent}
          okText='确定'
          cancelText='取消'>
          <div className='btn delete'>
            <i className='icon iconfont icon-shanchu'></i>
            <span>删除</span>
          </div>
        </Popconfirm>
      </div>
      <div className='filter-wrap fx-col'>
        <div className='table-title'>黑名单表</div>
        <ConfigProvider
          theme={{
            token: {
              colorBgContainer: 'transparent',
            },
          }}>
          <Table
            className='theme-cell bg-gray'
            showHeader={false}
            columns={columns}
            dataSource={tableData}
            rowKey={'account'}
            onRow={onRow}
            rowClassName={(record, index) =>
              index == activeIndex ? 'active' : ''
            }
            pagination={false}
            scroll={{ y: 450 }}
          />
        </ConfigProvider>
      </div>
      <AddDialog ref={dialogRef} onSearch={initData} />
    </section>
  )
}
