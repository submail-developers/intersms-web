import React, {
  useState,
  useImperativeHandle,
  MutableRefObject,
  forwardRef,
  useRef,
  useEffect,
  useContext,
} from 'react'
import { TableColumnsType, Popconfirm } from 'antd'
import { Form, ConfigProvider, Button, Drawer, App, Table } from 'antd'
import { useSize, usePoint } from '@/hooks'
import AddWariningPersonDialog from '../addWarningPerson/addDialog'
import { getAlarmNotifier, deleteAlarmNotifierList } from '@/api'
import { API } from 'apis'
import './drawer.scss'

interface Props {
  // onSearch: () => void
}
interface DataType extends API.GetAlarmNotifierItems {}
export type DrawerContentRectType = {
  x: number
  y: number
}
const Dialog = (props: Props, ref: any) => {
  const size = useSize()
  const point = usePoint('xl')
  const [form] = Form.useForm()
  const [tableData, setTableData] = useState<API.GetAlarmNotifierItems[]>([])
  const [loading, setloading] = useState(false)
  const addDialogRef: MutableRefObject<any> = useRef(null)
  const tableref: MutableRefObject<any> = useRef(null)
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const [show, setShow] = useState(false)

  const drawerref: MutableRefObject<HTMLDivElement> = useRef(null)

  // 因为内部table组件使用了虚拟表格，必须要配置scroll={{x: number, y: number}}，drawer的宽和高用的vh vw，所以需要获取drawer组件的内容区宽高
  const [drawerContentRect, setdrawerContentRect] =
    useState<DrawerContentRectType>({
      x: 2000,
      y: 400,
    })
  useEffect(() => {
    // 获取drawer组件的内容区宽高
    const observer = new ResizeObserver(([entry]) => {
      setdrawerContentRect({
        x: Math.floor(entry.contentRect.width),
        y: Math.floor(entry.contentRect.height) - 50, // 去掉表头高度 50
      })
    })
    if (show) {
      observer.observe(drawerref?.current)
    } else {
      if (drawerref?.current) observer.unobserve(drawerref?.current)
    }
    return () => {
      if (drawerref?.current) observer.unobserve(drawerref?.current)
    }
  }, [show])

  const open = async (id: string, name: string) => {
    setShow(true)
    search()
  }
  const showTableLoading = () => {
    setloading(true)
  }

  useEffect(() => {}, [])

  const search = async (ifsetloading = false) => {
    try {
      ifsetloading && setloading(true)
      const res = await getAlarmNotifier('')
      setTableData(
        res.data.map((item, index) => {
          item.key = index
          return item
        }),
      )
    } catch (error) {
      setloading(false)
    }
  }

  const close = () => {
    setShow(false)
  }

  useEffect(() => {}, [])

  const columns: TableColumnsType<DataType> = [
    {
      title: '手机号码',
      className: 'paddingL10',
      fixed: true,
      dataIndex: 'mob',
      width: point ? 130 : 110,
      render(_, record) {
        return <div className={`td-content fw500`}>{record.mob}</div>
      },
    },
    {
      title: '姓名',
      width: 80,
      className: 'paddingL30',
      dataIndex: 'name',
      render(_, record) {
        return <div className={`td-content`}>{record.name}</div>
      },
    },

    {
      title: '操作',
      width: 120,

      render(_, record) {
        return (
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
        )
      },
    },
  ]

  // 新增报警人员
  const handleAddWarningPerson = (isAdd: boolean = true, record?: DataType) => {
    addDialogRef.current.open({ isAdd, record })
  }
  // 删除报警人员
  const singleDeleteEvent = async (mob: any) => {
    await deleteAlarmNotifierList({ mob })
    await search()
  }

  return (
    <Drawer
      title=''
      placement='right'
      onClose={close}
      closable={false}
      open={show}
      rootClassName='drawer channel-drawer'
      width={point ? '70vw' : '90vw'}>
      <div className='drawer-container' onClick={close}>
        <div
          className='drawer-content'
          onClick={(e) => e.stopPropagation()}
          ref={drawerref}
          style={{ height: size == 'middle' ? '70vh' : '90vh' }}>
          <header
            className={`drawer-header ${
              size == 'middle' ? 'fx-between-center' : 'xl'
            }`}>
            <div className={`${size == 'middle' ? 'fx-y-center' : 'xl'}`}>
              <div
                className='switch-all'
                style={{ marginLeft: point ? 10 : 0 }}>
                <div className='fx-y-center'>报警人员设置</div>
              </div>
            </div>
            <ConfigProvider
              theme={{
                token: {
                  controlHeight: point ? 40 : 32,
                  fontSize: point ? 14 : 12,
                },
              }}>
              <Form
                name='basic'
                form={form}
                layout='inline'
                wrapperCol={{ span: 24 }}
                autoComplete='off'>
                <Form.Item>
                  <ConfigProvider
                    theme={{
                      token: {
                        colorPrimary: '#ff4d4f',
                        colorPrimaryHover: '#ff4d4f',
                      },
                    }}>
                    <div className='btn-group'>
                      <div
                        className='btn add-person'
                        onClick={() => handleAddWarningPerson()}>
                        <i className='icon iconfont icon-bianji'></i>
                        <span>新增</span>
                      </div>
                    </div>
                  </ConfigProvider>
                </Form.Item>
              </Form>
            </ConfigProvider>
            <div className='close-btn fx-center-center' onClick={close}>
              <div className='icon iconfont icon-shouhui'></div>
            </div>
          </header>
          <div
            className='drawer-table-wrap'
            style={{ marginTop: point ? '' : 20 }}>
            <Table
              className='drawer-table'
              columns={columns}
              dataSource={tableData}
              pagination={false}
              loading={loading}
            />
          </div>
        </div>
      </div>
      <AddWariningPersonDialog ref={addDialogRef} onSearch={search} />
    </Drawer>
  )
}
export default forwardRef(Dialog)
