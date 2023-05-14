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
  access_type: string
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
  const { Option } = Select
  const { RangePicker } = DatePicker
  const size = useSize()
  const [form] = Form.useForm()
  const { message } = App.useApp()

  const channelList = [
    { label: '全部通道', value: 'all' },
    { label: '通道1', value: '1' },
    { label: '通道2', value: '2' },
  ]
  const groupList = [
    { label: '全部通道组', value: 'all' },
    { label: '通道组1', value: '1' },
    { label: '通道组2', value: '2' },
  ]

  // 初始化form的值
  const initFormValues: FormValues = {
    channel: 'all',
    group: 'all',
    time: [dayjs().add(-8, 'd'), dayjs().add(-1, 'd')],
    keyword: '',
  }

  const onFinish = (values: FormValues) => {}

  const columns: ColumnsType<DataType> = [
    {
      title: <Checkbox></Checkbox>,
      dataIndex: 'checkbox',
      className: 'checkbox-wrap',
      width: 60,
      render: (_, record) => (
        <Checkbox
          className='checkbox'
          onChange={(e) => onChange(e, record)}></Checkbox>
      ),
    },
    {
      title: '通道名',
      dataIndex: 'channel_name',
      onCell: (record: DataType) => {
        return {
          onClick: () => {
            setSelectedRowKeys([record.id])
          },
        }
      },
    },
    {
      title: '接入类型',
      dataIndex: 'access_type',
      onCell: (record: DataType) => {
        return {
          onClick: () => {
            setSelectedRowKeys([record.id])
          },
        }
      },
    },
    {
      title: '通道类型',
      dataIndex: 'channel_type',
      onCell: (record: DataType) => {
        return {
          onClick: () => {
            setSelectedRowKeys([record.id])
          },
        }
      },
    },
    {
      title: '流速',
      dataIndex: 'speed',
      onCell: (record: DataType) => {
        return {
          onClick: () => {
            setSelectedRowKeys([record.id])
          },
        }
      },
    },
    {
      title: '号码前缀',
      dataIndex: 'prefix',
      onCell: (record: DataType) => {
        return {
          onClick: () => {
            setSelectedRowKeys([record.id])
          },
        }
      },
    },
    {
      title: '关联国家',
      dataIndex: 'actions',
      render: (_, record) => (
        <Button
          type='link'
          onClick={() => showDetail(record)}
          style={{ padding: 0 }}>
          查看详情
        </Button>
      ),
    },
  ]

  // 被点击的客户(不是被checkbox选中的客户)
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | string[]>(
    [],
  )
  // checkbox勾选的客户
  const [checkedIds, setcheckedIds] = useState<string[]>([])

  // checkbox勾选的事件
  const onChange = (e: CheckboxChangeEvent, record: DataType) => {
    if (e.target.checked) {
      setcheckedIds([...checkedIds, record.id])
    } else {
      setcheckedIds(checkedIds.filter((account) => account !== record.id))
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

  const data: DataType[] = []
  for (let i = 0; i < 100; i++) {
    data.push({
      id: 'id' + i,
      channel_name: 'string' + i,
      access_type: 'string',
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
      <Row justify='space-between' wrap align={'bottom'}>
        <Col>
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
              <div className='btn delete'>
                <i className='icon iconfont icon-shanchu'></i>
                <span>删除</span>
              </div>
            </Popconfirm>
          </div>
        </Col>
        <Col>
          <ConfigProvider
            theme={{
              token: {
                controlHeight: 40,
              },
            }}>
            <Form
              name='basic'
              form={form}
              initialValues={initFormValues}
              layout='inline'
              wrapperCol={{ span: 24 }}
              onFinish={onFinish}
              autoComplete='off'>
              <Form.Item label='' name='name' style={{ marginBottom: 10 }}>
                <Input
                  size={size}
                  placeholder='通道名称'
                  maxLength={20}
                  style={{ width: 162 }}></Input>
              </Form.Item>
              <Form.Item
                label=''
                name='access_type'
                style={{ marginBottom: 10 }}>
                <Select
                  placeholder='接入类型'
                  style={{ width: 162 }}
                  size={size}
                  suffixIcon={
                    <i
                      className='icon iconfont icon-xiala'
                      style={{
                        color: '#000',
                        fontSize: '12px',
                        transform: 'scale(.45)',
                      }}
                    />
                  }>
                  {channelList.map((item) => (
                    <Option value={item.value} key={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label=''
                name='channel_type'
                style={{ marginBottom: 10 }}>
                <Select
                  placeholder='通道类型'
                  style={{ width: 162 }}
                  size={size}
                  suffixIcon={
                    <i
                      className='icon iconfont icon-xiala'
                      style={{
                        color: '#000',
                        fontSize: '12px',
                        transform: 'scale(.45)',
                      }}
                    />
                  }>
                  {groupList.map((item) => (
                    <Option value={item.value} key={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item style={{ marginBottom: 10 }}>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: '#ff5e2d',
                      colorPrimaryHover: '#ff5e2d',
                    },
                  }}>
                  <Button
                    type='primary'
                    size={size}
                    htmlType='submit'
                    style={{ width: 110, marginLeft: 0 }}>
                    搜索
                  </Button>
                </ConfigProvider>
              </Form.Item>
            </Form>
          </ConfigProvider>
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
          dataSource={data}
          rowSelection={rowSelection}
          rowKey={'id'}
          sticky
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      </ConfigProvider>
      <AddChannel ref={addChannelDialogRef} />
      <ChannelDetail ref={detailRef} />
    </div>
  )
}
