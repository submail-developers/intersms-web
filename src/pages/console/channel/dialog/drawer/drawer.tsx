import {
  useState,
  useImperativeHandle,
  MutableRefObject,
  forwardRef,
  useRef,
  useEffect,
} from 'react'
import {
  Form,
  Input,
  ConfigProvider,
  Button,
  Drawer,
  App,
  Checkbox,
} from 'antd'
import TableCountry from './tableCountry/tableCountry'
import { useSize, usePoint } from '@/hooks'

import {
  getChannelCountryList,
  oneTouchChannelCountryNetworkStatus,
} from '@/api'
import { API } from 'apis'
import './drawer.scss'

interface Props {
  // onSearch: () => void
}

export type DrawerContentRectType = {
  x: number
  y: number
}

const Dialog = (props: Props, ref: any) => {
  const size = useSize()
  const point = usePoint('xl')
  const [form] = Form.useForm()
  const [channelId, setchannelId] = useState<string>('') // 通道ID
  const [channelName, setchannelName] = useState<string>('通道关联国家/地区') // 通道name
  const [tableData, setTableData] = useState<API.ChannelCountryConfigItem[]>([])
  const [loading, setloading] = useState(false)

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
    setchannelName(name)
    setShow(true)
    setchannelId(id)
  }
  const showTableLoading = () => {
    setloading(true)
  }

  useEffect(() => {
    if (channelId) {
      form.resetFields()
      search(true)
    }
  }, [channelId])

  const search = async (ifsetloading = false) => {
    try {
      ifsetloading && setloading(true)
      const formVal = await form.getFieldsValue()
      const res = await getChannelCountryList({
        channel: channelId,
        ...formVal,
      })
      let length = 0
      let _data = res.data.map((item) => {
        item.bg_start = (length % 2) as 0 | 1
        length += item.network_list.length > 1 ? item.network_list.length : 1
        return item
      })
      setTableData(_data)
      setloading(false)
      setIndeterminate(res.list_status == '2')
      setCheckAll(res.list_status == '1')
    } catch (error) {
      setloading(false)
    }
    tableref && tableref.current?.cancel()
  }

  const close = () => {
    setShow(false)
  }

  const [indeterminate, setIndeterminate] = useState(false)
  const [checkAll, setCheckAll] = useState(false)

  const onCheckAllChange = async () => {
    setloading(true)
    try {
      await oneTouchChannelCountryNetworkStatus({
        channel_id: channelId,
        status: checkAll ? '0' : '1',
      })
    } catch (error) {}
    await search()
  }

  const cleanSearch = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    search(true)
  }

  useEffect(() => {
    if (tableData.length > 0) {
      let _checkall = true,
        _nocheck = true
      tableData.forEach((item) => {
        if (item.country_enabled == '0') {
          _checkall = false
        } else {
          _nocheck = false
        }
        item.network_list.forEach((itm) => {
          if (itm.network_enabled == '0') {
            _checkall = false
          } else {
            _nocheck = false
          }
        })
      })
      if (_checkall) {
        setIndeterminate(false)
        setCheckAll(true)
      } else if (_nocheck) {
        setIndeterminate(false)
        setCheckAll(false)
      } else {
        setIndeterminate(true)
        setCheckAll(false)
      }
    } else {
      setIndeterminate(false)
      setCheckAll(false)
    }
  }, [tableData])

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
              {/* {point && ( */}
              <div
                className='fx-y-center'
                style={{
                  marginRight: point ? '' : 90,
                }}>
                <i className='icon iconfont icon-quanqiuguojia fn20 color'></i>
                <span className='fn20' style={{ marginLeft: '10px' }}>
                  {channelName}
                </span>
              </div>
              {/* )} */}
              <div
                className='switch-all'
                style={{ marginLeft: point ? 40 : 0 }}>
                <div className='fx-y-center'>
                  <Checkbox
                    indeterminate={indeterminate}
                    onClick={onCheckAllChange}
                    checked={checkAll}>
                    关联全部国家及其运营商
                  </Checkbox>
                </div>
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
                <Form.Item label='' name='keyword'>
                  <Input
                    allowClear
                    onChange={cleanSearch}
                    size={size}
                    placeholder='国家或地区名称/代码'
                    maxLength={20}
                    style={{ width: 162 }}></Input>
                </Form.Item>
                <Form.Item>
                  <ConfigProvider
                    theme={{
                      token: {
                        colorPrimary: '#ff4d4f',
                        colorPrimaryHover: '#ff4d4f',
                      },
                    }}>
                    <Button
                      onClick={() => search(true)}
                      type='primary'
                      size={size}
                      htmlType='submit'
                      style={{ width: point ? 110 : 64, marginLeft: 0 }}>
                      搜索
                    </Button>
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
            <TableCountry
              ref={tableref}
              search={search}
              showTableLoading={showTableLoading}
              tabData={tableData}
              channelId={channelId}
              loading={loading}
              drawerContentRect={drawerContentRect}
            />
          </div>
        </div>
      </div>
    </Drawer>
  )
}
export default forwardRef(Dialog)
