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
import {
  getSendList,
  getNoStateLogList,
  GetRegioncodeByCountry,
  updateNoStateQueueStatus,
} from '@/api'
import { useSize } from '@/hooks'
import { API } from 'apis'
import weekday from 'dayjs/plugin/weekday'
import localeData from 'dayjs/plugin/localeData'

dayjs.extend(weekday)
dayjs.extend(localeData)

import './unreturnStatus.scss'

interface DataType extends API.GetNoStateLogItem {}
interface FormValues {
  time: [Dayjs, Dayjs] | null
  sms_type: string
  mail: string
  country: string
}

enum reportClassName {
  'color-error',
  'color-success',
  'color-gray',
  'color-success-2',
}

const allChannel = { name: '全部通道', id: '0' } as API.ChannelItem

const allCountry = { label: '全部国家/地区', value: '0' } as API.CountryItem
// 发送列表
export default function SendList() {
  const { message } = App.useApp()
  const { RangePicker } = DatePicker
  const size = useSize()
  const [form] = Form.useForm()
  const [tableData, settableData] = useState<DataType[]>([])
  const [loading, setloading] = useState(false)
  const [total, settotal] = useState<number>(0)
  const [page, setpage] = useState<number>(1)
  const [pageSize, setpageSize] = useState<number>(200)
  const [mails, setMails] = useState()
  const [ids, setIds] = useState([]) //id数组

  // 被点击的客户(不是被checkbox选中的客户)
  const [activeIndex, setactiveIndex] = useState<number>()

  // 国家列表
  const [countryList, setcountryList] = useState<API.CountryItem[]>([
    allCountry,
  ])

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
    defaultPageSize: 200,
    pageSizeOptions: [100, 200, 300],
    showQuickJumper: true, // 快速跳转
    showTotal: (total, range) => `共 ${total} 条`,
  }

  // 初始化form的值
  const initFormValues: FormValues = {
    sms_type: '0',
    mail: '',
    country: '0',
    time: [dayjs().add(0, 'd'), dayjs().add(0, 'd')],
  }

  // 获取列表数据
  const search = async () => {
    setloading(true)
    const values = await form.getFieldsValue()
    const { sms_type, mail, time, country } = values
    setMails(mail)
    // const begin_date = (time && time[0].format('YYYY-MM-DD')) || ''
    // const end_date = (time && time[1].format('YYYY-MM-DD')) || ''
    const begin_date = '2023-10-13'
    const end_date = '2023-10-13'
    const params = {
      sms_type,
      begin_date,
      end_date,
      mail,
      country,
      page,
      limit: pageSize,
    }
    try {
      const res = await getNoStateLogList(params)
      settableData(res.data)
      settotal(res.total)

      let idList = []
      let list = res.data.map((item, index) => {
        idList.push(item.id)
      })
      setIds(idList)

      setloading(false)
    } catch (error) {
      setloading(false)
    }
  }

  const resetForm = () => {
    form.resetFields()
    search()
  }

  const disabledDate: DatePickerProps['disabledDate'] = (current, { from }) => {
    if (from) {
      return Math.abs(current.diff(from, 'days')) >= 3
    }

    return false
  }
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
    if (mails) {
      search()
    }
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
  // 通道组复制
  const Tip2 = (props: TipProps) => {
    let text = `
        ${props.record.group_name}
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
        <div>{props.record.group_name}</div>
      </div>
    )
  }

  const columns: ColumnsType<DataType> = [
    {
      title: '发送账户',
      dataIndex: 'mail',
      className: size == 'small' ? '' : 'paddingL30',
      width: size == 'small' ? 240 : 260,
      align: size == 'small' ? 'center' : 'left',
      fixed: true,
      render: (_, record) => <span className='fw500'>{record.mail}</span>,
    },
    {
      title: 'ID',
      dataIndex: 'id',
      className: 'paddingL30',
      width: 80,
    },
    // {
    //   title: '模板ID',
    //   dataIndex: 'group_id',
    //   className: 'paddingL30',
    //   width: size == 'small' ? 180 : 260,
    // },
    {
      title: '号码',
      dataIndex: 'mobile',
      className: 'paddingL30',
      width: 140,
    },

    {
      title: (
        <span style={{ paddingLeft: size == 'middle' ? '30px' : '0' }}>
          国家/地区名
        </span>
      ),
      dataIndex: 'country_cn',
      width: size == 'middle' ? 160 : 100,
      render: (_, record) => (
        <div style={{ paddingLeft: size == 'middle' ? '30px' : '0' }}>
          <div
            className='g-ellipsis'
            title={record.country_cn}
            style={{ width: size == 'middle' ? 160 : 100 }}>
            {record.country_cn}
          </div>
          {/* <div
            className='color-gray g-ellipsis'
            title={record.region_code}
            style={{ width: size == 'middle' ? 160 : 100 }}>
            {record.region_code}
          </div> */}
        </div>
      ),
    },
    {
      title: '短信正文',
      dataIndex: 'content',
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
  ]
  // 短信类型
  const smsType = [
    { id: '0', name: '全部短信类型' },
    { id: '1', name: '行业短信' },
    { id: '2', name: '营销短信' },
  ]

  // 全部推送成功
  const pushSuc = async () => {
    try {
      const res = await updateNoStateQueueStatus({
        ids: ids,
      })
      if (res) {
        message.success('推送成功')
      }
    } catch (error) {}
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
          <MyFormItem
            size={size}
            label='发送时间'
            style={{ marginBottom: '10px' }}>
            <Form.Item label='' name='time' style={{ marginBottom: '0px' }}>
              <RangePicker
                size={size}
                variant='borderless'
                disabledDate={disabledDate}
                clearIcon={false}
                style={{ width: size == 'small' ? 190 : 240 }}></RangePicker>
            </Form.Item>
          </MyFormItem>
          <Form.Item label='' name='sms_type' style={{ marginBottom: 10 }}>
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

          <Form.Item label='' name='country' style={{ marginBottom: 10 }}>
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

          <Form.Item label='' name='mail' style={{ marginBottom: 10 }}>
            <Input
              size={size}
              placeholder='账户'
              style={{ width: 220 }}></Input>
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
                onClick={() => pushSuc()}
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
