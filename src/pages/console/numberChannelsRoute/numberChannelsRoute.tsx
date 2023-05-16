import { useEffect, useState, MutableRefObject, useRef } from 'react'
import {
  Button,
  Select,
  Form,
  Input,
  ConfigProvider,
  Table,
  Row,
  Col,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import AddDialog from './dialog/addDialog'
import MenuTitle from '@/components/menuTitle/menuTitle'
import type { Dayjs } from 'dayjs'
import { useSize } from '@/hooks'
import { API } from 'apis'

import './numberChannelsRoute.scss'

interface DataType {
  id: string
  mobile: string
  message_type: string
  channels: string
  send_name: string
}
interface FormValues {
  channel: string
  group: string
  time: [Dayjs, Dayjs] | null
  keyword: string
}

// 号码通道路由
export default function NumberChannelsRoute() {
  const addDialogRef: MutableRefObject<any> = useRef(null)
  const { Option } = Select
  const size = useSize()
  const [form] = Form.useForm()

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

  const messageList = [
    { label: '短信类型', value: 'all' },
    { label: '短信类型1', value: '1' },
    { label: '短信类型2', value: '2' },
  ]
  const groupList = [
    { label: '全部通道组', value: 'all' },
    { label: '通道组1', value: '1' },
    { label: '通道组2', value: '2' },
  ]

  const onFinish = (values: FormValues) => {}

  const columns: ColumnsType<DataType> = [
    {
      title: '手机号码',
      dataIndex: 'mobile',
      className: 'paddingL30',
      width: '20%',
    },
    {
      title: '短信类型',
      width: '20%',
      dataIndex: 'message_type',
    },
    {
      title: '通道组',
      width: '20%',
      dataIndex: 'channels',
    },
    {
      title: '发送名',
      width: '20%',
      dataIndex: 'send_name',
    },
    {
      title: '操作',
      render: (_, record) => (
        <div>
          <Button type='link' style={{ paddingLeft: 0 }}>
            编辑
          </Button>
          <Button type='link'>删除</Button>
        </div>
      ),
    },
  ]

  const data: DataType[] = []
  for (let i = 0; i < 100; i++) {
    data.push({
      id: 'id' + i,
      mobile: '+8613112345678',
      message_type: '中国' + i,
      channels: 'CN',
      send_name: '+86',
    })
  }

  const updateCountryEvent = () => {
    addDialogRef.current.open()
  }

  return (
    <div data-class='numberChannelsRoute'>
      <MenuTitle title='号码通道路由配置'></MenuTitle>
      <Row justify='space-between' wrap align={'bottom'}>
        <Col>
          <div className='btn-group' style={{ marginBottom: '10px' }}>
            <div className='btn' onClick={updateCountryEvent}>
              <i className='icon iconfont icon-bianji'></i>
              <span>新增</span>
            </div>
            <div className='btn' onClick={updateCountryEvent}>
              <i className='icon iconfont icon-bianji'></i>
              <span>编辑</span>
            </div>
            <div className='btn delete'>
              <i className='icon iconfont icon-bianji'></i>
              <span>删除</span>
            </div>
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
              initialValues={{ message_type: 'all', channels_type: 'all' }}
              layout='inline'
              wrapperCol={{ span: 24 }}
              onFinish={onFinish}
              autoComplete='off'>
              <Form.Item label='' name='country' style={{ marginBottom: 10 }}>
                <Input
                  size={size}
                  placeholder='手机号码/发送名'
                  maxLength={20}
                  style={{ width: 220 }}></Input>
              </Form.Item>
              <Form.Item
                label=''
                name='message_type'
                style={{ marginBottom: 10 }}>
                <Select
                  placeholder='短信类型'
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
                  {messageList.map((item) => (
                    <Option value={item.value} key={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label=''
                name='channels_type'
                style={{ marginBottom: 10 }}>
                <Select
                  placeholder='通道组'
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
          className='theme-cell bg-white reset-table'
          columns={columns}
          dataSource={data}
          rowKey={'id'}
          onRow={onRow}
          rowSelection={rowSelection}
          rowClassName={(record, index) =>
            index == activeIndex ? 'active' : ''
          }
          sticky
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      </ConfigProvider>
      <AddDialog ref={addDialogRef} />
    </div>
  )
}
