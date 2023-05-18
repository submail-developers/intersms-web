import { useEffect, useState, MutableRefObject, useRef } from 'react'
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
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import UpdateCountryConfig from './dialog/updateCountry'
import MenuTitle from '@/components/menuTitle/menuTitle'
import type { Dayjs } from 'dayjs'
import { useSize } from '@/hooks'
import { API } from 'apis'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'

import './country.scss'

interface DataType {
  id: string
  country_name: string
  country_en: string
  country_code: string
  country_prefix: string
  trade_channels: string
  trade_s: string
  sale_channels: string
  sale_asign: string
}
interface FormValues {
  channel: string
  group: string
  time: [Dayjs, Dayjs] | null
  keyword: string
}

// 国家信息配置
export default function Channel() {
  const updateCountryDialogRef: MutableRefObject<any> = useRef(null)
  // 被点击的客户(不是被checkbox选中的客户)
  const [activeIndex, setactiveIndex] = useState<number>()

  const onRow = (record: DataType, index?: number) => {
    return {
      onClick: () => {
        setactiveIndex(index)
      },
    }
  }

  const { Option } = Select
  const size = useSize()
  const [form] = Form.useForm()
  const groupList = [
    { label: '全部通道组', value: 'all' },
    { label: '通道组1', value: '1' },
    { label: '通道组2', value: '2' },
  ]

  const onFinish = (values: FormValues) => {}

  const columns: ColumnsType<DataType> = [
    {
      title: <span style={{ paddingLeft: '40px' }}>国家</span>,
      dataIndex: 'country_name',
      width: 180,
      ellipsis: true,
      render: (_, record) => (
        <span className='color' style={{ paddingLeft: '40px' }}>
          {record.country_name}
        </span>
      ),
    },
    {
      title: '国家英文',
      dataIndex: 'country_en',
    },
    {
      title: '国家代码',
      dataIndex: 'country_code',
    },
    {
      title: '国家区号',
      dataIndex: 'country_prefix',
    },
    {
      title: '行业通道组',
      dataIndex: 'trade_channels',
      className: 'trade-0',
    },
    {
      title: '行业s',
      className: 'trade-1',
      dataIndex: 'trade_s',
    },
    {
      title: '营销通道组',
      dataIndex: 'sale_channels',
      className: 'sale-0',
    },
    {
      title: '营销签名',
      dataIndex: 'sale_asign',
      className: 'sale-1',
    },
    {
      title: '操作',
      width: 120,
      render: (_, record) => (
        <div>
          <Button
            type='link'
            style={{ paddingLeft: 0, paddingRight: 0 }}
            onClick={updateCountryEvent}>
            编辑
          </Button>
        </div>
      ),
    },
  ]

  const data: DataType[] = []
  for (let i = 0; i < 100; i++) {
    data.push({
      id: 'id' + i,
      country_name: '中国' + i,
      country_en: 'Chain',
      country_code: 'CN',
      country_prefix: '+86',
      trade_channels: 'string',
      trade_s: 'string',
      sale_channels: 'string',
      sale_asign: 'string',
    })
  }

  const updateCountryEvent = () => {
    updateCountryDialogRef.current.open()
  }

  return (
    <div data-class='country'>
      <MenuTitle title='国家信息配置'></MenuTitle>
      <Row wrap align={'bottom'}>
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
              initialValues={{ channels_type: 'all' }}
              layout='inline'
              wrapperCol={{ span: 24 }}
              onFinish={onFinish}
              autoComplete='off'>
              <Form.Item label='' name='country' style={{ marginBottom: 10 }}>
                <Input
                  size={size}
                  placeholder='国家/国家代码'
                  maxLength={20}
                  style={{ width: 162 }}></Input>
              </Form.Item>
              <Form.Item
                label=''
                name='channels_type'
                style={{ marginBottom: 10 }}>
                <Select
                  placeholder='通道组类型'
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
                      colorPrimary: '#ff4d4f',
                      colorPrimaryHover: '#ff4d4f',
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
          rowClassName={(record, index) =>
            index == activeIndex ? 'active' : ''
          }
          sticky
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      </ConfigProvider>
      <UpdateCountryConfig ref={updateCountryDialogRef} />
    </div>
  )
}
