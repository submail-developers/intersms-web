import {
  useState,
  useImperativeHandle,
  MutableRefObject,
  forwardRef,
  useRef,
} from 'react'
import {
  Form,
  Input,
  App,
  ConfigProvider,
  Button,
  Drawer,
  Table,
  Checkbox,
  Popconfirm,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useSize } from '@/hooks'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import './accessCountry.scss'

interface Props {
  // onSearch: () => void
}
interface DataType {
  id: string
  channel_name: string
  access_type: string
  channel_type: string
  speed: string
  prefix: string
}
const Dialog = (props: Props, ref: any) => {
  const size = useSize()
  const [form] = Form.useForm()

  const tableref: MutableRefObject<any> = useRef(null)
  const editDetailRef: MutableRefObject<any> = useRef(null)
  const { message } = App.useApp()
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const [show, setShow] = useState(false)

  const open = () => {
    setShow(true)
  }

  const close = () => {
    setShow(false)
  }

  const columns: ColumnsType<DataType> = [
    {
      title: <Checkbox></Checkbox>,
      dataIndex: 'checkbox',
      className: 'checkbox-wrap',
      width: 60,
      render: (_, record) => (
        <Checkbox
          className='checkbox'
          onChange={(e) => onChange(e, record)}></Checkbox>
      ),
    },
    {
      title: '通道名',
      dataIndex: 'channel_name',
      onCell: (record: DataType) => {
        return {
          onClick: () => {
            setSelectedRowKeys([record.id])
          },
        }
      },
    },
    {
      title: '接入类型',
      dataIndex: 'access_type',
      onCell: (record: DataType) => {
        return {
          onClick: () => {
            setSelectedRowKeys([record.id])
          },
        }
      },
    },
    {
      title: '通道类型',
      dataIndex: 'channel_type',
      onCell: (record: DataType) => {
        return {
          onClick: () => {
            setSelectedRowKeys([record.id])
          },
        }
      },
    },
    {
      title: '流速',
      dataIndex: 'speed',
      onCell: (record: DataType) => {
        return {
          onClick: () => {
            setSelectedRowKeys([record.id])
          },
        }
      },
    },
    {
      title: '号码前缀',
      dataIndex: 'prefix',
      onCell: (record: DataType) => {
        return {
          onClick: () => {
            setSelectedRowKeys([record.id])
          },
        }
      },
    },
    {
      title: '关联国家',
      dataIndex: 'actions',
      render: (_, record) => (
        <Button type='link' style={{ padding: 0 }}>
          查看详情
        </Button>
      ),
    },
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
      channel_name: 'string' + i,
      access_type: 'string',
      channel_type: 'string',
      speed: 'string',
      prefix: 'string',
    })
  }
  const editEvent = () => {
    editDetailRef.current.open()
    // close()
  }

  return (
    <Drawer
      title=''
      placement='right'
      onClose={close}
      closable={false}
      open={show}
      bodyStyle={{ backgroundColor: 'transparent' }}
      rootClassName='access-country-drawer'
      width={'70vw'}>
      <div className='drawer-container access-country' onClick={close}>
        <div
          ref={tableref}
          className='drawer-content'
          onClick={(e) => e.stopPropagation()}>
          <header className='drawer-header fx-between-center'>
            <div className='fx-y-center'>
              <i className='icon iconfont icon-quanqiuguojia fn20 color'></i>
              <span className='fn20' style={{ marginLeft: '10px' }}>
                通道关联国家
              </span>
            </div>

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
                autoComplete='off'>
                <Form.Item label='' name='name'>
                  <Input
                    size={size}
                    placeholder='国家名称/代码'
                    maxLength={20}
                    style={{ width: 162 }}></Input>
                </Form.Item>
                <Form.Item>
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
                <div className='close-btn fx-center-center' onClick={close}>
                  <div className='icon iconfont icon-shouhui'></div>
                </div>
              </Form>
            </ConfigProvider>
          </header>
          <div className='drawer-table-wrap'>
            <ConfigProvider
              theme={{
                token: {
                  colorBgContainer: 'transparent',
                },
              }}>
              <Table
                className='theme-cell bg-white'
                columns={columns}
                dataSource={data}
                rowSelection={rowSelection}
                rowKey={'id'}
                sticky
                pagination={false}
                scroll={{ x: 'max-content' }}
              />
            </ConfigProvider>
          </div>
          <footer className='drawer-footer fx'>
            <div className='btn-group'>
              <div className='btn' onClick={editEvent}>
                <i className='icon iconfont icon-xinzeng'></i>
                <span>新增</span>
              </div>
            </div>
            <div className='btn-group'>
              <Popconfirm
                placement='bottom'
                title='警告'
                description='确定删除选中的客户吗？'
                // onConfirm={deleteEvent}
                okText='确定'
                cancelText='取消'>
                <div className='btn gray'>
                  <i className='icon iconfont icon-shanchu'></i>
                  <span>删除</span>
                </div>
              </Popconfirm>
            </div>
          </footer>
        </div>
      </div>
    </Drawer>
  )
}
export default forwardRef(Dialog)
