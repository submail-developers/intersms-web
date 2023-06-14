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
import UpdateCountryConfig from './dialog/updateCountry'
import MenuTitle from '@/components/menuTitle/menuTitle'
import { useSize } from '@/hooks'
import { getCountryList, getAllGroupId } from '@/api'
import { API } from 'apis'

import './country.scss'

interface DataType extends API.GetCountryListItems {}
interface FormValues {
  id: string
  group_id: string
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
  // 初始化form的值
  const initFormValues: FormValues = {
    id: '',
    group_id: 'all',
    keyword: '',
  }
  const search = async () => {
    const values = await form.getFieldsValue()
    formatSearchValue(values)
  }
  const formatSearchValue = (params: FormValues) => {
    const { id, group_id, keyword } = params
    const searchParams = {
      id: '',
      group_id,
      keyword,
    }
    searchEvent(searchParams)
  }
  const searchEvent = async (params: API.GetCountryListParams) => {
    try {
      const res = await getCountryList(params)
      settableData(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const allGroupId = async () => {
    const res = await getAllGroupId('')
    setallGruopData([{ id: '', name: '全部通道组' }, ...res.data])
  }
  useEffect(() => {
    formatSearchValue(initFormValues)
    allGroupId()
  }, [])

  const [allGruopData, setallGruopData] = useState<API.GetAllGroupIdItems[]>([])
  const [tableData, settableData] = useState<API.GetCountryListItems[]>([])
  const columns: ColumnsType<DataType> = [
    {
      title: (
        <span style={{ paddingLeft: size == 'middle' ? '30px' : '0' }}>
          国家/地区名
        </span>
      ),
      dataIndex: 'country_cn',
      width: 160,
      ellipsis: true,
      fixed: true,
      render: (_, record) => (
        <div style={{ paddingLeft: size == 'middle' ? '30px' : '0' }}>
          <div className='country_cn g-ellipsis' title={record.country_cn}>
            {record.country_cn}
          </div>
          <div
            className='color-gray country_cn g-ellipsis'
            title={record.country}>
            {record.country}
          </div>
        </div>
      ),
    },
    {
      title: '代码',
      dataIndex: 'region_code',
      width: 80,
    },
    {
      title: '区号',
      dataIndex: 'country_area_code',
      width: 80,
      render: (_, record) => <span>+{record.country_area_code}</span>,
    },
    {
      title: '洲属',
      dataIndex: 'area',
      width: 90,
      ellipsis: true,
    },
    {
      title: '行业通道组',
      dataIndex: 'tra_group_name',
      className: 'trade-0',
      width: 160,
    },
    {
      title: '行业Sender',
      className: 'trade-1',
      dataIndex: 'tra_sender',
      width: 120,
    },
    {
      title: '营销通道组',
      dataIndex: 'mke_group_name',
      className: 'sale-0',
      width: 160,
    },
    {
      title: '营销Sender',
      dataIndex: 'mke_sender',
      className: 'sale-1',
      width: 120,
    },
    {
      title: '操作',
      width: 120,
      render: (_, record) => (
        <div>
          <Button
            type='link'
            style={{ paddingLeft: 0, paddingRight: 0 }}
            onClick={() => updateCountryEvent(record)}>
            编辑
          </Button>
        </div>
      ),
    },
  ]

  const updateCountryEvent = (record: DataType) => {
    updateCountryDialogRef.current.open(record)
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
              autoComplete='off'>
              <Form.Item
                label=''
                name='group_id'
                style={{ marginBottom: size == 'small' ? 0 : 10 }}>
                <Select
                  placeholder='全部通道组'
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
                  {allGruopData.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label=''
                name='keyword'
                style={{ marginBottom: size == 'small' ? 0 : 10 }}>
                <Input
                  size={size}
                  placeholder='国家/国家代码'
                  maxLength={20}
                  style={{ width: 162 }}></Input>
              </Form.Item>
              <Form.Item style={{ marginBottom: size == 'small' ? 0 : 10 }}>
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
                    onClick={search}
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
          className='theme-cell reset-table'
          columns={columns}
          dataSource={tableData}
          rowKey={'id'}
          onRow={onRow}
          rowClassName={(record, index) =>
            index == activeIndex ? 'active' : ''
          }
          sticky
          pagination={{ position: ['bottomRight'] }}
          scroll={{ x: 'max-content' }}
        />
      </ConfigProvider>
      <UpdateCountryConfig
        onSearch={search}
        allGruopData={allGruopData}
        ref={updateCountryDialogRef}
      />
    </div>
  )
}
