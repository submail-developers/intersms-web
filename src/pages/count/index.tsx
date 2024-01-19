import { useEffect, useState } from 'react'
import {
  Button,
  Select,
  Form,
  Input,
  DatePicker,
  ConfigProvider,
  Table,
  Typography,
  Tooltip,
  App,
} from 'antd'
import type { TableColumnsType } from 'antd'
import type { RangePickerProps } from 'antd/es/date-picker'
import MenuTitle from '@/components/menuTitle/menuTitle'
import MyFormItem from '@/components/antd/myFormItem/myFormItem'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { getStatistics, getChannelList, getChannelGroupList } from '@/api'
import { useSize } from '@/hooks'
import { API } from 'apis'

import './sendList.scss'
const { Text } = Typography
interface DataType extends API.GetStatisticsItems {
  index: string
}
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
  const { message } = App.useApp()
  const { RangePicker } = DatePicker
  const size = useSize()
  const [form] = Form.useForm()
  const [tableData, settableData] = useState<DataType[]>([])
  const [totalTableData, setTotalTableData] = useState<API.TotalList>()
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
    const start = (time && time[0].format('YYYY-MM-DD')) || ''
    const end = (time && time[1].format('YYYY-MM-DD')) || ''
    // const start = '2023-10-10'
    // const end = '2023-10-15'
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
      let list: DataType[] = res.data.list.map((item, index) => {
        let obj = { ...item, index: `${index}` }
        return obj
      })
      settableData(list)
      setTotalTableData(res.data.total_list)
      settotal(res.data.total)
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
  // 点击提示复制
  type TipProps = {
    record: DataType
  }
  const Tip = (props: TipProps) => {
    let text = `
      ${props.record.channel_name}
    `
    const copy = async () => {
      try {
        await navigator.clipboard.writeText(text)
        message.success('复制成功')
      } catch (error) {
        message.success('复制失败')
      }
    }
    return (
      <div onClick={copy}>
        <div>{props.record.channel_name}</div>
      </div>
    )
  }

  const columns: TableColumnsType<DataType> = [
    {
      title: '通道名',
      dataIndex: 'channel_name',
      className: size == 'small' ? '' : 'paddingL30',
      align: size == 'small' ? 'center' : 'left',
      width: size == 'small' ? 120 : 200,
      fixed: true,
      render: (_, record: DataType) => (
        <Tooltip
          title={<Tip record={record} />}
          placement='left'
          mouseEnterDelay={0.3}
          trigger={['hover', 'click']}>
          <div className='g-ellipsis-1'>{record.channel_name}</div>
        </Tooltip>
      ),
    },
    {
      title: '国家',
      dataIndex: 'country_cn',
      width: size == 'small' ? 120 : 200,
      className: 'paddingL30',
    },
    {
      title: '网络',
      dataIndex: 'network_name',
      width: size == 'small' ? 120 : 160,
    },
    {
      title: '计费条数(条)',
      dataIndex: 'sms_count',
      width: size == 'small' ? 120 : 160,
    },
    {
      title: '计费成本(元)',
      dataIndex: 'cost',
      width: size == 'small' ? 120 : 160,
    },
    {
      title: '计费收入(元)',
      dataIndex: 'fee',
      width: size == 'small' ? 120 : 160,
    },
  ]

  return (
    <div data-class='sendlist'>
      <MenuTitle title='通道计费列表'></MenuTitle>
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

          <Form.Item label='' name='region_code' hidden>
            <Input />
          </Form.Item>
          <Form.Item label='' name='network' hidden>
            <Input />
          </Form.Item>

          <MyFormItem
            size={size}
            label='时间范围'
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
        pagination={false}
        scroll={{ x: 800, y: 650 }}
        rowKey={'index'}
        summary={(pageData) => {
          let total_sms_count = 0
          let total_cost = 0
          let total_fee = 0

          pageData.forEach(({ profit }) => {
            total_sms_count = totalTableData.sms_count //总计费条数
            total_cost = totalTableData.cost //总计费成本
            total_fee = totalTableData.fee //总计费收入
          })

          return (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>汇总</Table.Summary.Cell>
                <Table.Summary.Cell index={1}></Table.Summary.Cell>
                <Table.Summary.Cell index={2}></Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  <Text>{total_sms_count}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                  <Text>{total_cost}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5}>
                  <Text>{total_fee}</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )
        }}
      />
    </div>
  )
}
