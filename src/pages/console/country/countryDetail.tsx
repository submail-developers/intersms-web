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
  Badge,
  Dropdown,
  Space,
  Popconfirm,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import UpdateCountryConfig from './dialog/updateCountry'
import MenuTitle from '@/components/menuTitle/menuTitle'
import BackToTop from '@/components/returnToTop/returnToTop'
import { useSize } from '@/hooks'
import { getSingleCountryInfo } from '@/api'
import { API } from 'apis'
import { DownOutlined } from '@ant-design/icons'
import type { TableColumnsType } from 'antd'
import { Link, useSearchParams } from 'react-router-dom'

import AddDialog from './addDialog/addNetwork'
import EditChanlDialog from './addDialog/editNewChanl'

import './country.scss'

interface DataType extends API.GetSingleCountryInfoItems {}
interface FormValues {
  region_code: string
}

interface ExpandedDataType {
  key: React.Key
  date: string
  name: string
  upgradeNum: string
}

// 国家信息配置
export default function Channel() {
  const [tableChildData, settableChildData] = useState<
    API.GetSingleCountryInfoItems[]
  >([])
  const [tableData, settableData] = useState<API.GetSingleCountryInfoItems[]>(
    [],
  )
  // 被点击的客户(不是被checkbox选中的客户)
  const [activeIndex, setactiveIndex] = useState<number>()
  const [loading, setloading] = useState(false)
  const dialogRef: MutableRefObject<any> = useRef(null)
  const editChanleDialogRef: MutableRefObject<any> = useRef(null)
  const [params] = useSearchParams()
  const region_code = params.get('region_code')
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
    region_code: region_code,
  }
  const search = async () => {
    const values = await form.getFieldsValue()
    formatSearchValue(values)
  }
  const formatSearchValue = (params: FormValues) => {
    const { region_code } = params
    const searchParams = {
      region_code: region_code,
    }
    searchEvent(searchParams)
  }
  const searchEvent = async (params: API.GetSingleCountryInfoParams) => {
    try {
      setloading(true)
      const res = await getSingleCountryInfo(params)
      settableData(res.data)
      setloading(false)
    } catch (error) {
      setloading(false)
    }
  }

  useEffect(() => {
    formatSearchValue(initFormValues)
  }, [])

  const columns: ColumnsType<DataType> = [
    {
      title: (
        <span style={{ paddingLeft: size == 'middle' ? '30px' : '0' }}>
          通道名称
        </span>
      ),
      dataIndex: 'country_cn',
      width: size == 'middle' ? 160 : 100,
      fixed: true,
      render: (_, record) => (
        <div style={{ paddingLeft: size == 'middle' ? '30px' : '0' }}>
          <div
            className='g-ellipsis'
            title={record.channel_name}
            style={{ width: size == 'middle' ? 160 : 100 }}>
            {record.channel_name}
          </div>
        </div>
      ),
    },
    {
      title: '管理员',
      dataIndex: 'operator',
      width: 80,
    },
    {
      title: '区间成本价',
      dataIndex: 'price',
      width: 100,
      render: (_, record) => <span>{record.price}</span>,
    },
    {
      title: '备注',
      dataIndex: 'comment',
      width: 190,
      ellipsis: true,
    },
    {
      title: '修改时间',
      width: 160,
      className: 'paddingL20',
      render: (_, record) => <div>{record.datetime}</div>,
    },

    {
      title: '操作',
      width: 120,
      render: (_, record) => (
        <div>
          <Button
            onClick={() => editNetwork(false, record)}
            type='link'
            style={{ paddingLeft: 0 }}>
            编辑
          </Button>
          <Button type='link' onClick={() => updateNetwork()}>
            新增网络
          </Button>
        </div>
      ),
    },
  ]
  const expandedRowRender = () => {
    const columnsChild: TableColumnsType<ExpandedDataType> = [
      { title: '网络名称', dataIndex: 'date', key: 'date' },
      { title: '成本价格', dataIndex: 'cprice', key: 'cprice' },
      {
        title: '操作',
        dataIndex: 'upgradeNum',
        key: 'upgradeNum',
        render: (_, record) => (
          <div>
            <Button type='link' style={{ paddingLeft: 0 }}>
              编辑
            </Button>
            <Popconfirm
              placement='left'
              title='警告'
              description='确定删除该通道吗？'
              okText='确定'
              cancelText='取消'>
              <Button type='link'>删除</Button>
            </Popconfirm>
          </div>
        ),
      },
    ]

    const dataChild = []
    for (let i = 0; i < 3; ++i) {
      dataChild.push({
        key: i.toString(),
        date: 'u mobile',
        cprice: '0.01000',
        upgradeNum: 'Upgraded: 56',
      })
    }
    return (
      <Table
        className='child-table'
        columns={columnsChild}
        dataSource={dataChild}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    )
  }
  // 新增/编辑网络
  const updateNetwork = (isAdd: boolean = true, record?: DataType) => {
    dialogRef.current.open({ isAdd, record })
  }
  // 编辑关联通道
  const editNetwork = (isAdd: boolean = true, record?: DataType) => {
    editChanleDialogRef.current.open({ isAdd, record })
  }

  return (
    <div data-class='country'>
      <MenuTitle title='- 关联通道'></MenuTitle>
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
                name='keyword'
                style={{ marginBottom: size == 'small' ? 0 : 10 }}>
                <Input
                  size={size}
                  placeholder='通道名称/网络名称'
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
          // className='theme-cell reset-table'
          columns={columns}
          dataSource={tableData}
          expandable={{ expandedRowRender }}
          rowKey={'id'}
          onRow={onRow}
          rowClassName={(record, index) =>
            index == activeIndex ? 'active' : ''
          }
          sticky
          pagination={{
            position: ['bottomRight'],
            pageSize: 100,
            pageSizeOptions: [100, 200, 300],
          }}
          scroll={{ x: 'max-content' }}
          loading={loading}
        />
      </ConfigProvider>
      <AddDialog ref={dialogRef} onSearch={search} />
      <EditChanlDialog ref={editChanleDialogRef} onSearch={search} />
      <BackToTop />
    </div>
  )
}
