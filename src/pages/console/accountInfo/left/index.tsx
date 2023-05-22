import { useAppDispatch } from '@/store/hook'
import { changeActiveAccount } from '@/store/reducers/accountInfo'
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
  const [keyword, setkeyword] = useState<string>('') // 搜索关键字
  const [tableData, settableData] = useState<API.AccountListItem[]>([]) // table列表
  const [activeRow, setactiveRow] = useState<DataType | null>(null) // 被点击的客户(不是被checkbox选中的客户)
  const onRow = (record: DataType, index?: number) => {
    return {
      onClick: () => {
        setactiveRow(record)
        dispatch(changeActiveAccount(record))
      },
    }
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'sender',
      dataIndex: 'sender',
      className: 'paddingL30',
      ellipsis: true,
      width: '50%',
    },
    {
      title: 'account',
      dataIndex: 'account',
      className: 'paddingR30',
      ellipsis: true,
      width: '50%',
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
      dispatch(changeActiveAccount(res.data[0]))
      setactiveRow(res.data[0])
    } else {
      dispatch(changeActiveAccount(null))
      setactiveRow(null)
    }
  }

  // 删除事件
  const deleteEvent = async () => {
    if (activeRow) {
      await deleteAccount({ account: activeRow.account })
      await search()
      message.warning('删除成功！')
    } else {
      message.warning('请选择客户！')
    }
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
              record.account == activeRow?.account ? 'active' : ''
            }
            pagination={false}
            scroll={{ y: 450 }}
          />
        </ConfigProvider>
      </div>
      <AddDialog ref={dialogRef} onSearch={search} />
    </section>
  )
}
