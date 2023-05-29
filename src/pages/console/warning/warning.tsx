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
  Switch,
  Popconfirm,
  App,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import AddDialog from './dialog/addDialog'
import MenuTitle from '@/components/menuTitle/menuTitle'
import {
  getalArmConfigList,
  updateAlarmConfigStatus,
  deleteAlarmConfigList,
} from '@/api'
import type { Dayjs } from 'dayjs'
import { useSize } from '@/hooks'
import { API } from 'apis'

import './warning.scss'

interface DataType extends API.GetalArmConfigListItems {}
interface FormValues {
  id: string
  type: string
  keyword: string
  page: string
}

// 国家信息配置
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
    columnWidth: 60,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys)
    },
  }
  const size = useSize()
  const [form] = Form.useForm()
  const [tableData, settableData] = useState<API.GetalArmConfigListItems[]>([])
  // 初始化form的值
  const initFormValues: FormValues = {
    id: '',
    type: 'all',
    keyword: '',
    page: '1',
  }
  const search = async () => {
    const values = await form.getFieldsValue()
    formatSearchValue(values)
  }
  const formatSearchValue = (params: FormValues) => {
    const { id, type, page, keyword } = params
    const searchParams = {
      id,
      type,
      keyword,
      page: '1',
    }
    searchEvent(searchParams)
  }
  const searchEvent = async (params: API.GetalArmConfigListParams) => {
    try {
      const res = await getalArmConfigList(params)
      settableData(res.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    formatSearchValue(initFormValues)
  }, [])

  const typeList = [
    { label: '全部类型', value: 'all' },
    { label: '账号报警', value: '1' },
    { label: '通道报警', value: '2' },
    { label: '国家报警', value: '3' },
  ]

  const onFinish = (values: FormValues) => {}

  const columns: ColumnsType<DataType> = [
    {
      title: '报警类型',
      dataIndex: 'type',
      className: 'paddingL30',
      width: 120,
      render: (_, record) => {
        return (
          <>
            <span>
              {record.type == '1' ? (
                <span className='color'>账号报警</span>
              ) : record.type == '2' ? (
                <span className='color-warning'>通道报警</span>
              ) : record.type == '3' ? (
                <span className='color-words'>国家报警</span>
              ) : (
                ''
              )}
            </span>
          </>
        )
      },
    },
    {
      title: '报警对象',
      dataIndex: 'country_cn',
      width: 120,
      render: (_, record) => {
        return (
          <>
            <span>
              {record.type == '1' ? (
                <span>{record.sender_mail}</span>
              ) : record.type == '2' ? (
                <span>{record.channel_name}</span>
              ) : record.type == '3' ? (
                <span>{record.country_cn}</span>
              ) : (
                ''
              )}
            </span>
          </>
        )
      },
    },
    {
      title: '报警最小条数',
      dataIndex: 'row',
      width: 120,
      render: (_, record) => {
        return (
          <>
            <span>{record.row === '0' ? '-' : record.row + ' 条'} </span>
          </>
        )
      },
    },
    {
      title: '报警时间范围',
      dataIndex: 'time',
      width: 120,
      render: (_, record) => {
        return <span>{record.time + ' 分钟'} </span>
      },
    },
    {
      title: '报警失败率',
      dataIndex: 'fail',
      width: 120,
      render: (_, record) => {
        return <span>{record.fail + '%'} </span>
      },
    },
    {
      title: '报警开关',
      width: 120,
      render: (_, record) => {
        return (
          <>
            <Switch
              size='small'
              checked={record.status == '1'}
              onChange={(checked) => setSwicth(record, checked)}
            />
            &nbsp;&nbsp;
            <span>{record.status == '1' ? '已启用' : '未启用'}</span>
          </>
        )
      },
    },
    {
      title: '操作',
      width: 120,
      render: (_, record) => (
        <>
          <Button
            type='link'
            style={{ paddingLeft: 0 }}
            onClick={() => updateWaringEvent(false, record)}>
            编辑
          </Button>
          <Button type='link'>
            <Popconfirm
              placement='left'
              title='警告'
              description='确定删除该条报警吗？'
              onConfirm={() => singleDeleteEvent(record.id)}
              okText='确定'
              cancelText='取消'>
              删除
            </Popconfirm>
          </Button>
        </>
      ),
    },
  ]

  const updateWaringEvent = (isAdd: boolean = true, record?: DataType) => {
    addDialogRef.current.open({ isAdd, record })
  }

  const { message } = App.useApp()
  //单独启用 停用事件
  const setSwicth = async (record: any, checked: any) => {
    let id = record.id
    if (checked == true) {
      const status = '1'
      await updateAlarmConfigStatus({ id, status })
      await search()
    } else {
      const status = '0'
      await updateAlarmConfigStatus({ id, status })
      await search()
    }
  }
  //批量停用/启用
  const batchDeactivation = async (isOnOff: any) => {
    if (isOnOff === '0') {
      if (selectedRowKeys.length === 0) {
        message.warning('请勾选要停用的报警！')
        return
      }
      const status = '0'
      const id = selectedRowKeys.join(',')
      await updateAlarmConfigStatus({ id, status })
    } else {
      if (selectedRowKeys.length === 0) {
        message.warning('请勾选要启用的报警！')
        return
      }
      const status = '1'
      const id = selectedRowKeys.join(',')
      await updateAlarmConfigStatus({ id, status })
    }

    await search()
    setSelectedRowKeys([])
  }
  // 单独删除事件
  const singleDeleteEvent = async (id: any) => {
    await deleteAlarmConfigList({ id })
    await search()
  }
  // 批量删除事件
  const deleteEvent = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请勾选要删除的报警！')
      return
    }
    const id = selectedRowKeys.join(',')
    await deleteAlarmConfigList({ id })
    await search()
    setSelectedRowKeys([])
  }
  return (
    <div data-class='numberChannelsRoute'>
      <MenuTitle title='报警设置'></MenuTitle>
      <Row justify='space-between' wrap align={'bottom'}>
        <Col>
          <div className='btn-group' style={{ marginBottom: '10px' }}>
            <div className='btn' onClick={() => updateWaringEvent()}>
              <i className='icon iconfont icon-bianji'></i>
              <span>新增</span>
            </div>
            <Popconfirm
              placement='bottom'
              title='警告'
              description='确定启用选中报警吗？'
              onConfirm={() => batchDeactivation('1')}
              okText='确定'
              cancelText='取消'>
              <div className='btn'>
                <i className='icon iconfont icon-qiyong'></i>
                <span>启用</span>
              </div>
            </Popconfirm>
            <Popconfirm
              placement='bottom'
              title='警告'
              description='确定停用选中的报警吗？'
              onConfirm={() => batchDeactivation('0')}
              okText='确定'
              cancelText='取消'>
              <div className='btn'>
                <i className='icon iconfont icon-tingyong'></i>
                <span>停用</span>
              </div>
            </Popconfirm>
            <Popconfirm
              placement='bottom'
              title='警告'
              description='确定删除选中的报警吗？'
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
              // initialValues={{ message_type: 'all', channels_type: 'all' }}
              layout='inline'
              wrapperCol={{ span: 24 }}
              onFinish={onFinish}
              autoComplete='off'>
              <Form.Item label='' name='keyword' style={{ marginBottom: 10 }}>
                <Input
                  size={size}
                  placeholder='国家/地区/通道/账号'
                  maxLength={20}
                  style={{ width: 220 }}></Input>
              </Form.Item>
              <Form.Item label='' name='type' style={{ marginBottom: 10 }}>
                <Select
                  placeholder='报警类型'
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
                  {typeList.map((item) => (
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
        />
      </ConfigProvider>
      <AddDialog ref={addDialogRef} onSearch={search} />
    </div>
  )
}
