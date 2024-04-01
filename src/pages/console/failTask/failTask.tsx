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
  Tooltip,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import AddDialog from './dialog/addDialog'
import MyDrawer from './dialog/drawer/drawer'
import MenuTitle from '@/components/menuTitle/menuTitle'
import { getHandlerList } from '@/api'
import { useSize } from '@/hooks'
import { API } from 'apis'
import { Link } from 'react-router-dom'
import './failTask.scss'
interface DataType extends API.GetHandlerListItem {}
interface FormValues {
  mail: string
  page: string
  limit: string
}
// 国家信息配置
export default function NumberChannelsRoute() {
  const addDialogRef: MutableRefObject<any> = useRef(null)
  const drawerRef: MutableRefObject<any> = useRef(null)

  // 选中的keys
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const onRow = (record: DataType, index?: number) => {
    return {
      onClick: () => {},
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

  const size = useSize()
  const [form] = Form.useForm()
  const [tableData, settableData] = useState<DataType[]>([])
  const [loading, setloading] = useState(false)
  const search = async (ifshowLoading = false) => {
    try {
      ifshowLoading && setloading(true)
      const values = await form.getFieldsValue()
      const { mail } = values
      const params = {
        mail,
        page: '',
        limit: '50',
      }
      const res = await getHandlerList(params)
      let list: DataType[] = res.data.data.map((item, index) => {
        let obj = { ...item, index: `${index}` }
        return obj
      })
      settableData(list)
      setloading(false)
    } catch (error) {
      setloading(false)
    }
  }
  useEffect(() => {
    search(true)
  }, [])

  const onFinish = (values: FormValues) => {}

  const columns: ColumnsType<DataType> = [
    {
      title: '发送账号',
      dataIndex: 'account_mail',
      className: 'paddingL30',
      width: size == 'middle' ? 160 : 100,
      fixed: true,
      render: (_, record) => (
        <Tooltip
          title={record.account_mail}
          placement='bottom'
          mouseEnterDelay={0.3}
          trigger={['hover', 'click']}>
          <div className='fw500'>
            <Link
              to={`/console/customer/accountinfo?sender=${record.account_mail}`}>
              {record.account_mail}
            </Link>
          </div>
        </Tooltip>
      ),
    },
    {
      title: '名字',
      dataIndex: 'account_name',
      className: 'paddingL30',
      width: 140,
    },
    {
      title: '电话',
      className: 'paddingL30',
      width: 140,
      render: (_, record) => {
        return (
          <>
            <span>
              {record.account_mob == null ? '-' : record.account_mob}{' '}
            </span>
          </>
        )
      },
    },
    {
      title: '公司',
      width: 220,
      className: 'paddingL30',
      render: (_, record) => {
        return (
          <>
            <span>
              {record.account_company == null ? '-' : record.account_company}{' '}
            </span>
          </>
        )
      },
    },
    {
      title: '数量',
      dataIndex: 'handle_count',
      width: 80,
      className: 'paddingL30',
    },
    {
      title: '类型',
      width: 120,
      className: 'paddingL30',
      render: (_, record) => {
        return <span>{record.sms_type == '1' ? '行业类型' : '营销类型'}</span>
      },
    },
    {
      title: '状态',
      width: 120,
      className: 'paddingL30',
      render: (_, record) => {
        let txt = ''
        let txtColor = ''
        if (record.flg == '1') {
          txtColor = 'color-warning'
          txt = '未处理'
        } else {
          if (record.handle_count == record.count_success_push) {
            txtColor = 'color-success'
            txt = '成功'
          } else {
            txt = '处理中'
          }
        }
        return <div className={`fw500 ${txtColor}`}>{txt}</div>
      },
    },
    {
      title: '任务名称',
      width: 200,
      className: 'paddingL30',
      render: (_, record) => {
        return <span>{record.task_name == null ? '-' : record.task_name}</span>
      },
    },
    {
      title: '处理进度',
      width: 100,
      className: 'paddingL30',
      render: (_, record) => {
        return (
          <span>
            {record.count_success_push}/{record.handle_count}
          </span>
        )
      },
    },
    {
      title: '通道组',
      width: 240,
      className: 'paddingL30',
      render: (_, record) => {
        return (
          <span>{record.group_name == null ? '-' : record.group_name}</span>
        )
      },
    },
    {
      title: '最后处理时间',
      width: 200,
      className: 'paddingL30',
      render: (_, record) => {
        return <span>{record.end_time == null ? '-' : record.end_time}</span>
      },
    },
    {
      title: '操作',
      width: 90,
      className: 'paddingL30',
      render: (_, record) => (
        <>
          {record.flg == '1' ? (
            <Button
              type='link'
              style={{ paddingLeft: 0 }}
              onClick={() => addWaringPerson(record)}>
              查看
            </Button>
          ) : (
            <Button type='link' style={{ paddingLeft: 0 }} disabled>
              查看
            </Button>
          )}
        </>
      ),
    },
  ]

  const updateWaringEvent = (isAdd: boolean = true, record?: DataType) => {
    addDialogRef.current.open({ isAdd, record })
  }

  const addWaringPerson = (record: DataType) => {
    drawerRef.current.open(record)
  }

  return (
    <div data-class='fail-task'>
      <MenuTitle title='失败任务处理列表'></MenuTitle>
      <Row justify='space-between' wrap align={'bottom'}>
        <Col>
          <ConfigProvider
            theme={{
              token: {
                controlHeight: 40,
              },
            }}>
            <Form
              name='basic1'
              form={form}
              layout='inline'
              wrapperCol={{ span: 24 }}
              onFinish={onFinish}
              autoComplete='off'>
              <Form.Item
                label=''
                name='mail'
                style={{ marginBottom: size == 'small' ? 0 : 10 }}>
                <Input
                  size={size}
                  placeholder='发送账号'
                  style={{ width: 220 }}></Input>
              </Form.Item>
              <Form.Item style={{ marginBottom: size == 'small' ? 5 : 10 }}>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: '#0074d7',
                    },
                  }}>
                  <Button
                    type='primary'
                    size={size}
                    onClick={() => search(true)}
                    htmlType='submit'
                    style={{ width: 110, marginLeft: 0 }}>
                    查询
                  </Button>
                </ConfigProvider>
              </Form.Item>

              <Form.Item style={{ marginBottom: size == 'small' ? 5 : 10 }}>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: '#0074d7',
                    },
                  }}></ConfigProvider>
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
          rowKey={'index'}
          onRow={onRow}
          sticky
          pagination={{ position: ['bottomRight'] }}
          scroll={{ x: 'max-content' }}
          loading={loading}
        />
      </ConfigProvider>
      <AddDialog ref={addDialogRef} onSearch={search} />
      <MyDrawer ref={drawerRef} onSearch={search} />
    </div>
  )
}
