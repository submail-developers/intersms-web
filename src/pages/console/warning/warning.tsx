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
  Checkbox,
  Switch,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import AddDialog from './dialog/addDialog'
import MenuTitle from '@/components/menuTitle/menuTitle'
import type { Dayjs } from 'dayjs'
import { useSize } from '@/hooks'
import { API } from 'apis'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import './warning.scss'

interface DataType {
  id: string
  warning_type: string
  name: string
  times: string
  min_length: string
  fail: string
  status: string
}
interface FormValues {
  channel: string
  group: string
  time: [Dayjs, Dayjs] | null
  keyword: string
}

// 国家信息配置
export default function NumberChannelsRoute() {
  const addDialogRef: MutableRefObject<any> = useRef(null)
  const { Option } = Select
  const { RangePicker } = DatePicker
  const size = useSize()
  const [form] = Form.useForm()
  const { message } = App.useApp()

  const typeList = [
    { label: '报警类型', value: 'all' },
    { label: '报警类型1', value: '1' },
    { label: '报警类型2', value: '2' },
  ]
  const groupList = [
    { label: '全部通道组', value: 'all' },
    { label: '通道组1', value: '1' },
    { label: '通道组2', value: '2' },
  ]

  const onFinish = (values: FormValues) => {}

  const columns: ColumnsType<DataType> = [
    {
      title: <Checkbox></Checkbox>,
      className: 'checkbox-wrap',
      width: 80,
      render: (_, record) => (
        <Checkbox
          className='checkbox'
          onChange={(e) => onChange(e, record)}></Checkbox>
      ),
    },
    {
      title: '报警类型',
      dataIndex: 'warning_type',
      width: '20%',
      onCell: (record: DataType) => {
        return {
          onClick: () => {
            setSelectedRowKeys([record.id])
          },
        }
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      onCell: (record: DataType) => {
        return {
          onClick: () => {
            setSelectedRowKeys([record.id])
          },
        }
      },
    },
    {
      title: '报警时间范围',
      dataIndex: 'times',
      onCell: (record: DataType) => {
        return {
          onClick: () => {
            setSelectedRowKeys([record.id])
          },
        }
      },
    },
    {
      title: '报警最小条数',
      dataIndex: 'min_length',
      onCell: (record: DataType) => {
        return {
          onClick: () => {
            setSelectedRowKeys([record.id])
          },
        }
      },
    },
    {
      title: '报警失败率',
      dataIndex: 'fail',
      onCell: (record: DataType) => {
        return {
          onClick: () => {
            setSelectedRowKeys([record.id])
          },
        }
      },
    },
    {
      title: '报警开关',
      render: (_, record) => {
        return (
          <>
            <Switch size='small' checked={record.status == '1'} />
            <span>{record.status == '1' ? '已启用' : '未启用'}</span>
          </>
        )
      },
      onCell: (record: DataType) => {
        return {
          onClick: () => {
            setSelectedRowKeys([record.id])
          },
        }
      },
    },
    // {
    //   title: '操作',
    //   render: (_, record) => (
    //     <div>
    //       <Button type='link' style={{ paddingLeft: 0, paddingRight: 0 }}>
    //         编辑
    //       </Button>
    //       <Button type='link'>删除</Button>
    //     </div>
    //   ),
    // },
  ]

  // 被点击的客户(不是被checkbox选中的客户)
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | string[]>(
    [],
  )
  // checkbox勾选的客户
  const [checkedIds, setcheckedIds] = useState<string[]>([])

  // checkbox勾选的事件
  const onChange = (e: CheckboxChangeEvent, record: DataType) => {
    if (e.target.checked) {
      setcheckedIds([...checkedIds, record.id])
    } else {
      setcheckedIds(checkedIds.filter((account) => account !== record.id))
    }
  }

  const rowSelection = {
    selectedRowKeys,
    hideSelectAll: true,
    columnWidth: 4,
    renderCell: () => {
      return null
    },
  }

  const data: DataType[] = []
  for (let i = 0; i < 100; i++) {
    data.push({
      id: 'id' + i,
      warning_type: '国家报警',
      name: '中国' + i,
      times: '10分钟',
      min_length: '1->100',
      fail: '2%',
      status: '' + (i % 2),
    })
  }

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
            <div className='btn' onClick={updateCountryEvent}>
              <i className='icon iconfont icon-bianji'></i>
              <span>编辑</span>
            </div>
            <div className='btn' onClick={updateCountryEvent}>
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
                  placeholder='国家/通道/账号'
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
                      colorPrimary: '#ff5e2d',
                      colorPrimaryHover: '#ff5e2d',
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
          rowSelection={rowSelection}
          rowKey={'id'}
          sticky
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      </ConfigProvider>
      <AddDialog ref={addDialogRef} />
    </div>
  )
}
