import { useEffect, useState, MutableRefObject, useRef } from 'react'
import {
  Button,
  Form,
  Input,
  ConfigProvider,
  Table,
  Row,
  Col,
  Popconfirm,
  App,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import AddDialog from './dialog/addDialog'
import MenuTitle from '@/components/menuTitle/menuTitle'
import { useSize } from '@/hooks'
import { getNetWorkList, deleteNetWorkList } from '@/api'
import { API } from 'apis'

import './network.scss'

interface DataType extends API.GetNetWorkListItems {}
interface FormValues {
  id: string
  keyword: string
}

// 国家信息配置
export default function Network() {
  const addDialogRef: MutableRefObject<any> = useRef(null)
  const size = useSize()
  const [loading, setloading] = useState(false)

  // 被点击的客户(不是被checkbox选中的客户)
  const [activeIndex, setactiveIndex] = useState<number>()
  // 选中的keys
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const onRow = (record: DataType, index?: number) => {
    return {
      onClick: () => {
        setactiveIndex(index)
      },
      onDoubleClick: () => {
        if (selectedRowKeys.includes(record.id)) {
          setSelectedRowKeys(
            selectedRowKeys.filter((item) => item != record.id),
          )
        } else {
          setSelectedRowKeys([...selectedRowKeys, record.id])
        }
      },
    }
  }
  const rowSelection = {
    columnWidth: size == 'small' ? 32 : 60,
    fixed: true,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys)
    },
  }

  const [form] = Form.useForm()
  const [tableData, settableData] = useState<API.GetNetWorkListItems[]>([])
  // 初始化form的值
  const initFormValues: FormValues = {
    id: '',
    keyword: '',
  }
  const handleSearch = () => {
    setSelectedRowKeys([])
    search()
  }
  const search = async () => {
    const values = await form.getFieldsValue()
    formatSearchValue(values)
  }
  const formatSearchValue = (params: FormValues) => {
    const { id, keyword } = params
    const searchParams = {
      id: '',
      keyword,
    }
    searchEvent(searchParams)
  }
  const searchEvent = async (params: API.GetNetWorkParams) => {
    try {
      setloading(true)
      const res = await getNetWorkList(params)
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
      title: '运营商网络',
      dataIndex: 'name',
      width: size == 'small' ? 90 : 160,
      className: size == 'small' ? '' : 'paddingL30',
      fixed: true,
      render: (_, record: DataType) => (
        <div
          style={{ width: size == 'small' ? '90px' : '130px' }}
          className='g-ellipsis fw500'
          title={record.name}>
          {record.name}
        </div>
      ),
    },
    {
      title: '国家/地区名',
      dataIndex: 'country_cn',
      width: 160,
      ellipsis: true,
    },
    {
      title: '代码',
      dataIndex: 'region_code',
      width: 60,
    },
    {
      title: '洲属',
      dataIndex: 'area',
      width: 120,
    },
    {
      title: '成本价格',
      dataIndex: 'cost_price',
      width: 120,
    },
    {
      title: '建议零售价格',
      dataIndex: 'sug_price',
      width: 120,
    },
    {
      title: '操作',
      width: 180,
      className: 'paddingL30',
      render: (_, record) => (
        <div>
          <Button
            type='link'
            style={{ paddingLeft: 0 }}
            onClick={() => updateCountryEvent(record)}>
            编辑
          </Button>
          <Button type='link'>
            <Popconfirm
              placement='left'
              title='警告'
              description='确定删除该条网络信息吗？'
              onConfirm={() => singleDeleteEvent(record.id)}
              okText='确定'
              cancelText='取消'>
              删除
            </Popconfirm>
          </Button>
        </div>
      ),
    },
  ]

  const updateCountryEvent = (record?: DataType) => {
    addDialogRef.current.open({ record })
  }

  const { message } = App.useApp()
  // 单独删除事件
  const singleDeleteEvent = async (id: any) => {
    await deleteNetWorkList({ id })
    await search()
  }
  // 批量删除网络信息
  const deleteEvent = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请勾选要删除的网络！')
      return
    }
    const id = selectedRowKeys.join(',')
    await deleteNetWorkList({ id })
    await search()
    setSelectedRowKeys([])
  }

  return (
    <div data-class='network'>
      <MenuTitle title='网络信息配置'></MenuTitle>
      <Row justify='space-between' wrap align={'bottom'}>
        <Col>
          <div
            className='btn-group'
            style={{ marginBottom: size == 'small' ? 5 : 10 }}>
            <div className='btn' onClick={() => updateCountryEvent()}>
              <i className='icon iconfont icon-bianji'></i>
              <span>新增</span>
            </div>
            <Popconfirm
              placement='bottom'
              title='警告'
              description='确定删除选中的网络吗？'
              onConfirm={deleteEvent}
              okText='确定'
              cancelText='取消'>
              <div className='btn delete'>
                <i className='icon iconfont icon-shanchu'></i>
                <span>删除</span>
              </div>
            </Popconfirm>
          </div>
        </Col>
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
                  placeholder='网络名称/国家/地区/国家代码'
                  maxLength={20}
                  style={{ width: 220 }}></Input>
              </Form.Item>
              <Form.Item style={{ marginBottom: size == 'small' ? 5 : 10 }}>
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
          dataSource={tableData}
          rowKey={'id'}
          onRow={onRow}
          rowSelection={rowSelection}
          rowClassName={(record, index) =>
            index == activeIndex ? 'active' : ''
          }
          sticky
          pagination={{ position: ['bottomRight'] }}
          scroll={{ x: 'max-content' }}
          loading={loading}
        />
      </ConfigProvider>
      <AddDialog onSearch={search} ref={addDialogRef} />
    </div>
  )
}
