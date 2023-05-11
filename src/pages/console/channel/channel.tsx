import { ReactNode, useEffect, useState } from 'react'
import {
  Button,
  Select,
  Form,
  Input,
  DatePicker,
  ConfigProvider,
  Table,
  Tooltip,
  App,
  Row,
  Col,
  Space,
  Checkbox,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { RangePickerProps } from 'antd/es/date-picker'

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

  const onFinish = (values: FormValues) => {
    formatSearchValue(values)
  }

  const formatSearchValue = (params: FormValues) => {}

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current >= dayjs().endOf('day') // 无法选择今天以后的日期
  }
  const rangePresets: {
    label: string
    value: [Dayjs, Dayjs]
  }[] = [
    { label: '最近7天', value: [dayjs().add(-8, 'd'), dayjs().add(-1, 'd')] },
    { label: '最近14天', value: [dayjs().add(-15, 'd'), dayjs().add(-1, 'd')] },
    { label: '最近30天', value: [dayjs().add(-31, 'd'), dayjs().add(-1, 'd')] },
    { label: '最近90天', value: [dayjs().add(-91, 'd'), dayjs().add(-1, 'd')] },
  ]

  const [tableData, settableData] = useState<DataType[]>([])
  useEffect(() => {
    formatSearchValue(initFormValues)
  }, [])

  const columns: ColumnsType<DataType> = [
    {
      title: <Checkbox></Checkbox>,
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
      title: '操作',
      dataIndex: 'actions',
      render: (_, record) => (
        <div>
          <Button type='link' style={{ paddingLeft: 0, paddingRight: 0 }}>
            编辑
          </Button>
          <Button type='link'>删除</Button>
        </div>
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
  for (let i = 0; i < 10; i++) {
    data.push({
      id: 'id' + i,
      channel_name: 'string' + i,
      access_type: 'string',
      channel_type: 'string',
      speed: 'string',
      prefix: 'string',
    })
  }

  return (
    <div data-class='channel'>
      <MenuTitle title='通道管理'></MenuTitle>
      <Row justify='space-between' wrap>
        <Col>
          <Space.Compact size={size}>
            <Button
              type='primary'
              icon={<i className={`icon iconfont icon-xinzeng ${size}`} />}>
              新增
            </Button>
            <Button
              type='primary'
              icon={<i className={`icon iconfont icon-bianji ${size}`} />}>
              编辑
            </Button>
            <Button
              type='primary'
              danger
              icon={<i className={`icon iconfont icon-shanchu ${size}`} />}>
              删除
            </Button>
          </Space.Compact>
        </Col>
        <Col>
          <Form
            name='basic'
            form={form}
            initialValues={initFormValues}
            layout={size == 'small' ? 'inline' : 'inline'}
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
            <Form.Item label='' name='access_type' style={{ marginBottom: 10 }}>
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
          rowKey={'account'}
          sticky
          pagination={false}
        />
      </ConfigProvider>
    </div>
  )
}
