import { ReactNode, useEffect, useState, MutableRefObject, useRef } from 'react'
import {
  Button,
  Select,
  Form,
  Input,
  DatePicker,
  ConfigProvider,
  Table,
  App,
  Row,
  Col,
  Space,
  Checkbox,
  Popconfirm,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { RangePickerProps } from 'antd/es/date-picker'
import AddChannel from './dialog/addChannel'
import ChannelDetail from './dialog/channelDetail/channelDetail'
import MenuTitle from '@/components/menuTitle/menuTitle'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { getSendList } from '@/api'
import { useSize } from '@/hooks'
import { API } from 'apis'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'

import './channel.scss'

interface DataType {
  id: string
  channel_name: string
  channel_type: string
  speed: string
  prefix: string
}
interface FormValues {
  channel: string
  group: string
  time: [Dayjs, Dayjs] | null
  keyword: string
}

// 发送列表
export default function Channel() {
  const addChannelDialogRef: MutableRefObject<any> = useRef(null)
  const detailRef: MutableRefObject<any> = useRef(null)

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

  const RenderConfig = (_: any, record: DataType) => {
    return (
      <Row gutter={16} className='config-wrap'>
        <Col>
          <div title='添加配置' className={`icon iconfont icon-peizhi`}></div>
        </Col>
        <Col>
          <div title='建立连接' className={`icon iconfont icon-lianjie`}></div>
        </Col>
        <Col>
          <div title='关闭连接' className={`icon iconfont icon-duanlian`}></div>
        </Col>
        <Col>
          <div title='删除配置' className={`icon iconfont icon-peizhi`}></div>
        </Col>
      </Row>
    )
  }

  const columns: ColumnsType<DataType> = [
    {
      title: '通道名',
      width: 120,
      className: 'paddingL30',
      dataIndex: 'channel_name',
    },
    {
      title: '通道类型',
      dataIndex: 'channel_type',
    },
    {
      title: '流速',
      dataIndex: 'speed',
    },
    {
      title: '号码前缀',
      dataIndex: 'prefix',
    },
    {
      title: '关联国家',
      width: 100,
      render: (_, record) => (
        <Button
          type='link'
          onClick={() => showDetail(record)}
          style={{ padding: 0 }}>
          查看详情
        </Button>
      ),
    },
    {
      title: '通道状态',
      render: (_, record) => <div className='color-success'>已开启</div>,
    },
    {
      title: '连接状态',
      render: (_, record) => <div className='color-success'>已开启</div>,
    },
    {
      title: '链路数量',
      width: 80,
      render: (_, record) => <div>1</div>,
    },
    {
      title: '配置',
      width: 160,
      render: RenderConfig,
    },
    {
      title: '操作',
      width: 120,
      render: (_, record) => (
        <>
          <Button
            type='link'
            onClick={() => showDetail(record)}
            style={{ padding: 0 }}>
            编辑
          </Button>
          <Button type='link' onClick={() => showDetail(record)}>
            删除
          </Button>
        </>
      ),
    },
  ]

  const data: DataType[] = []
  for (let i = 0; i < 100; i++) {
    data.push({
      id: 'id' + i,
      channel_name: 'string' + i,
      channel_type: 'string',
      speed: 'string',
      prefix: 'string',
    })
  }

  const addChannelEvent = () => {
    addChannelDialogRef.current.open()
  }
  const showDetail = (record: DataType) => {
    detailRef.current.open()
  }

  return (
    <div data-class='channel'>
      <MenuTitle title='通道管理'></MenuTitle>
      <div className='btn-group' style={{ marginBottom: '10px' }}>
        <div className='btn' onClick={addChannelEvent}>
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
          // onConfirm={deleteEvent}
          okText='确定'
          cancelText='取消'>
          <div className='btn'>
            <i className='icon iconfont icon-shanchu'></i>
            <span>连接</span>
          </div>
        </Popconfirm>
        <Popconfirm
          placement='bottom'
          title='警告'
          description='确定删除选中的客户吗？'
          // onConfirm={deleteEvent}
          okText='确定'
          cancelText='取消'>
          <div className='btn'>
            <i className='icon iconfont icon-shanchu'></i>
            <span>断连</span>
          </div>
        </Popconfirm>
        <Popconfirm
          placement='bottom'
          title='警告'
          description='确定删除选中的客户吗？'
          // onConfirm={deleteEvent}
          okText='确定'
          cancelText='取消'>
          <div className='btn delete'>
            <i className='icon iconfont icon-shanchu'></i>
            <span>还原</span>
          </div>
        </Popconfirm>
        <Popconfirm
          placement='bottom'
          title='警告'
          description='确定删除选中的客户吗？'
          // onConfirm={deleteEvent}
          okText='确定'
          cancelText='取消'>
          <div className='btn delete line'>
            <i className='icon iconfont icon-shanchu'></i>
            <span>删除</span>
          </div>
        </Popconfirm>
      </div>
      <ConfigProvider
        theme={{
          token: {
            colorBgContainer: 'transparent',
          },
        }}>
        <Table
          className='theme-cell bg-white'
          columns={columns}
          dataSource={data}
          sticky
          pagination={false}
          rowKey={'id'}
          onRow={onRow}
          rowSelection={rowSelection}
          rowClassName={(record, index) =>
            index == activeIndex ? 'active' : ''
          }
          scroll={{ x: 'max-content' }}
        />
      </ConfigProvider>
      <AddChannel ref={addChannelDialogRef} />
      <ChannelDetail ref={detailRef} />
    </div>
  )
}
