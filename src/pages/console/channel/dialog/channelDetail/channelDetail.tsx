import {
  useState,
  useImperativeHandle,
  MutableRefObject,
  forwardRef,
  useRef,
} from 'react'
import {
  Modal,
  Form,
  Input,
  App,
  Row,
  Col,
  ConfigProvider,
  Button,
  Drawer,
  Table,
} from 'antd'
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

  // In the fifth row, other columns are merged into first column
  // by setting it's colSpan to be 0
  const sharedOnCell = (_: DataType, index: number) => {
    if (index === 1) {
      return { colSpan: 0 }
    }

    return {}
  }

  const columns: ColumnsType<DataType> = [
    {
      title: '国家名称',
      dataIndex: 'name',
      onCell: (_, index) => ({
        // colSpan: index === 1 ? 5 : 1,
        rowSpan: 2,
      }),
    },
    {
      title: '国家代码',
      dataIndex: 'name_code',
      onCell: (_, index) => ({
        // colSpan: index === 1 ? 5 : 1,
        rowSpan: 0,
      }),
    },
    {
      title: '运营商网络类型',
      dataIndex: 'type',
    },
    {
      title: '行业价格',
      dataIndex: 'price1',
    },
    {
      title: '营销价格',
      dataIndex: 'price2',
    },
    {
      title: '操作',
      render: (_, record) => (
        <Button style={{ padding: '0' }} type='link'>
          删除
        </Button>
      ),
    },
  ]

  const data: DataType[] = [
    {
      key: '1',
      name: '中国',
      name_code: 'CN',
      type: '中国移动',
      price1: '0.05000',
      price2: '0.050001',
    },
    {
      key: '2',
      name: '中国',
      name_code: 'CN',
      type: '中国联通',
      price1: '0.05000',
      price2: '0.050001',
    },
    {
      key: '3',
      name: '中国',
      name_code: 'CN',
      type: '中国电信',
      price1: '0.05000',
      price2: '0.050001',
    },
    {
      key: '4',
      name: '美国',
      name_code: 'UN',
      type: '美国移动',
      price1: '0.05000',
      price2: '0.050001',
    },
    {
      key: '4',
      name: '美国',
      name_code: 'UN',
      type: '美国联通',
      price1: '0.05000',
      price2: '0.050001',
    },
  ]

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
      // style={}
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
