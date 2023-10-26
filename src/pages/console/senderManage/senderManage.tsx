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
  Tooltip,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import AddDialog from './dialog/addDialog'
import MenuTitle from '@/components/menuTitle/menuTitle'
import { CloudDownloadOutlined } from '@ant-design/icons'
import { useSize } from '@/hooks'
import { getSenderEvidence, getAllChannelId, deleteSenderEvidence } from '@/api'
import { API } from 'apis'

import './senderManage.scss'

interface DataType extends API.GetSenderEvidenceItems {}
interface FormValues {
  id: string
  status: string
  keyword: string
  limit: string
  page: string
}

// 号码通道路由
export default function NumberChannelsRoute() {
  const size = useSize()
  const addDialogRef: MutableRefObject<any> = useRef(null)
  const { Option } = Select
  // 被点击的客户(不是被checkbox选中的客户)
  const [activeIndex, setactiveIndex] = useState<number>()
  const [loading, setloading] = useState(false)
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
  const [tableData, settableData] = useState<API.GetSenderEvidenceItems[]>([])

  // 初始化form的值
  const initFormValues: FormValues = {
    id: '',
    status: 'all',
    keyword: '',
    limit: '50',
    page: '1',
  }
  const search = async () => {
    const values = await form.getFieldsValue()
    formatSearchValue(values)
  }
  const formatSearchValue = (params: FormValues) => {
    const { id, status, keyword, limit, page } = params
    const searchParams = {
      id,
      status,
      keyword,
      limit,
      page,
    }
    searchEvent(searchParams)
  }
  const searchEvent = async (params: API.GetSenderEvidenceParams) => {
    try {
      setloading(true)
      const res = await getSenderEvidence(params)
      settableData(res.data)
      setloading(false)
    } catch (error) {
      setloading(false)
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
    { label: '全部状态', value: 'all' },
    { label: '申请中', value: '1' },
    { label: '申请失败', value: '0' },
    { label: '申请成功', value: '2' },
  ]

  const columns: ColumnsType<DataType> = [
    {
      title: '账号',
      dataIndex: 'mail',
      className: size == 'small' ? '' : 'paddingL30',
      width: size == 'small' ? 90 : 140,
      fixed: true,
    },
    {
      title: '国家',
      width: 120,
      className: 'paddingL20',
      dataIndex: 'country_cn',
    },
    {
      title: '通道',
      dataIndex: 'channel_name',
      width: 180,
      className: 'paddingL20',
    },
    {
      title: 'Sender名',
      dataIndex: 'sender',
      width: 120,
    },
    {
      title: 'Sender属性',
      dataIndex: 'channel_name',
      className: 'paddingL20',
      width: 100,
      render: (_, record: DataType) => (
        <div style={{ width: '100px' }} className='g-ellipsis'>
          {record.sender_type == '1' ? (
            <span style={{ color: '#5765cc' }}>
              <i className='iconfont icon-wangluo'></i> 国际
            </span>
          ) : (
            <span style={{ color: '#cd2fb1' }}>
              {' '}
              <i className='iconfont icon-dizhi'></i> 本地
            </span>
          )}
        </div>
      ),
    },
    {
      title: '营业执照',
      width: 100,
      className: 'paddingL20',
      dataIndex: 'business_license',
      render: (_, record: DataType) => (
        <div>
          {record.business_license != '' ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span>已上传</span> &nbsp;&nbsp;
              <Tooltip title={'点击下载'}>
                <a
                  href={`${record.business_license}`}
                  className='downlaoda-fail'>
                  <CloudDownloadOutlined
                    rev={undefined}
                    style={{ fontSize: '16px' }}
                  />
                </a>
              </Tooltip>
            </div>
          ) : (
            <span className='color-gray'>未上传</span>
          )}
        </div>
      ),
    },
    {
      title: '注册资料',
      width: 100,
      className: 'paddingL20',
      dataIndex: 'registration',
      render: (_, record: DataType) => (
        <div>
          {record.registration != '' ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span>已上传</span> &nbsp;&nbsp;
              <Tooltip title={'点击下载'}>
                <a href={`${record.registration}`} className='downlaoda-fail'>
                  <CloudDownloadOutlined
                    rev={undefined}
                    style={{ fontSize: '16px' }}
                  />
                </a>
              </Tooltip>
            </div>
          ) : (
            <span className='color-gray'>未上传</span>
          )}
        </div>
      ),
    },
    {
      title: '状态',
      width: 100,
      className: 'paddingL20',
      dataIndex: 'sender_status',
      render: (_, record: DataType) => {
        let text = ''
        let txtColor = ''
        switch (record.sender_status) {
          case '0':
            text = '申请失败'
            txtColor = 'color-warning'
            break
          case '1':
            text = '申请中'
            break
          case '2':
            text = '申请成功'
            txtColor = 'color-success'
            break
        }
        return <div className={txtColor}>{text}</div>
      },
    },
    {
      title: '最后创建/编辑时间',
      width: 130,
      dataIndex: '',
      render: (_, record: DataType) => (
        <div>
          <div>{record.date}</div>
          <div>{record.date_last}</div>
        </div>
      ),
    },
    {
      title: '操作',
      width: 100,
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
              description='确定删除该条管理信息吗？'
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
  const updateMobileRouteEvent = (isAdd: boolean = true, record?: DataType) => {
    addDialogRef.current.open({ isAdd, record })
  }
  const { message } = App.useApp()

  // 单独删除事件
  const singleDeleteEvent = async (id: any) => {
    await deleteSenderEvidence({ id })
    await search()
  }
  // 批量删除管理信息
  const deleteEvent = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请勾选要删除的管理信息！')
      return
    }
    const id = selectedRowKeys.join(',')
    await deleteSenderEvidence({ id })
    await search()
    setSelectedRowKeys([])
  }
  return (
    <div data-class='numberChannelsRoute'>
      <MenuTitle title='Sender管理'></MenuTitle>
      <Row justify='space-between' wrap align={'bottom'}>
        <Col>
          <div
            className='btn-group'
            style={{ marginBottom: size == 'small' ? 5 : 10 }}>
            <div className='btn' onClick={() => updateMobileRouteEvent()}>
              <i className='icon iconfont icon-bianji'></i>
              <span>新增</span>
            </div>

            <Popconfirm
              placement='bottom'
              title='警告'
              description='确定删除选中的信息吗？'
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
              <Form.Item
                label=''
                name='keyword'
                style={{ marginBottom: size == 'small' ? 0 : 10 }}>
                <Input
                  size={size}
                  placeholder='账号/国家/通道/Sender名'
                  maxLength={20}
                  style={{ width: 220 }}></Input>
              </Form.Item>
              <Form.Item
                label=''
                name='status'
                style={{ marginBottom: size == 'small' ? 0 : 10 }}>
                <Select
                  placeholder='全部状态'
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
      <AddDialog
        onSearch={search}
        messageList={messageList}
        allChannelData={allChannelData}
        ref={addDialogRef}
      />
    </div>
  )
}
