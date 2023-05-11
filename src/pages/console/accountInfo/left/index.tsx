import { useAppDispatch, useAppSelector } from '@/store/hook'
import {
  changeActiveAccountId,
  //  accountInfoState
} from '@/store/reducers/accountInfo'
import { useState, useEffect, useRef, MutableRefObject } from 'react'
import {
  Button,
  Input,
  ConfigProvider,
  Table,
  Space,
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

// 客户信息
export default function Left() {
  const dialogRef: MutableRefObject<any> = useRef(null)
  const { message } = App.useApp()
  const dispatch = useAppDispatch()
  // const accountInfoStore = useAppSelector(accountInfoState)
  const size = useSize()
  const [keyword, setkeyword] = useState<string>('')
  // 列表
  const [tableData, settableData] = useState<API.AccountListItem[]>([])
  // 被点击的客户(不是被checkbox选中的客户)
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | string[]>(
    [],
  )
  // checkbox勾选的客户
  const [checkedIds, setcheckedIds] = useState<string[]>([])

  // checkbox勾选的事件
  const onChange = (e: CheckboxChangeEvent, record: DataType) => {
    if (e.target.checked) {
      setcheckedIds([...checkedIds, record.account])
    } else {
      setcheckedIds(checkedIds.filter((account) => account !== record.account))
    }
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'checkbox',
      dataIndex: 'checkbox',
      className: 'checkbox-wrap',
      width: 34,
      render: (_, record) => (
        <Checkbox
          className='checkbox'
          onChange={(e) => onChange(e, record)}></Checkbox>
      ),
    },
    {
      title: 'sender',
      dataIndex: 'sender',
      ellipsis: true,
      onCell: (record: DataType) => {
        return {
          onClick: () => {
            dispatch(changeActiveAccountId(record.account))
            setSelectedRowKeys([record.account])
          },
        }
      },
    },
    {
      title: 'account',
      dataIndex: 'account',
      className: 'account-wrap',
      ellipsis: true,
      width: 210,
      onCell: (record: DataType) => {
        return {
          onClick: () => {
            dispatch(changeActiveAccountId(record.account))
            setSelectedRowKeys([record.account])
          },
        }
      },
    },
  ]

  useEffect(() => {
    search()
  }, [])

  const setValue = (e: any) => {
    setkeyword(e.target.value)
  }
  const search = async () => {
    const res = await getAccountList({
      keyword,
      page: '1',
    })
    settableData(res.data)
    if (res.data.length > 0) {
      dispatch(changeActiveAccountId(res.data[0].account))
      setSelectedRowKeys([res.data[0].account])
    } else {
      dispatch(changeActiveAccountId(''))
      setSelectedRowKeys([''])
    }
  }

  const rowSelection = {
    selectedRowKeys,
    hideSelectAll: true,
    columnWidth: 4,
    renderCell: () => {
      return null
    },
  }

  // 删除事件
  const deleteEvent = async () => {
    if (checkedIds.length === 0) {
      message.warning('请勾选要删除的客户！')
      return
    }
    const account = checkedIds.join(',')
    await deleteAccount({ account })
    await search()
  }
  // 开启dialog
  const openAddDialog = () => {
    dialogRef.current.open()
  }

  return (
    <section
      data-class='account-left'
      className='fx-shrink'
      style={{ width: `${size === 'small' ? '100%' : '510px'}` }}>
      <Space.Compact size={size == 'small' ? 'small' : 'middle'}>
        <Button
          type='primary'
          onClick={openAddDialog}
          icon={
            <i
              className={`icon iconfont icon-xinzeng ${
                size == 'small' ? 'small' : 'middle'
              }`}
            />
          }>
          新增
        </Button>
        <Popconfirm
          placement='bottom'
          title='警告'
          description='确定删除选中的客户吗？'
          onConfirm={deleteEvent}
          okText='确定'
          cancelText='取消'>
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
        </Popconfirm>
      </Space.Compact>
      <div className='filter-wrap fx-col'>
        <div className='input-wrap'>
          <Input
            bordered={false}
            placeholder='请输入关键字过滤'
            maxLength={20}
            suffix={
              <i
                onClick={search}
                className='icon iconfont icon-sousuo fn12'
                style={{ color: '#888', cursor: 'pointer' }}></i>
            }
            onChange={setValue}
            onPressEnter={search}
            value={keyword}
            style={{
              height: '38px',
              borderBottom: '1px solid #E7E7E6',
              borderRadius: 0,
            }}
          />
        </div>
        <div className='table-title'>全部客户</div>
        <div className='table-wrap fx-shrink'>
          <ConfigProvider
            theme={{
              token: {
                colorBgContainer: 'transparent',
              },
            }}>
            <Table
              showHeader={false}
              columns={columns}
              dataSource={tableData}
              rowSelection={rowSelection}
              rowKey={'account'}
              pagination={false}
              scroll={{ y: 510 }}
            />
          </ConfigProvider>
        </div>
      </div>
      <AddDialog ref={dialogRef} onSearch={search} />
    </section>
  )
}
