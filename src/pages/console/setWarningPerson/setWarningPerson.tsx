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
  getAlarmNotifier,
  updateAlarmConfigStatus,
  deleteAlarmNotifierList,
} from '@/api'
import { useSize } from '@/hooks'
import { API } from 'apis'

import './warning.scss'

interface DataType extends API.GetAlarmNotifierItems {}
interface FormValues {
  id: string
  type: string
  keyword: string
}
interface SwitchProps {
  record: DataType
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
        if (selectedRowKeys.includes(record.mob)) {
          setSelectedRowKeys(
            selectedRowKeys.filter((item) => item != record.mob),
          )
        } else {
          setSelectedRowKeys([...selectedRowKeys, record.mob])
        }
      },
    }
  }
  const rowSelection = {
    columnWidth: 60,
    fixed: true,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys)
    },
  }
  const size = useSize()
  const [form] = Form.useForm()
  const [tableData, settableData] = useState<API.GetAlarmNotifierItems[]>([])
  const [loading, setloading] = useState(false)
  const search = async (ifshowLoading = false) => {
    try {
      ifshowLoading && setloading(true)
      const values = await form.getFieldsValue()
      const res = await getAlarmNotifier(values)
      settableData(res.data)
      setloading(false)
    } catch (error) {
      setloading(false)
    }
  }
  useEffect(() => {
    search(true)
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
      title: '手机号码',
      dataIndex: 'mob',
      width: 160,
      className: 'paddingL70',
      render: (_, record) => {
        return (
          <>
            <span>{record.mob} </span>
          </>
        )
      },
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 160,
      render: (_, record) => {
        return (
          <>
            <span>{record.name} </span>
          </>
        )
      },
    },

    {
      title: '操作',
      width: 240,
      render: (_, record) => (
        <>
          {/* <Button
            type='link'
            style={{ paddingLeft: 0 }}
            onClick={() => updateWaringEvent(false, record)}>
            编辑
          </Button> */}
          <Button type='link' style={{ padding: '0' }}>
            <Popconfirm
              placement='left'
              title='警告'
              description='确定删除该条报警人员吗？'
              onConfirm={() => singleDeleteEvent(record.mob)}
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

  // 单独删除事件
  const singleDeleteEvent = async (mob: any) => {
    await deleteAlarmNotifierList({ mob })
    await search()
  }
  // 批量删除事件
  const deleteEvent = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请勾选要删除的报警！')
      return
    }
    const mob = selectedRowKeys.join(',')
    await deleteAlarmNotifierList({ mob })
    await search()
    setSelectedRowKeys([])
  }

  return (
    <div data-class='warning'>
      <MenuTitle title='报警人员配置'></MenuTitle>
      <Row justify='space-between' wrap align={'bottom'}>
        <Col>
          <div
            className={`btn-group ${size}`}
            style={{ marginBottom: size == 'small' ? 5 : 10 }}>
            <div className='btn' onClick={() => updateWaringEvent()}>
              <i className='icon iconfont icon-bianji'></i>
              <span>新增</span>
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
              layout='inline'
              wrapperCol={{ span: 24 }}
              onFinish={onFinish}
              autoComplete='off'></Form>
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
          rowKey={'mob'}
          onRow={onRow}
          // rowSelection={rowSelection}
          rowClassName={(record, index) =>
            index == activeIndex ? 'active' : ''
          }
          sticky
          pagination={{ position: ['bottomRight'] }}
          scroll={{ x: 'max-content' }}
          loading={loading}
        />
      </ConfigProvider>
      <AddDialog ref={addDialogRef} onSearch={search} />
    </div>
  )
}
