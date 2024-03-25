import React, {
  useState,
  useImperativeHandle,
  MutableRefObject,
  forwardRef,
  useRef,
  useEffect,
  useContext,
} from 'react'
import { TableColumnsType, Popconfirm, Tooltip } from 'antd'
import { Form, ConfigProvider, Button, Drawer, App, Table } from 'antd'
import { useSize, usePoint } from '@/hooks'
import FailTaskDo from '../failTask/addDialog'
import {
  getHandlerDetailList,
  GetRegioncodeByCountry,
  getChannelGroupList,
  deleteHandlerItem, //删除单条号码
  deleteAllHandlerItem, //删除全部
} from '@/api'
import { API } from 'apis'
import { Link } from 'react-router-dom'
import './drawer.scss'

interface Props {
  onSearch: () => void
}
interface DataType extends API.GetHandlerDetailListItem {}
export type DrawerContentRectType = {
  x: number
  y: number
}
interface FormValues {
  account: string
  page: string
  limit: string
}

const Dialog = (props: Props, ref: any) => {
  const size = useSize()
  const point = usePoint('xl')
  const [form] = Form.useForm()
  const [tableData, setTableData] = useState<API.GetHandlerDetailListItem[]>([])
  const [loading, setloading] = useState(false)
  const [accountMail, setAccountMail] = useState()
  const addDialogRef: MutableRefObject<any> = useRef(null)
  const tableref: MutableRefObject<any> = useRef(null)
  const [allCountry, setallCountry] = useState<API.CountryItem[]>([])
  const [channelsList, setchannelsList] = useState([])
  const [allAppid, setallAppid] = useState([])
  const [accountInfo, setAccountInfo] = useState()
  const accountRef = useRef(null)
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

  const open = async (record) => {
    setAccountMail(record.account_mail)
    setAccountInfo(record.account)
    accountRef.current = {
      account: record.account,
    }
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
      const values = await form.getFieldsValue()
      const params = {
        account: accountRef.current.account,
        page: '',
        limit: '',
      }
      const res = await getHandlerDetailList(params)

      let list: DataType[] = res.data.list.map((item, index) => {
        let obj = { ...item, index: `${index}` }
        return obj
      })
      setTableData(list)

      let appidList = res.data.app.map((item, index) => {
        let obj = { ...item, index: `${index}` }
        return obj
      })

      setallAppid([{ app: '全部APPID', id: '0' }, ...appidList])
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
      title: '号码',
      className: 'paddingL10',
      fixed: true,
      dataIndex: 'dst_addr',
      width: point ? 80 : 60,
    },
    {
      title: 'APPID',
      width: 80,
      className: 'paddingL30',
      dataIndex: 'appid',
    },
    {
      title: '国家/地区',
      width: 120,
      className: 'paddingL30',
      dataIndex: 'country',
    },
    {
      title: '短信内容',
      width: 280,
      className: 'paddingL30',
      dataIndex: 'text',
      render(_, record) {
        return (
          <Tooltip title={record.text} placement='bottom'>
            <div className='g-ellipsis-2'>{record.text}</div>
          </Tooltip>
        )
      },
    },
    {
      title: '短信失败类型',
      width: 120,
      className: 'paddingL30',
      dataIndex: 'name',
      render(_, record) {
        return (
          <div>
            {record.sms_tag == '0' ? '空通道路由数据' : '未找到队列数据'}
          </div>
        )
      },
    },

    {
      title: '操作',
      width: 50,
      render(_, record) {
        return (
          <>
            <Button type='link' style={{ paddingLeft: '0' }}>
              <Popconfirm
                placement='left'
                title='警告'
                description='确定删除该条号码？'
                onConfirm={() => singleDeleteEvent(record.send_id)}
                okText='确定'
                cancelText='取消'>
                删除
              </Popconfirm>
            </Button>
          </>
        )
      },
    },
  ]
  // 获取所有国家
  const getCountryList = async () => {
    const res = await GetRegioncodeByCountry()
    let countrys: API.CountryItem[] = []
    res.data.forEach((item) => {
      countrys = [...countrys, ...item.children]
    })
    setallCountry([{ label: '全部国家', value: '0', area: '' }, ...countrys])
  }

  // 获取通道组列表
  const getChannels = async () => {
    try {
      const res = await getChannelGroupList({})
      setchannelsList(res.data)
    } catch (error) {}
  }

  const handleAddWarningPerson = (types) => {
    addDialogRef.current.open(types)

    if (allCountry.length == 0) {
      getCountryList()
    }

    if (channelsList.length == 0) {
      getChannels()
    }
  }
  // 删除单个号码
  const singleDeleteEvent = async (send_id: any) => {
    await deleteHandlerItem({ send_id })
    await search()
  }
  // 删除全部
  const deleteAllEvent = async () => {
    await deleteAllHandlerItem({
      account: accountRef.current.account,
    })
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
      width={point ? '60vw' : '94vw'}>
      <div className='drawer-container' onClick={close}>
        <div
          className='drawer-content'
          onClick={(e) => e.stopPropagation()}
          ref={drawerref}
          style={{ height: size == 'middle' ? '60vh' : '70vh' }}>
          <header
            className={`drawer-header ${
              size == 'middle' ? 'fx-between-center' : 'xl'
            }`}>
            <div className={`${size == 'middle' ? 'fx-y-center' : 'xl'}`}>
              <div
                className={`${size == 'middle' ? 'fx-y-center' : 'xl'}`}
                style={{
                  marginRight: point ? '' : 90,
                  marginLeft: '10px',
                }}>
                <i className='icon iconfont icon-baojingguanli fn20 color'></i>
                <span className='fn20' style={{ marginLeft: '10px' }}>
                  {accountMail}
                </span>
                <Link
                  to={`/console/customer/accountinfo?sender=${accountMail}`}
                  style={{
                    marginLeft: point ? 30 : 0,
                    marginTop: point ? 0 : 14,
                    display: point ? '' : 'block',
                    fontSize: point ? '' : '16px',
                  }}>
                  查看Sublist配置
                </Link>
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
                        colorPrimary: '#0074d7',
                      },
                    }}>
                    <Button
                      type='primary'
                      size={size}
                      onClick={() => handleAddWarningPerson('0')}
                      htmlType='submit'
                      style={{
                        width: 110,
                        height: point ? '' : 32,
                        marginTop: point ? 0 : 10,
                        marginLeft: 0,
                      }}>
                      全部状态推送
                    </Button>
                  </ConfigProvider>
                </Form.Item>
                <Form.Item>
                  <ConfigProvider
                    theme={{
                      token: {
                        colorPrimary: '#0074d7',
                      },
                    }}>
                    <Button
                      type='primary'
                      size={size}
                      onClick={() => handleAddWarningPerson('1')}
                      htmlType='submit'
                      style={{
                        width: 110,
                        height: point ? '' : 32,
                        marginTop: point ? 0 : 10,
                        marginLeft: 0,
                      }}>
                      全部二次发送
                    </Button>
                  </ConfigProvider>
                </Form.Item>
                <Form.Item>
                  <ConfigProvider
                    theme={{
                      token: {
                        colorPrimary: '#ff4d4f',
                      },
                    }}>
                    <Popconfirm
                      placement='bottom'
                      title='警告'
                      description='确定删除全部吗？'
                      onConfirm={deleteAllEvent}
                      okText='确定'
                      cancelText='取消'>
                      <Button
                        className='btn delete'
                        type='primary'
                        style={{
                          width: 110,
                          height: point ? '' : 32,
                          marginLeft: 0,
                          marginTop: point ? '' : 10,
                        }}>
                        <i className='icon iconfont icon-shanchu'></i>
                        <span>全部删除</span>
                      </Button>
                    </Popconfirm>
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
            style={{ marginTop: point ? '' : 94 }}>
            <Table
              className='theme-cell bg-white reset-table'
              columns={columns}
              rowKey={'index'}
              dataSource={tableData}
              pagination={false}
              scroll={{ x: 'max-content' }}
              loading={loading}
            />
          </div>
        </div>
      </div>
      <FailTaskDo
        ref={addDialogRef}
        onSearch={search}
        allCountry={allCountry}
        channelsList={channelsList}
        appidList={allAppid}
        account={accountInfo}
      />
    </Drawer>
  )
}
export default forwardRef(Dialog)
