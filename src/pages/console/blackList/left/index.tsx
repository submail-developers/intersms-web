import { useAppDispatch, useAppSelector } from '@/store/hook'
import {
  changeActiveAccountId,
  //  accountInfoState
} from '@/store/reducers/accountInfo'
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
      ellipsis: true,
      width: 50,
      render: (_, record) => {
        return (
          <div className='fx-end-start' style={{ paddingRight: '10px' }}>
            <Switch checkedChildren='on' unCheckedChildren='off' size='small' />
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
    dispatch(changeActiveAccountId('string'))
    setSelectedRowKeys(['string'])

    // const res = await getAccountList({
    //   keyword,
    //   page: '1',
    // })
    // settableData(res.data)
    // if (res.data.length > 0) {
    //   dispatch(changeActiveAccountId(res.data[0].account))
    //   setSelectedRowKeys([res.data[0].account])
    // } else {
    //   dispatch(changeActiveAccountId(''))
    //   setSelectedRowKeys([''])
    // }
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
    await initData()
  }
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
        <div className='table-wrap fx-shrink'>
          <ConfigProvider
            theme={{
              token: {
                colorBgContainer: 'transparent',
              },
            }}>
            <Table
              className='theme-cell reset-theme bg-gray'
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
      <AddDialog ref={dialogRef} onSearch={initData} />
    </section>
  )
}
