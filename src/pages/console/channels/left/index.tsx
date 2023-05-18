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
import { getChannelGroupList, deleteAccount } from '@/api'
import { API } from 'apis'
import './index.scss'

interface DataType extends API.GetChannelGroupListItem {}

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
  const [tableData, settableData] = useState<API.GetChannelGroupListItem[]>([])
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
        if (selectedRowKeys.includes(record.id)) {
          setSelectedRowKeys(
            selectedRowKeys.filter((item) => item != record.id),
          )
        } else {
          setSelectedRowKeys([...selectedRowKeys, record.id])
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
      title: '通道组名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '通道组类型',
      ellipsis: true,
      width: 100,
      render: (_, record) => (
        <div>{record.type == '0' ? '行业通道' : '营销通道'}</div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 50,
      render: (_, record) => (
        <Switch
          checkedChildren='on'
          unCheckedChildren='off'
          size='small'></Switch>
      ),
    },
  ]

  const setValue = (e: any) => {
    setkeyword(e.target.value)
  }

  useEffect(() => {
    search()
  }, [])

  const search = async () => {
    const res = await getChannelGroupList({ page: '1', id: '', keyword: '' })
    settableData(res.data)
    // dispatch(changeActiveAccountId('string'))
    setactiveIndex(0)
  }

  // 删除事件
  const deleteEvent = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请勾选要删除的客户！')
      return
    }
    // const id = selectedRowKeys.join(',')
    await search()
  }
  // 开启dialog
  const openAddDialog = () => {
    dialogRef.current.open()
  }

  return (
    <section data-class='channels-left' className={`${size}`}>
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
        <div className='table-title'>全部通道组</div>
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
              rowKey={'id'}
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
