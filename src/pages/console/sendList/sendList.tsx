import { useEffect, useState, useRef, useCallback } from 'react'
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
import { findDOMNode } from 'react-dom'
import type { ColumnsType } from 'antd/es/table'
import type { RangePickerProps } from 'antd/es/date-picker'
import MenuTitle from '@/components/menuTitle/menuTitle'
import MyFormItem from '@/components/antd/myFormItem/myFormItem'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { getSendList, getChannelList, getChannelGroupList } from '@/api'
import { useSize } from '@/hooks'
import { useThrottleFn } from 'ahooks'
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
  const loadingTag = useRef(false)
  const [total, settotal] = useState<number>(0)
  const scrollRef = useRef(null)
  const pageInfo = useRef(0)
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

  const [tableWrapHeight, settableWrapHeight] = useState(0)

  const tableWrapRef = useCallback((node) => {
    if (node !== null) {
      settableWrapHeight(node.getBoundingClientRect().height)
    }
  }, [])

  // 初始化form的值
  const initFormValues: FormValues = {
    channel: 'all',
    group: 'all',
    time: [dayjs().add(-7, 'd'), dayjs().add(0, 'd')],
    keyword: '',
  }

  // 获取列表数据
  const search = async (next = false) => {
    loadingTag.current = true
    let p = pageInfo.current + 1
    if (!next) {
      setloading(true)
      p = 1
      pageInfo.current = 1
    }
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
      page: p,
      limit: 50,
    }

    try {
      const res = await getSendList(params)
      if (next) {
        pageInfo.current += 1
        settableData([...tableData, ...res.data])
      } else {
        settableData(res.data)
        toTop()
      }
      settotal(res.total)
      setloading(false)
      loadingTag.current = false
    } catch (error) {
      setloading(false)
      loadingTag.current = false
    }
  }

  // 节流
  const { run } = useThrottleFn(search, {
    wait: 2000,
  })

  // 返回顶部
  const toTop = () => {
    // 获取表格滚动元素
    const table = findDOMNode(scrollRef.current)
    const tableBody = (table as Element)?.querySelector('.ant-table-body')
    tableBody?.scrollTo(0, 0)
  }

  const scrollEvent = () => {
    // 如果正在加载数据中，不重复进行操作
    if (loadingTag.current || total <= tableData.length) return

    // 获取表格滚动元素
    const table = findDOMNode(scrollRef.current)
    const tableBody = (table as Element)?.querySelector('.ant-table-body')

    // 容器可视区高度
    const tableBodyHeight: number = tableBody?.clientHeight
      ? tableBody?.clientHeight
      : 0

    // 内容高度
    const contentHeight = tableBody?.scrollHeight ? tableBody?.scrollHeight : 0

    // 距离顶部的高度
    const toTopHeight = tableBody?.scrollTop ? tableBody?.scrollTop : 0

    // 当距离底部只有100时，重新获取数据
    if (contentHeight - (toTopHeight + tableBodyHeight) <= 100) {
      // 如果当前页数据大于等于总页数，则代表没有数据了
      run(true)
    }
  }

  const resetForm = () => {
    form.resetFields()
    run()
  }

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current >= dayjs().endOf('day') // 无法选择今天以后的日期
  }

  useEffect(() => {
    form.resetFields()
    getChannel()
    getChannels()
    pageInfo.current = 1
    run()
  }, [])
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
      title: '短信正文',
      dataIndex: 'message',
      width: 320,
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
      className: 'paddingL30',
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
      width: 80,
      render: (_, record) => (
        <span style={{ color: '#0074d7' }}>{record.downlink_time}s</span>
      ),
    },
    {
      title: '回执',
      dataIndex: 'report_code',
      width: 100,
      render: (_, record) => (
        <span className={`${reportClassName[record.report_state]}`}>
          {record.report_code || '回执未返回'}
        </span>
      ),
    },
    {
      title: '国家/地区',
      dataIndex: 'country_cn',
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
      render: (_, record) => <span>{record.network_name}</span>,
    },
    {
      title: '短信类型',
      width: 100,
      render: (_, record) => (
        <span>{record.type == '2' ? '营销短信' : '行业短信'}</span>
      ),
    },
    {
      title: '成本/计费价',
      dataIndex: 'price',
      width: 140,
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
                onClick={() => run()}
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
      <div
        className='table-wrap'
        onScrollCapture={scrollEvent}
        ref={tableWrapRef}>
        <Table
          className='theme-cell'
          columns={columns}
          dataSource={tableData}
          sticky
          pagination={false}
          rowKey={'id'}
          onRow={onRow}
          rowClassName={(record, index) =>
            index == activeIndex ? 'active' : ''
          }
          scroll={{
            x: 'max-content',
            y: tableWrapHeight - (size == 'small' ? 0 : 50),
          }}
          loading={loading}
          ref={(c) => {
            scrollRef.current = c
          }}
        />
      </div>
    </div>
  )
}
