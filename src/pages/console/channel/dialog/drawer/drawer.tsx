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

const Dialog = (props: Props, ref: any) => {
  const { message } = App.useApp()
  const size = useSize()
  const point = usePoint('xl')
  const [form] = Form.useForm()
  const [channelId, setchannelId] = useState<string>('') // 通道ID
  const [tableData, setTableData] = useState<API.ChannelCountryConfigItem[]>([])
  const [loading, setloading] = useState(false)

  const tableref: MutableRefObject<any> = useRef(null)
  const timer = useRef(null)
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const [show, setShow] = useState(false)

  const open = async (id: string) => {
    setShow(true)
    setchannelId(id)
  }

  useEffect(() => {
    if (channelId) {
      form.resetFields()
      search()
    }
  }, [channelId])

  const search = async () => {
    try {
      setloading(true)
      tableref && tableref.current?.cancel()
      const formVal = await form.getFieldsValue()
      const res = await getChannelCountryList({
        channel: channelId,
        ...formVal,
      })
      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        setTableData(res.data)
        setloading(false)
        clearTimeout(timer.current)
      }, 20)
      setIndeterminate(res.list_status == '2')
      setCheckAll(res.list_status == '1')
    } catch (error) {
      setloading(false)
    }
  }

  const close = () => {
    setShow(false)
  }

  const [indeterminate, setIndeterminate] = useState(false)
  const [checkAll, setCheckAll] = useState(false)

  const onCheckAllChange = async () => {
    tableref && tableref.current?.cancel()
    message.loading({
      content: '',
      duration: 0,
    })
    try {
      await oneTouchChannelCountryNetworkStatus({
        channel_id: channelId,
        status: checkAll ? '0' : '1',
      })
      message.destroy()
    } catch (error) {}
    await search()
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
      bodyStyle={{ backgroundColor: 'transparent' }}
      rootClassName='drawer channel-drawer'
      width={point ? '70vw' : '90vw'}>
      <div className='drawer-container' onClick={close}>
        <div
          className='drawer-content'
          onClick={(e) => e.stopPropagation()}
          style={{ height: size == 'middle' ? '70vh' : '100vh' }}>
          <header
            className={`drawer-header ${
              size == 'middle' ? 'fx-between-center' : 'xl'
            }`}>
            <div className='fx-y-center'>
              {point && (
                <div className='fx-y-center'>
                  <i className='icon iconfont icon-quanqiuguojia fn20 color'></i>
                  <span className='fn20' style={{ marginLeft: '10px' }}>
                    通道关联国家/地区
                  </span>
                </div>
              )}
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
                      onClick={search}
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
          <div className='drawer-table-wrap'>
            <TableCountry
              ref={tableref}
              search={search}
              tabData={tableData}
              channelId={channelId}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </Drawer>
  )
}
export default forwardRef(Dialog)
