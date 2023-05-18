import { useAppDispatch } from '@/store/hook'
import { changeActiveAccountId } from '@/store/reducers/accountInfo'
import { useState, useEffect, useRef, MutableRefObject } from 'react'
import { Input, ConfigProvider, Table, Popconfirm, App } from 'antd'
import type { ColumnsType } from 'antd/es/table'
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
  const size = useSize()
  const [keyword, setkeyword] = useState<string>('')
  // 列表
  const [tableData, settableData] = useState<API.AccountListItem[]>([])

  // 被点击的客户(不是被checkbox选中的客户)
  const [activeIndex, setactiveIndex] = useState<number>()
  // 选中的keys
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const onRow = (record: DataType, index?: number) => {
    return {
      onClick: () => {
        setactiveIndex(index)
      },
      onDoubleClick: () => {
        if (selectedRowKeys.includes(record.account)) {
          setSelectedRowKeys(
            selectedRowKeys.filter((item) => item != record.account),
          )
        } else {
          setSelectedRowKeys([...selectedRowKeys, record.account])
        }
      },
    }
  }
  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys)
    },
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'sender',
      dataIndex: 'sender',
      ellipsis: true,
    },
    {
      title: 'account',
      dataIndex: 'account',
      className: 'account-wrap',
      ellipsis: true,
      width: 210,
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
      setactiveIndex(0)
    } else {
      dispatch(changeActiveAccountId(''))
      setactiveIndex(0)
    }
  }

  // 删除事件
  const deleteEvent = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请勾选要删除的客户！')
      return
    }
    const account = selectedRowKeys.join(',')
    await deleteAccount({ account })
    await search()
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
        {/* <div className='btn'>
          <i className='icon iconfont icon-bianji'></i>
          <span>编辑</span>
        </div> */}
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
      <div className='filter-wrap fx-col'>
        <div className='input-wrap'>
          <Input
            bordered={false}
            placeholder='请输入关键字过滤'
            maxLength={20}
            allowClear
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
              className='theme-cell bg-gray'
              showHeader={false}
              columns={columns}
              dataSource={tableData}
              rowKey={'account'}
              onRow={onRow}
              rowSelection={rowSelection}
              rowClassName={(record, index) =>
                index == activeIndex ? 'active' : ''
              }
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
