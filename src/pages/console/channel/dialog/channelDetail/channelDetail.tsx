import {
  useState,
  useImperativeHandle,
  MutableRefObject,
  forwardRef,
  useRef,
} from 'react'
import { Form, Input, ConfigProvider, Button, Drawer } from 'antd'
import MyTable from '../table/table'
import EditDetail from '../editDetail/editDetail'
import type { ColumnsType } from 'antd/es/table'
import { useSize } from '@/hooks'
import './channelDetail.scss'

interface Props {
  // onSearch: () => void
}
interface DataType {
  key: string
  name: string
  name_code: string
  type: string
  price1: string
  price2: string
}
const Dialog = (props: Props, ref: any) => {
  const size = useSize()
  const [form] = Form.useForm()

  const tableref: MutableRefObject<any> = useRef(null)
  const editDetailRef: MutableRefObject<any> = useRef(null)
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
      rootClassName='drawer'
      width={'70vw'}>
      <div className='drawer-container' onClick={close}>
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
                    placeholder='通道名称'
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
            <MyTable />
          </div>
          <footer className='drawer-footer'>
            <div className='btn-group'>
              <div className='btn' onClick={editEvent}>
                <i className='icon iconfont icon-xinzeng'></i>
                <span>编辑</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
      <EditDetail ref={editDetailRef} />
    </Drawer>
  )
}
export default forwardRef(Dialog)
