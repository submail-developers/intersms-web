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
import { getStatistics, getChannelList, getChannelGroupList } from '@/api'
import { useSize } from '@/hooks'
import { API } from 'apis'

import './sendList.scss'

interface DataType extends API.GetStatisticsItems {}
interface FormValues {
  channel: string
  time: [Dayjs, Dayjs] | null
  region_code: string
  network: string
}

enum reportClassName {
  'color-error',
  'color-success',
  'color-gray',
  'color-success-2',
}

const allChannel = { name: '全部通道', id: 'all' } as API.ChannelItem

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

  // 快捷可选日期
  const rangePresets: {
    label: string
    value: [Dayjs, Dayjs]
  }[] = [
    { label: '今天', value: [dayjs().add(0, 'd'), dayjs().add(0, 'd')] },
    { label: '最近3天', value: [dayjs().add(-2, 'd'), dayjs().add(0, 'd')] },
    { label: '最近7天', value: [dayjs().add(-6, 'd'), dayjs().add(0, 'd')] },
  ]

  const changePage = async (_page: number, _pageSize: number) => {
    if (_page != page) setpage(_page)
    if (_pageSize != pageSize) {
      // pagesize由大到小切换时，此时tableData.length大于pagesize，会有个报错警告。解决掉这个警告
      if (_pageSize < pageSize) {
        settableData(tableData.slice(0, _pageSize))
      }
      setpageSize(_pageSize)
    }
  }

  const pagination: TablePaginationConfig = {
    current: page,
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
    time: [dayjs().add(0, 'd'), dayjs().add(0, 'd')],
    region_code: 'all',
    network: 'all',
  }

  // 获取列表数据
  const search = async () => {
    setloading(true)
    const values = await form.getFieldsValue()
    const { channel, network, time, region_code } = values
    // const start = (time && time[0].format('YYYY-MM-DD')) || ''
    // const end = (time && time[1].format('YYYY-MM-DD')) || ''
    const start = '2023-10-10'
    const end = '2023-10-15'
    const params = {
      start,
      end,
      channel,
      network,
      region_code,
      page,
      limit: pageSize,
    }
    try {
      const res = await getStatistics(params)
      console.log(res.data, '??')
      settableData(res.data)
      // settotal(res.total)
      setloading(false)
    } catch (error) {
      setloading(false)
    }
  }

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current >= dayjs().endOf('day') // 无法选择今天以后的日期
  }

  useEffect(() => {
    form.resetFields()
    getChannel()
  }, [])

  const handleSearch = () => {
    if (page == 1) {
      search()
    } else {
      changePage(1, pageSize)
    }
  }

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

  const onRow = (record: DataType, index?: number) => {
    return {
      onClick: () => {
        setactiveIndex(index)
      },
    }
  }

  const columns: ColumnsType<DataType> = [
    {
      title: '通道名',
      dataIndex: 'channel_name',
    },
    {
      title: '国家',
      dataIndex: 'country_cn',
    },
    {
      title: '网络',
      dataIndex: 'network_name',
    },
    {
      title: '计费条数',
      dataIndex: 'request',
    },
    {
      title: '计费成本',
      dataIndex: 'cost',
    },
    {
      title: '计费收入',
      dataIndex: 'fee',
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
              showSearch
              placeholder='请选择通道'
              style={{ width: 162 }}
              size={size}
              options={channelList}
              fieldNames={{ label: 'name', value: 'id' }}
              optionFilterProp='name'
              filterOption={(input, option) =>
                (option?.name ?? '').toLowerCase().includes(input.toLowerCase())
              }
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

          <Form.Item label='' name='region_code' hidden></Form.Item>
          <Form.Item label='' name='network' hidden></Form.Item>

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
                onClick={() => handleSearch()}
                style={{ width: 110, marginLeft: 0 }}>
                搜索
              </Button>
            </ConfigProvider>
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
