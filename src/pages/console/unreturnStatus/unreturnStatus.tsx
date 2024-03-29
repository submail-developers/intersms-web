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
  App,
} from 'antd'
import type { DatePickerProps } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import type { RangePickerProps } from 'antd/es/date-picker'
import MenuTitle from '@/components/menuTitle/menuTitle'
import MyFormItem from '@/components/antd/myFormItem/myFormItem'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { getSendList, GetRegioncodeByCountry } from '@/api'
import { useSize } from '@/hooks'
import { API } from 'apis'
import './unreturnStatus.scss'

interface DataType extends API.SendListItem {}
interface FormValues {
  channel: string
  group: string
  country_cn: string
  time: [Dayjs, Dayjs] | null
  keyword: string
  order_flg: string
}
type RangeValue = [Dayjs | null, Dayjs | null] | null
enum reportClassName {
  'color-error',
  'color-success',
  'color-gray',
  'color-success-2',
}

const allCountry = { label: '全部国家/地区', value: 'all' } as API.CountryItem
const { RangePicker } = DatePicker

// 发送列表
export default function SendList() {
  const { message } = App.useApp()
  const size = useSize()
  const [form] = Form.useForm()
  const [tableData, settableData] = useState<DataType[]>([])
  const [loading, setloading] = useState(false)
  const [total, settotal] = useState<number>(0)
  const [page, setpage] = useState<number>(1)
  const [pageSize, setpageSize] = useState<number>(50)
  const [value, setValue] = useState<RangeValue>(null)

  // 被点击的客户(不是被checkbox选中的客户)
  const [activeIndex, setactiveIndex] = useState<number>()
  // 国家列表
  const [countryList, setcountryList] = useState<API.CountryItem[]>([
    allCountry,
  ])

  // 快捷可选日期
  // const rangePresets: {
  //   label: string
  //   value: [Dayjs, Dayjs]
  // }[] = [
  //   { label: '今天', value: [dayjs().add(0, 'd'), dayjs().add(0, 'd')] },
  //   { label: '最近3天', value: [dayjs().add(-2, 'd'), dayjs().add(0, 'd')] },
  // ]

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
    group: 'all',
    country_cn: 'all',
    time: [dayjs().add(0, 'd'), dayjs().add(0, 'd')],
    keyword: '',
    order_flg: 'send',
  }

  // 获取列表数据
  const search = async () => {
    setloading(true)
    const values = await form.getFieldsValue()
    const { channel, group, time, keyword, order_flg, country_cn } = values
    const start = (time && time[0].format('YYYY-MM-DD')) || ''
    const end = (time && time[1].format('YYYY-MM-DD')) || ''
    const params = {
      type: 'all',
      start,
      end,
      channel,
      group,
      country_cn,
      keyword,
      page,
      limit: pageSize,
      order_flg,
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

  const disabledDate: RangePickerProps['disabledDate'] = (current, info) => {
    console.log(info)
    return current && current >= dayjs().endOf('day') // 无法选择今天以后的日期
  }
  // const disabledDate: DatePickerProps['disabledDate'] = (current, { from }) => {
  //   console.log(from, 'form')
  //   // if (from) {
  //   //   return Math.abs(current.diff(from, 'days')) >= 7
  //   // }

  //   return false
  // }

  useEffect(() => {
    form.resetFields()
    getCountryList()
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

  const onRow = (record: DataType, index?: number) => {
    return {
      onClick: () => {
        setactiveIndex(index)
      },
    }
  }
  // 获取所有国家
  const getCountryList = async () => {
    const res = await GetRegioncodeByCountry()
    let countrys: API.CountryItem[] = []
    res.data.forEach((item) => {
      countrys = [...countrys, ...item.children]
    })
    setcountryList([{ label: '全部国家', value: '0', area: '' }, ...countrys])
  }

  const columns: ColumnsType<DataType> = [
    {
      title: '号码',
      dataIndex: 'mobile',
      className: size == 'small' ? '' : 'paddingL30',
      width: size == 'small' ? 160 : 170,
      align: size == 'small' ? 'center' : 'left',
      fixed: true,
      render: (_, record) => <span className='fw500'>{record.mobile}</span>,
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
          trigger={['hover', 'click']}>
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
      width: 104,
      render: (_, record) => (
        <div
          style={{ width: 100 }}
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

            {record.report_code == '' ? '-' : record.sent}
            {/* {record.sent} */}
          </span>
        )
      },
    },
    {
      title: '下行耗时',
      dataIndex: 'timer',
      className: 'paddingL20',
      width: 80,
      render: (_, record) =>
        record.report_code == '' ? (
          <span style={{ color: '#5765cc' }}>-</span>
        ) : (
          <span style={{ color: '#5765cc' }}>{record.downlink_time}s</span>
        ),
    },
    {
      title: '回执',
      dataIndex: 'report_code',
      className: 'paddingL20',
      width: 100,
      render: (_, record) => (
        <div className='g-ellipsis-2'>
          <span
            className={`${
              reportClassName[
                record.report_state == '0' && record.report_code == 'DELIVRD'
                  ? '3'
                  : record.report_state
              ]
            }`}>
            {record.report_code || '未返回'}
          </span>
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
      width: 180,
      className: 'paddingL20',
      render: (_, record) => (
        <Tooltip
          title={record.channel_name}
          placement='bottom'
          mouseEnterDelay={0.3}
          trigger={['hover', 'click']}>
          <div className='g-ellipsis'>{record.channel_name}</div>
        </Tooltip>
      ),
    },
    {
      title: '通道组',
      className: 'paddingL20',
      width: 210,
      render: (_, record) => (
        <Tooltip
          title={record.group_name}
          placement='bottom'
          mouseEnterDelay={0.3}
          trigger={['hover', 'click']}>
          <div className='g-ellipsis-1'>{record.group_name}</div>
        </Tooltip>
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
      width: 120,
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
  // 短信类型
  const smsType = [
    { id: 'all', name: '全部短信类型' },
    { id: '1', name: '行业短信' },
    { id: '2', name: '营销短信' },
  ]
  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString)
  }
  return (
    <div data-class='sendlist'>
      <MenuTitle title='未返回任务列表'></MenuTitle>
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
          {/* <MyFormItem
            size={size}
            label='发送时间'
            style={{ marginBottom: '10px' }}> */}
          <Form.Item label='' name='time' style={{ marginBottom: '0px' }}>
            <RangePicker
              size={size}
              // disabledDate={disabledDate}
              style={{ width: size == 'small' ? 190 : 240 }}></RangePicker>
          </Form.Item>
          {/* </MyFormItem> */}

          <Form.Item label='' name='channel' style={{ marginBottom: 10 }}>
            <Select
              showSearch
              placeholder='请选择短信类型'
              style={{ width: size == 'small' ? 240 : 160 }}
              size={size}
              options={smsType}
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

          <Form.Item label='' name='country_cn' style={{ marginBottom: 10 }}>
            <Select
              showSearch
              placeholder='请选择国家/地区'
              style={{ width: size == 'small' ? 240 : 160 }}
              size={size}
              options={countryList}
              fieldNames={{ label: 'label', value: 'value' }}
              optionFilterProp='name'
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
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

          <Form.Item label='' name='keyword' style={{ marginBottom: 10 }}>
            <Input
              size={size}
              placeholder='账户'
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
                onClick={() => handleSearch()}
                style={{ width: 110, marginLeft: 0 }}>
                搜索
              </Button>
            </ConfigProvider>
          </Form.Item>
          <Form.Item style={{ marginBottom: 10 }}>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: '#0074d7',
                },
              }}>
              <Button
                type='primary'
                size={size}
                onClick={() => handleSearch()}
                style={{ width: 110, marginLeft: 0 }}>
                全部推送成功
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
