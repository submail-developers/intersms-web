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
import AddKeyword from './dialog/addKeyword'
import MenuTitle from '@/components/menuTitle/menuTitle'
import { getkeyWord, deletekeyWord, keyWordStopUsing } from '@/api'
import { API } from 'apis'
import { useSize } from '@/hooks'
interface DataType extends API.GetkeyWordItems {}
interface SwitchProps {
  record: DataType
}

// 发送列表
export default function Channel() {
  const size = useSize()
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
    columnWidth: size == 'small' ? 32 : 60,
    fixed: true,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys)
    },
  }

  useEffect(() => {
    search()
  }, [])

  const search = async () => {
    const res = await getkeyWord({
      id: '',
    })
    settableData(res.data)
  }
  const [tableData, settableData] = useState<API.GetkeyWordItems[]>([])
  const addSensitiveWordListRef: MutableRefObject<any> = useRef(null)
  const { message } = App.useApp()

  const columns: ColumnsType<DataType> = [
    {
      title: '条目名称',
      width: size == 'small' ? 80 : 200,
      className: size == 'small' ? '' : 'paddingL30',
      fixed: true,
      render: (_, record) => (
        <div
          className='g-ellipsis fw500'
          style={{ width: size == 'small' ? '80px' : '160px' }}
          title={record.name}>
          {record.name}
        </div>
      ),
    },
    {
      title: '关键词',
      width: 240,
      dataIndex: 'keywords',
      render: (_, record) => (
        <span className='color-words g-ellipsis-2' title={record.keywords}>
          {record.keywords}
        </span>
      ),
    },
    {
      title: '备注',
      dataIndex: 'comment',
      width: 160,
      className: 'paddingL50',
      render: (_, record) => (
        <span className='g-ellipsis-2'>{record.comment}</span>
      ),
    },
    {
      title: '启用状态',
      dataIndex: 'enabled',
      width: 120,
      render: (_, record: DataType) => (
        <div className='switch-all fx-shrink'>
          <SwitchNode record={record}></SwitchNode>
          &nbsp;
          {record.enabled == '1' ? (
            <span className='color-gray'>已启用</span>
          ) : (
            <span>未启用</span>
          )}
        </div>
      ),
    },
    {
      title: '操作',
      className: 'paddingL50',
      width: 160,
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
              description='确定删除该条关键字吗？'
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
    await deletekeyWord({ id })
    await search()
  }
  // 批量删除事件
  const deleteEvent = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请勾选要删除的客户！')
      return
    }
    const id = selectedRowKeys.join(',')
    await deletekeyWord({ id })
    await search()
  }

  // switch
  const SwitchNode = (props: SwitchProps) => {
    const [loading, setloading] = useState(false)
    // 修改开启状态
    const changeState = async (_: any, event: any) => {
      event.stopPropagation()
      setloading(true)
      await keyWordStopUsing({
        id: props.record.id,
        status: props.record.enabled == '1' ? '0' : '1',
      })
      await search()
      setloading(false)
    }
    return (
      <Switch
        size='small'
        checked={props.record.enabled == '1'}
        loading={loading}
        onClick={(_, event) => changeState(_, event)}></Switch>
    )
  }

  // 批量停用/启用
  const batchDeactivation = async (isOnOff: any) => {
    if (isOnOff === '0') {
      if (selectedRowKeys.length === 0) {
        message.warning('请勾选要停用的关键字！')
        return
      }
      const id = selectedRowKeys.join(',')
      const status = '0'
      await keyWordStopUsing({ id, status })
    } else {
      if (selectedRowKeys.length === 0) {
        message.warning('请勾选要启用的关键字！')
        return
      }
      const id = selectedRowKeys.join(',')
      const status = '1'
      await keyWordStopUsing({ id, status })
    }

    await search()
    setSelectedRowKeys([])
  }

  const addSensitiveEvent = (isAdd: boolean = true, record?: DataType) => {
    addSensitiveWordListRef.current.open({ isAdd, record })
  }

  return (
    <div data-class='channel'>
      <MenuTitle title='关键字管理'></MenuTitle>
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
              description='确定启用选中的关键字吗？'
              onConfirm={() => batchDeactivation('1')}
              okText='确定'
              cancelText='取消'>
              <div className='btn'>
                <i className='icon iconfont icon-qiyong'></i>
                <span>启用</span>
              </div>
            </Popconfirm>
            <Popconfirm
              placement='bottom'
              title='警告'
              description='确定停用选中的关键字吗？'
              onConfirm={() => batchDeactivation('0')}
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
              description='确定删除选中的关键字吗？'
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
      <AddKeyword ref={addSensitiveWordListRef} onSearch={search} />
    </div>
  )
}
