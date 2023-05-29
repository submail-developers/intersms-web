import { useAppDispatch } from '@/store/hook'
// import { changeActiveAccountId } from '@/store/reducers/accountInfo'
import { useState, useEffect, useRef, MutableRefObject } from 'react'
import { Input, ConfigProvider, Table, App } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'

import { useSize } from '@/hooks'
import { getAccountList, deleteAccount } from '@/api'
import { API } from 'apis'

interface DataType extends API.AccountListItem {}

import './numberAttribution.scss'
import MenuTitle from '@/components/menuTitle/menuTitle'

// 号码归属查询
export default function NumberAttr() {
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
      title: '国家/地区',
      ellipsis: true,
      width: '120px',
      render: (_, record) => <div>中国</div>,
    },
    {
      title: '国家/地区代码',
      render: (_, record) => <div>CN</div>,
    },
    {
      title: '运营商',
      width: '120px',
      render: (_, record) => <div>中国移动</div>,
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
      // dispatch(changeActiveAccountId(res.data[0].account))
      setSelectedRowKeys([res.data[0].account])
    } else {
      // dispatch(changeActiveAccountId(''))
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
    <div data-class='numberAttribution'>
      <MenuTitle title='号码归属查询'></MenuTitle>
      <div className={`attr-wrap fx-col-start-center ${size}`}>
        <div className='title'>号码归属查询</div>
        <div className='sub-title'>查询号码所在国家、地区和网络信息</div>
        <div className='input-wrap'>
          <Input
            bordered={false}
            placeholder='请输入国家/地区/国家代码'
            maxLength={20}
            allowClear
            suffix={
              <i
                onClick={search}
                className='icon iconfont icon-sousuo fn14'
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
        <div className='table-wrap fx-shrink'>
          <ConfigProvider
            theme={{
              token: {
                colorBgContainer: 'transparent',
              },
            }}>
            <Table
              className='reset-theme'
              columns={columns}
              dataSource={tableData}
              rowKey={'id'}
              pagination={false}
              scroll={{ y: 480, x: 'max-content' }}
            />
          </ConfigProvider>
        </div>
      </div>
    </div>
  )
}
