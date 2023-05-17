import { useEffect, useState, MutableRefObject, useRef } from 'react'
import {
  ConfigProvider,
  Table,
  App,
  Row,
  Col,
  Popconfirm,
  Switch,
  Button,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import AddSensitive from './dialog/addSensitiveWord'
import MenuTitle from '@/components/menuTitle/menuTitle'
import {
  GetSensitiveWordList,
  DeleteSensitiveWordList,
  SensitiveWordListStopUsing,
} from '@/api'
import { API } from 'apis'

import './sensitiveWord.scss'

// 发送列表
export default function Channel() {
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

  useEffect(() => {
    search()
  }, [])

  const search = async () => {
    const res = await GetSensitiveWordList({
      id: '',
      page: '1',
    })
    settableData(res.data)
    if (res.data.length > 0) {
      // dispatch(changeActiveAccountId(res.data[0].account))
      // setSelectedRowKeys([res.data[0].account])
    } else {
      // dispatch(changeActiveAccountId(''))
      // setSelectedRowKeys([''])
    }
  }
  const [tableData, settableData] = useState<API.GetSensitiveWordListItems[]>(
    [],
  )
  const addSensitiveWordListRef: MutableRefObject<any> = useRef(null)
  const { message } = App.useApp()

  interface DataType extends API.GetSensitiveWordListItems {}

  const small_tip = `<div>123</div>`
  const columns: ColumnsType<DataType> = [
    {
      title: '类目名称',
      dataIndex: 'name',
      width: 160,
      className: 'paddingL30',
    },
    {
      title: (
        <span>
          敏感词{' '}
          <span style={{ fontSize: '12px', paddingLeft: '10px' }}>
            特定格式: (赌博|股票)
          </span>{' '}
        </span>
      ),

      width: 600,
      dataIndex: 'keywords',
    },
    {
      title: '备注',
      dataIndex: 'comment',
      width: 160,
    },
    {
      title: '启用状态',
      dataIndex: 'enabled',
      width: 160,
      render: (_, record: DataType) => (
        <div className='switch-all fx-shrink'>
          <Switch
            size={'small'}
            checked={record.enabled == '1'}
            onChange={(checked) => setSwicth(record, checked)}></Switch>{' '}
          &nbsp;
          <span>{record.enabled == '1' ? '已启用' : '未启用'}</span>
        </div>
      ),
    },
    {
      title: '操作',
      width: 120,
      render: (_, record) => (
        <>
          <Button
            type='link'
            onClick={() => addSensitiveEvent(false, record)}
            style={{ paddingLeft: 0 }}>
            编辑
          </Button>
          <Button type='link'>
            <Popconfirm
              placement='left'
              title='警告'
              description='确定删除该条敏感词吗？'
              onConfirm={() => singleDeleteEvent(record.id)}
              okText='确定'
              cancelText='取消'>
              删除
            </Popconfirm>
          </Button>
        </>
      ),
    },
  ]
  // 单独删除事件
  const singleDeleteEvent = async (id: any) => {
    await DeleteSensitiveWordList({ id })
    await search()
  }
  // 批量删除事件
  const deleteEvent = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请勾选要删除的客户！')
      return
    }
    const id = selectedRowKeys.join(',')
    await DeleteSensitiveWordList({ id })
    await search()
    setSelectedRowKeys([])
  }
  //单独启用 停用事件
  const setSwicth = async (record: any, checked: any) => {
    let id = record.id
    if (checked == true) {
      const status = '1'
      await SensitiveWordListStopUsing({ id, status })
      await search()
    } else {
      const status = '0'
      await SensitiveWordListStopUsing({ id, status })
      await search()
    }
  }
  //批量停用
  const batchDeactivation = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请勾选要停用的客户！')
      return
    }
    const id = selectedRowKeys.join(',')
    const status = '0'
    await SensitiveWordListStopUsing({ id, status })
    await search()
    setSelectedRowKeys([])
  }

  const addSensitiveEvent = (isAdd: boolean = true, record?: DataType) => {
    addSensitiveWordListRef.current.open({ isAdd, record })
  }

  return (
    <div data-class='channel'>
      <MenuTitle title='敏感词管理'></MenuTitle>
      <Row justify='space-between' wrap align={'bottom'}>
        <Col>
          <div className='btn-group' style={{ marginBottom: '10px' }}>
            <div className='btn' onClick={() => addSensitiveEvent()}>
              <i className='icon iconfont icon-xinzeng'></i>
              <span>新增</span>
            </div>
            <Popconfirm
              placement='bottom'
              title='警告'
              description='确定停用选中的敏感词吗？'
              onConfirm={batchDeactivation}
              okText='确定'
              cancelText='取消'>
              <div className='btn'>
                <i className='icon iconfont icon-tingyong'></i>
                <span>停用</span>
              </div>
            </Popconfirm>
            <Popconfirm
              placement='bottom'
              title='警告'
              description='确定删除选中的敏感词吗？'
              onConfirm={deleteEvent}
              okText='确定'
              cancelText='取消'>
              <div className='btn delete'>
                <i className='icon iconfont icon-shanchu'></i>
                <span>删除</span>
              </div>
            </Popconfirm>
          </div>
        </Col>
      </Row>
      <ConfigProvider
        theme={{
          token: {
            colorBgContainer: 'transparent',
          },
        }}>
        <Table
          className='theme-cell bg-white'
          columns={columns}
          dataSource={tableData}
          rowKey={'id'}
          onRow={onRow}
          rowSelection={rowSelection}
          rowClassName={(record, index) =>
            index == activeIndex ? 'active' : ''
          }
          sticky
          pagination={{ position: ['bottomRight'] }}
          scroll={{ x: 'max-content' }}
        />
      </ConfigProvider>
      <AddSensitive ref={addSensitiveWordListRef} onSearch={search} />
    </div>
  )
}
