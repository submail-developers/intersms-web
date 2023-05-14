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
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { RangePickerProps } from 'antd/es/date-picker'

import MenuTitle from '@/components/menuTitle/menuTitle'
import MyFormItem from '@/components/antd/myFormItem/myFormItem'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { getSendList } from '@/api'
import { useSize } from '@/hooks'
import { API } from 'apis'

import './sendList.scss'

interface DataType extends API.SendListItem {}
interface FormValues {
  channel: string
  group: string
  time: [Dayjs, Dayjs] | null
  keyword: string
}

// 发送列表
export default function SendList() {
  const { Option } = Select
  const { RangePicker } = DatePicker
  const size = useSize()
  const [form] = Form.useForm()

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

  const formatSearchValue = (params: FormValues) => {
    const { channel, group, time, keyword } = params
    const start = (time && time[0].format('YYYY-MM-DD')) || ''
    const end = (time && time[1].format('YYYY-MM-DD')) || ''
    const searchParams = {
      page: '1',
      type: 'all',
      start,
      end,
      channel,
      group,
      keyword,
    }
    searchEvent(searchParams)
  }

  // 获取列表数据
  const searchEvent = async (params: API.GetSendListParams) => {
    try {
      const res = await getSendList(params)
      settableData(res.data)
    } catch (error) {
      console.log(error)
    }
  }
  const resetForm = () => {
    form.resetFields()
    formatSearchValue(initFormValues)
  }

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
      title: '号码',
      dataIndex: 'mobile',
      width: 150,
    },
    {
      title: '短信正文',
      dataIndex: 'message',
      width: 320,
      render: (_, record) => (
        <Tooltip title={record.content} placement='bottom'>
          <div className='g-ellipsis-2'>{record.content}</div>
        </Tooltip>
      ),
    },
    {
      title: '发送名称',
      dataIndex: 'sender',
      width: 100,
    },
    {
      title: '请求/完成时间',
      dataIndex: 'time',
      width: 200,
      render: (_, recort) => {
        return (
          <span>
            {recort.send}
            <br />
            {recort.sent}
          </span>
        )
      },
    },
    {
      title: '下行耗时',
      dataIndex: 'timer',
      width: 100,
      render: (_, recort) => <span style={{ color: '#0074d7' }}>3s</span>,
    },
    {
      title: '回执',
      dataIndex: 'report_state',
      render: (_, recort) => (
        <span style={{ color: '#00ae6f' }}>{recort.report_state}</span>
      ),
    },
    {
      title: '国家',
      dataIndex: 'region_code',
    },
    {
      title: '通道',
      dataIndex: 'channel_name',
    },
    {
      title: '通道组',
      dataIndex: 'group_name',
      width: 200,
    },
    {
      title: '网络类型',
      dataIndex: 'report_code',
      width: 100,
    },
    {
      title: '短信类型',
      dataIndex: 'type',
      width: 100,
    },
    {
      title: '成本/计费价',
      dataIndex: 'price',
      width: 120,
      render: (_, recort) => {
        return (
          <span>
            <span style={{ color: '#888888' }}>{recort.fee}</span>
            <br />
            {recort.cost}
          </span>
        )
      },
    },
  ]

  const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | string[]>(
    [],
  )

  const rowSelection = {
    selectedRowKeys,
    onChange: () => {},
    hideSelectAll: true,
    columnWidth: 4,
    renderCell: (
      checked: boolean,
      record: DataType,
      index: number,
      originNode: ReactNode,
    ) => {
      return null
    },
  }
  // 点击整行选择
  const onSelectRow = (record: DataType) => {
    setSelectedRowKeys([record.id])
  }

  return (
    <div data-class='sendlist'>
      <MenuTitle title='发送列表'></MenuTitle>
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
          layout={size == 'small' ? 'inline' : 'inline'}
          wrapperCol={{ span: 24 }}
          onFinish={onFinish}
          autoComplete='off'>
          <Form.Item label='' name='channel' style={{ marginBottom: 10 }}>
            <Select
              placeholder='请选择通道'
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
          <Form.Item label='' name='group' style={{ marginBottom: 10 }}>
            <Select
              placeholder='请选择通道组'
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

          <MyFormItem
            size={size}
            label='注册时间'
            style={{ marginBottom: '10px' }}>
            <Form.Item label='' name='time' style={{ marginBottom: '0px' }}>
              <RangePicker
                size={size}
                bordered={false}
                disabledDate={disabledDate}
                presets={rangePresets}
                clearIcon={false}
                style={{ width: size == 'small' ? 190 : 240 }}></RangePicker>
            </Form.Item>
          </MyFormItem>
          <Form.Item label='' name='keyword' style={{ marginBottom: 10 }}>
            <Input
              size={size}
              placeholder='账户/手机号/国家'
              maxLength={20}
              style={{ width: 162 }}></Input>
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
          <Form.Item style={{ marginBottom: 10 }}>
            <div
              className={`refresh fx-center-center ${size}`}
              onClick={resetForm}>
              <i className={`icon iconfont icon-shuaxin1`}></i>
            </div>
          </Form.Item>
        </Form>
      </ConfigProvider>
      <Table
        className='theme-cell reset-theme'
        rowKey='id'
        columns={columns}
        dataSource={tableData}
        pagination={false}
        sticky
        rowSelection={rowSelection}
        onRow={(record) => ({
          onClick: () => onSelectRow(record),
        })}
        scroll={{ x: 'max-content' }}
      />
    </div>
  )
}
