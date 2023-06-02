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
  App,
  Popconfirm,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import AddDialog from './dialog/addDialog'
import MenuTitle from '@/components/menuTitle/menuTitle'

import { useSize } from '@/hooks'
import {
  getMobileRouteList,
  getAllChannelId,
  deleteMobileRouteList,
} from '@/api'
import { API } from 'apis'

import './numberChannelsRoute.scss'

interface DataType extends API.GetMobileRouteListItems {}
interface FormValues {
  mobile: string
  type: string
  keyword: string
  channel: string
  channel_name: string
  account: string
}

// 号码通道路由
export default function NumberChannelsRoute() {
  const addDialogRef: MutableRefObject<any> = useRef(null)
  const { Option } = Select
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
        if (selectedRowKeys.includes(record.mobile)) {
          setSelectedRowKeys(
            selectedRowKeys.filter((item) => item != record.mobile),
          )
        } else {
          setSelectedRowKeys([...selectedRowKeys, record.mobile])
        }
      },
    }
  }
  const rowSelection = {
    columnWidth: 60,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys)
    },
  }
  const size = useSize()
  const [form] = Form.useForm()
  const [tableData, settableData] = useState<API.GetMobileRouteListItems[]>([])

  // 初始化form的值
  const initFormValues: FormValues = {
    account: '',
    mobile: '',
    type: 'all',
    keyword: '',
    channel: '',
    channel_name: '',
  }
  const search = async () => {
    const values = await form.getFieldsValue()
    formatSearchValue(values)
  }
  const formatSearchValue = (params: FormValues) => {
    const { mobile, type, keyword, channel, channel_name, account } = params
    const searchParams = {
      mobile,
      type,
      keyword,
      channel,
      channel_name,
      account,
    }
    searchEvent(searchParams)
  }
  const searchEvent = async (params: API.GetMobileRouteListParams) => {
    try {
      const res = await getMobileRouteList(params)
      settableData(res.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    formatSearchValue(initFormValues)
    allGroupId()
  }, [])
  const allGroupId = async () => {
    const res = await getAllChannelId('')
    setallChannelData([{ id: '', name: '全部通道' }, ...res.data])
  }
  const [allChannelData, setallChannelData] = useState<
    API.GetAllChannelIdParamsItems[]
  >([])

  const messageList = [
    { label: '短信类型', value: 'all' },
    { label: '行业短信', value: '1' },
    { label: '营销短信', value: '2' },
  ]

  const columns: ColumnsType<DataType> = [
    {
      title: '手机号码',
      dataIndex: 'mobile',
      className: 'paddingL30',
      width: 280,
    },
    {
      title: '短信类型',
      width: 150,
      dataIndex: 'type',
      render: (_, record: DataType) => (
        <div>
          {record.type == '1' ? <span>行业短信</span> : <span>营销短信</span>}
        </div>
      ),
    },
    {
      title: '关联账号',
      dataIndex: 'account',
      width: 280,
    },
    {
      title: '关联国家/地区',
      dataIndex: 'country_cn',
      width: 280,
    },
    {
      title: '通道',
      dataIndex: 'channel_name',
      render: (_, record: DataType) => (
        <div>
          {record.channel_name == null ? (
            <span>该通道已删除</span>
          ) : (
            <span>{record.channel_name}</span>
          )}
        </div>
      ),
    },
    {
      title: '发送名',
      width: 320,
      className: 'paddingL30',
      dataIndex: 'name',
    },
    {
      title: '操作',
      width: 220,
      render: (_, record) => (
        <div>
          <Button
            type='link'
            style={{ paddingLeft: 0 }}
            onClick={() => updateMobileRouteEvent(false, record)}>
            编辑
          </Button>
          <Button type='link'>
            <Popconfirm
              placement='left'
              title='警告'
              description='确定删除该条号码通道路由吗？'
              onConfirm={() => singleDeleteEvent(record.mobile)}
              okText='确定'
              cancelText='取消'>
              删除
            </Popconfirm>
          </Button>
        </div>
      ),
    },
  ]
  const updateMobileRouteEvent = (isAdd: boolean = true, record?: DataType) => {
    addDialogRef.current.open({ isAdd, record })
  }
  const { message } = App.useApp()

  // 单独删除事件
  const singleDeleteEvent = async (mobile: any) => {
    await deleteMobileRouteList({ mobile })
    await search()
  }
  // 批量删除号码通道路由
  const deleteEvent = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请勾选要删除的号码通道路由！')
      return
    }
    const mobile = selectedRowKeys.join(',')
    await deleteMobileRouteList({ mobile })
    await search()
    setSelectedRowKeys([])
  }
  return (
    <div data-class='numberChannelsRoute'>
      <MenuTitle title='号码通道路由'></MenuTitle>
      <Row justify='space-between' wrap align={'bottom'}>
        <Col>
          <div className='btn-group' style={{ marginBottom: '10px' }}>
            <div className='btn' onClick={() => updateMobileRouteEvent()}>
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
              initialValues={{ message_type: 'all', channels_type: 'all' }}
              layout='inline'
              wrapperCol={{ span: 24 }}
              autoComplete='off'>
              <Form.Item label='' name='keyword' style={{ marginBottom: 10 }}>
                <Input
                  size={size}
                  placeholder='手机号码/发送名/账号/国家地区'
                  maxLength={20}
                  style={{ width: 220 }}></Input>
              </Form.Item>
              <Form.Item label='' name='type' style={{ marginBottom: 10 }}>
                <Select
                  placeholder='短信类型'
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
                  {messageList.map((item) => (
                    <Option value={item.value} key={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label='' name='channel' style={{ marginBottom: 10 }}>
                <Select
                  placeholder='全部通道'
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
                  {allChannelData.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
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
                    onClick={search}
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
          rowKey={'mobile'}
          onRow={onRow}
          rowSelection={rowSelection}
          rowClassName={(record, index) =>
            index == activeIndex ? 'active' : ''
          }
          sticky
          pagination={{ position: ['bottomRight'] }}
          scroll={{ x: 'max-content' }}
        />
      </ConfigProvider>
      <AddDialog
        onSearch={search}
        messageList={messageList}
        allChannelData={allChannelData}
        ref={addDialogRef}
      />
    </div>
  )
}
