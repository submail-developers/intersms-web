import { useEffect, useState } from 'react'
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
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import type { RangePickerProps } from 'antd/es/date-picker'
import MenuTitle from '@/components/menuTitle/menuTitle'
import MyFormItem from '@/components/antd/myFormItem/myFormItem'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { getSendList, getChannelList, getChannelGroupList } from '@/api'
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

enum reportClassName {
  'color-error',
  'color-success',
  'color-gray',
}

const allChannel = { name: '全部通道', id: 'all' } as API.ChannelItem
const allChannels = {
  name: '全部通道组',
  id: 'all',
} as API.GetChannelGroupListItem

// 发送列表
export default function SendList() {
  const { RangePicker } = DatePicker
  const size = useSize()
  const [form] = Form.useForm()
  const [tableData, settableData] = useState<DataType[]>([])
  const [loading, setloading] = useState(false)
  const [total, settotal] = useState<number>(0)
  const [page, setpage] = useState<number>(1)
  const [pageSize, setpageSize] = useState<number>(50)
  // 被点击的客户(不是被checkbox选中的客户)
  const [activeIndex, setactiveIndex] = useState<number>()
  // 通道列表
  const [channelList, setchannelList] = useState<API.ChannelItem[]>([
    allChannel,
  ])
  // 通道组列表
  const [channelsList, setchannelsList] = useState<
    API.GetChannelGroupListItem[]
  >([allChannels])
  // 快捷可选日期
  const rangePresets: {
    label: string
    value: [Dayjs, Dayjs]
  }[] = [
    { label: '最近7天', value: [dayjs().add(-7, 'd'), dayjs().add(0, 'd')] },
    { label: '最近14天', value: [dayjs().add(-14, 'd'), dayjs().add(0, 'd')] },
    { label: '最近30天', value: [dayjs().add(-30, 'd'), dayjs().add(0, 'd')] },
    { label: '最近90天', value: [dayjs().add(-90, 'd'), dayjs().add(0, 'd')] },
  ]

  const changePage = async (_page: number, _pageSize: number) => {
    if (_page != page) setpage(_page)
    if (_pageSize != pageSize) setpageSize(_pageSize)
  }

  const pagination: TablePaginationConfig = {
    position: ['bottomRight'],
    onChange: changePage,
    total: total,
    defaultPageSize: 50,
    pageSizeOptions: [10, 20, 50, 100],
    showQuickJumper: true, // 快速跳转
    showTotal: (total, range) => `共 ${total} 条`,
  }

  // 初始化form的值
  const initFormValues: FormValues = {
    channel: 'all',
    group: 'all',
    time: [dayjs().add(-7, 'd'), dayjs().add(0, 'd')],
    keyword: '',
  }

  // 获取列表数据
  const search = async () => {
    setloading(true)
    const values = await form.getFieldsValue()
    const { channel, group, time, keyword } = values
    const start = (time && time[0].format('YYYY-MM-DD')) || ''
    const end = (time && time[1].format('YYYY-MM-DD')) || ''
    const params = {
      type: 'all',
      start,
      end,
      channel,
      group,
      keyword,
      page,
      limit: pageSize,
    }
    try {
      const res = await getSendList(params)
      settableData(res.data)
      settotal(res.total)
      setloading(false)
    } catch (error) {
      setloading(false)
    }
  }

  const resetForm = () => {
    form.resetFields()
    search()
  }

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current >= dayjs().endOf('day') // 无法选择今天以后的日期
  }

  useEffect(() => {
    form.resetFields()
    getChannel()
    getChannels()
  }, [])

  useEffect(() => {
    search()
  }, [page, pageSize])
  // 获取通道列表
  const getChannel = async () => {
    try {
      const res = await getChannelList()
      setchannelList([...channelList, ...res.data])
    } catch (error) {}
  }
  // 获取通道组列表
  const getChannels = async () => {
    try {
      const res = await getChannelGroupList({})
      setchannelsList([...channelsList, ...res.data])
    } catch (error) {}
  }
  const onRow = (record: DataType, index?: number) => {
    return {
      onClick: () => {
        setactiveIndex(index)
      },
    }
  }

  const columns: ColumnsType<DataType> = [
    {
      title: '号码',
      dataIndex: 'mobile',
      className: size == 'small' ? '' : 'paddingL30',
      width: size == 'small' ? 120 : 150,
      align: size == 'small' ? 'center' : 'left',
      fixed: true,
    },
    {
      title: '发送账户',
      className: size == 'small' ? '' : 'paddingL30',
      width: size == 'small' ? 140 : 180,
      render: (_, record) => (
        <Tooltip
          title={record.account_mail}
          placement='bottom'
          mouseEnterDelay={0.3}
          trigger={['hover']}>
          <div className='g-ellipsis'>
            <a href={record.account_path} target='_blank'>
              {record.account_mail}
            </a>
          </div>
        </Tooltip>
      ),
    },
    {
      title: '短信正文',
      dataIndex: 'message',
      width: 320,
      className: 'paddingL20',
      render: (_, record) => (
        <Tooltip
          title={record.content}
          placement='bottom'
          mouseEnterDelay={0.3}
          trigger={['hover', 'click']}>
          <div className='g-ellipsis-2'>{record.content}</div>
        </Tooltip>
      ),
    },
    {
      title: '发送名称',
      dataIndex: 'sender',
      className: 'paddingL20',
      width: 124,
      render: (_, record) => (
        <div
          style={{ width: 120 }}
          className='g-ellipsis'
          title={record.sender}>
          {record.sender}
        </div>
      ),
    },
    {
      title: '请求/完成时间',
      dataIndex: 'time',
      className: 'paddingL20',
      width: 200,
      render: (_, record) => {
        return (
          <span>
            {record.send}
            <br />
            {record.sent}
          </span>
        )
      },
    },
    {
      title: '下行耗时',
      dataIndex: 'timer',
      className: 'paddingL20',
      width: 80,
      render: (_, record) => (
        <span style={{ color: '#0074d7' }}>{record.downlink_time}s</span>
      ),
    },
    {
      title: '回执',
      dataIndex: 'report_code',
      className: 'paddingL20',
      width: 100,
      render: (_, record) => (
        <div className='g-ellipsis-2'>
          <Tooltip title={record.report_code || '回执未返回'}>
            <span className={`${reportClassName[record.report_state]}`}>
              {record.report_code || '回执未返回'}
            </span>
          </Tooltip>
        </div>
      ),
    },
    {
      title: '国家/地区',
      dataIndex: 'country_cn',
      className: 'paddingL20',
      width: 124,
      render: (_, record) => (
        <div
          style={{ width: 120 }}
          className='g-ellipsis'
          title={record.country_cn}>
          {record.country_cn}
        </div>
      ),
    },
    {
      title: '通道',
      width: 124,
      className: 'paddingL20',
      render: (_, record) => (
        <div
          style={{ width: 120 }}
          className='g-ellipsis'
          title={record.channel_name}>
          {record.channel_name}
        </div>
      ),
    },
    {
      title: '通道组',
      className: 'paddingL20',
      width: 124,
      render: (_, record) => (
        <div
          style={{ width: 120 }}
          className='g-ellipsis'
          title={record.group_name}>
          {record.group_name}
        </div>
      ),
    },
    {
      title: '网络类型',
      width: 100,
      className: 'paddingL20',
      render: (_, record) => <span>{record.network_name}</span>,
    },
    {
      title: '短信类型',
      width: 100,
      className: 'paddingL20',
      render: (_, record) => (
        <span>{record.type == '2' ? '营销短信' : '行业短信'}</span>
      ),
    },
    {
      title: '成本/计费价',
      dataIndex: 'price',
      width: 140,
      className: 'paddingL20',
      render: (_, record) => {
        return (
          <span>
            <span style={{ color: '#888888' }}>{record.cost}</span>
            <br />
            {record.fee}
          </span>
        )
      },
    },
  ]

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
          autoComplete='off'>
          <Form.Item label='' name='channel' style={{ marginBottom: 10 }}>
            <Select
              placeholder='请选择通道'
              style={{ width: 162 }}
              size={size}
              options={channelList}
              fieldNames={{ label: 'name', value: 'id' }}
              suffixIcon={
                <i
                  className='icon iconfont icon-xiala'
                  style={{
                    color: '#000',
                    fontSize: '12px',
                    transform: 'scale(.45)',
                  }}
                />
              }></Select>
          </Form.Item>
          <Form.Item label='' name='group' style={{ marginBottom: 10 }}>
            <Select
              placeholder='请选择通道组'
              style={{ width: 162 }}
              size={size}
              options={channelsList}
              fieldNames={{ label: 'name', value: 'id' }}
              suffixIcon={
                <i
                  className='icon iconfont icon-xiala'
                  style={{
                    color: '#000',
                    fontSize: '12px',
                    transform: 'scale(.45)',
                  }}
                />
              }></Select>
          </Form.Item>

          <MyFormItem
            size={size}
            label='发送时间'
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
              placeholder='账户/手机号/国家/地区'
              maxLength={20}
              style={{ width: 162 }}></Input>
          </Form.Item>
          <Form.Item style={{ marginBottom: 10 }}>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: '#ff4d4f',
                  colorPrimaryHover: '#ff4d4f',
                },
              }}>
              <Button
                type='primary'
                size={size}
                onClick={search}
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
        className='theme-cell'
        columns={columns}
        dataSource={tableData}
        sticky
        pagination={pagination}
        rowKey={'id'}
        onRow={onRow}
        rowClassName={(record, index) => (index == activeIndex ? 'active' : '')}
        scroll={{ x: 'fix-content' }}
        loading={loading}
      />
    </div>
  )
}
