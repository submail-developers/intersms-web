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
import EditDetail from './editDetail/editDetail'
import type { ColumnsType } from 'antd/es/table'
import { groupBy } from '@/utils'
import { useSize } from '@/hooks'
import { useAppSelector } from '@/store/hook'
import { channelsState } from '@/store/reducers/channels'

import { getChannelGroupRelatedData } from '@/api'
import { API } from 'apis'

import './accessCountry.scss'
interface DataType extends API.GetChannelGroupRelatedDataItem {}

interface Props {
  onUpdate: () => void
}
interface DataType extends API.GetChannelGroupRelatedDataItem {}

const Dialog = (props: Props, ref: any) => {
  const channlesStore = useAppSelector(channelsState)
  const size = useSize()
  const [form] = Form.useForm()
  const [channelId, setchannelId] = useState<string>('') // 通道ID
  const [tableData, setTableData] = useState<API.ChannelCountryConfigItem[][]>(
    [],
  )

  const tableref: MutableRefObject<any> = useRef(null)
  const editDetailRef: MutableRefObject<any> = useRef(null)
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const [show, setShow] = useState(false)

  const open = async (record: DataType) => {
    setchannelId(record.channel_id)
    tableref && tableref.current?.cancel()
    setShow(true)
  }

  useEffect(() => {
    if (channelId) {
      search()
    }
  }, [channelId])

  const search = async () => {
    try {
      const res = await getChannelGroupRelatedData({
        group_id: channlesStore.activeChannels?.id || '',
        channel_id: channelId,
        keyword: '',
      })
      const network_list = res.data[0].network_list
      const groupData = Object.values(
        groupBy(network_list, 'region_code'),
      ) as API.ChannelCountryConfigItem[][]
      setTableData(groupData)
    } catch (error) {}
  }

  const close = () => {
    setShow(false)
  }

  const editEvent = () => {
    let checkedCountry: string[] = []
    tableData.forEach((item) => {
      checkedCountry.push(item[0].region_code)
    })
    console.log(checkedCountry, '1')
    tableref && tableref.current?.cancel()
    editDetailRef.current.open(checkedCountry)
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
      <EditDetail search={search} channelId={channelId} ref={editDetailRef} />
    </Drawer>
  )
}
export default forwardRef(Dialog)
