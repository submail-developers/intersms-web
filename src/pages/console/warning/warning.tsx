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
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import AddDialog from './dialog/addDialog'
import MenuTitle from '@/components/menuTitle/menuTitle'
import { getalArmConfigList } from '@/api'
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
      id: '',
      type: 'all',
      keyword: '',
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
    { label: '报警类型', value: 'all' },
    { label: '报警类型1', value: '1' },
    { label: '报警类型2', value: '2' },
  ]

  const onFinish = (values: FormValues) => {}

  const columns: ColumnsType<DataType> = [
    {
      title: '报警类型',
      dataIndex: 'warning_type',
      className: 'paddingL30',
      width: 120,
      render: (_, record) => {
        return (
          <>
            <span>
              {record.type == '1'
                ? '账号报警'
                : record.type == '2'
                ? '通道报警'
                : record.type == '3'
                ? '状态报警'
                : '国家报警'}
            </span>
          </>
        )
      },
    },
    {
      title: '名称',
      dataIndex: 'country_cn',
      width: 120,
    },
    {
      title: '报警时间范围',
      dataIndex: 'time',
      width: 120,
    },
    {
      title: '报警失败率',
      dataIndex: 'fail',
      width: 120,
    },
    {
      title: '报警开关',
      width: 120,
      render: (_, record) => {
        return (
          <>
            <Switch size='small' checked={record.status == '1'} />
            &nbsp;
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
          <Button type='link' style={{ paddingLeft: 0 }}>
            编辑
          </Button>
          <Button type='link'>删除</Button>
        </>
      ),
    },
  ]

  const updateCountryEvent = () => {
    addDialogRef.current.open()
  }

  return (
    <div data-class='numberChannelsRoute'>
      <MenuTitle title='报警设置'></MenuTitle>
      <Row justify='space-between' wrap align={'bottom'}>
        <Col>
          <div className='btn-group' style={{ marginBottom: '10px' }}>
            <div className='btn' onClick={updateCountryEvent}>
              <i className='icon iconfont icon-bianji'></i>
              <span>新增</span>
            </div>
            <Popconfirm
              placement='bottom'
              title='警告'
              description='确定启用选中的敏感词吗？'
              // onConfirm={() => batchDeactivation('1')}
              okText='确定'
              cancelText='取消'>
              <div className='btn'>
                <i className='icon iconfont icon-qiyong'></i>
                <span>启用</span>
              </div>
            </Popconfirm>
            <div className='btn'>
              <i className='icon iconfont icon-tingyong'></i>
              <span>停用</span>
            </div>
            <div className='btn delete'>
              <i className='icon iconfont icon-bianji'></i>
              <span>删除</span>
            </div>
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
              onFinish={onFinish}
              autoComplete='off'>
              <Form.Item label='' name='country' style={{ marginBottom: 10 }}>
                <Input
                  size={size}
                  placeholder='国家/地区/通道/账号'
                  maxLength={20}
                  style={{ width: 220 }}></Input>
              </Form.Item>
              <Form.Item
                label=''
                name='message_type'
                style={{ marginBottom: 10 }}>
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
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      </ConfigProvider>
      <AddDialog ref={addDialogRef} />
    </div>
  )
}
