import {
  useState,
  useImperativeHandle,
  MutableRefObject,
  forwardRef,
  useRef,
  useEffect,
} from 'react'
import { Form, Input, ConfigProvider, Button, Drawer } from 'antd'
import MyTable from './table/table'
import { groupBy } from '@/utils'
import { useSize } from '@/hooks'

import { getChannelCountryList } from '@/api'
import { API } from 'apis'

import './drawer.scss'

interface Props {
  // onSearch: () => void
}

const Dialog = (props: Props, ref: any) => {
  const size = useSize()
  const [form] = Form.useForm()
  const [channelId, setchannelId] = useState<string>('') // 通道ID
  const [tableData, setTableData] = useState<API.ChannelCountryConfigItem[][]>(
    [],
  )

  const tableref: MutableRefObject<any> = useRef(null)
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const [show, setShow] = useState(false)

  const open = async (id: string) => {
    setchannelId(id)
    tableref && tableref.current?.cancel()
    setShow(true)
  }

  useEffect(() => {
    if (channelId) {
      search()
    }
  }, [channelId])

  const search = async () => {
    const res = await getChannelCountryList({ channel: channelId })
    const groupData = Object.values(
      groupBy(res.data, 'region_code'),
    ) as API.ChannelCountryConfigItem[][]
    setTableData(groupData)
  }

  const close = () => {
    setShow(false)
  }

  return (
    <Drawer
      title=''
      placement='right'
      onClose={close}
      closable={false}
      open={show}
      bodyStyle={{ backgroundColor: 'transparent' }}
      rootClassName='drawer'
      width={'70vw'}>
      <div className='drawer-container' onClick={close}>
        <div className='drawer-content' onClick={(e) => e.stopPropagation()}>
          <header className='drawer-header fx-between-center'>
            <div className='fx-y-center'>
              <i className='icon iconfont icon-quanqiuguojia fn20 color'></i>
              <span className='fn20' style={{ marginLeft: '10px' }}>
                通道关联国家/地区
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
            <MyTable ref={tableref} search={search} tableData={tableData} />
          </div>
        </div>
      </div>
    </Drawer>
  )
}
export default forwardRef(Dialog)
