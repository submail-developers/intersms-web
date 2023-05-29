import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react'

import type { TableColumnsType } from 'antd'
import { Form, Input, Table, ConfigProvider, Button, Switch } from 'antd'
import { LockFilled, UnlockOutlined } from '@ant-design/icons'
// import './tableCountry.scss'
import '@/style/drawerTable.scss'
import {
  updateChannelCountryNetworkStatus,
  updateChannelsNetworkWeight,
} from '@/api'
import { API } from 'apis'
import { useAppSelector } from '@/store/hook'
import { channelsState } from '@/store/reducers/channels'

interface Item extends API.ChannelsChannelNetworkItem {}
interface DataType {
  id: React.Key
  child: Item[]
}
interface EnbledProps {
  enabled: '0' | '1'
  id: string
}

interface Props {
  channelId: string
  tabData: Item[][]
  search: () => void
}

let bgContry = {
  enabled: 0,
  network: 0,
  price_tra: 0,
  action: 0,
}

function MyTable(props: Props, ref: any) {
  useImperativeHandle(ref, () => {
    return {
      cancel,
    }
  })
  const channlesStore = useAppSelector(channelsState)
  const [editNetworkId, seteditNetworkId] = useState<string>('') // 当前运营商权重的ID
  const [editCountryId, seteditCountryId] = useState<React.Key>('') // 编辑国家权重的ID
  const [tableData, settableData] = useState<DataType[]>([])
  const [form] = Form.useForm()

  useEffect(() => {
    initBgContry()
    let _data: DataType[] = []
    props.tabData.forEach((item) => {
      _data.push({
        id: item[0].network_id,
        child: item,
      })
    })
    settableData(_data)
    return () => {
      settableData([])
    }
  }, [props.tabData])

  const changeLock = (data: DataType) => {
    console.log(data)
    // await props.search()
    cancel()
    initBgContry()
  }

  const showEdit = (id: React.Key, item?: Item) => {
    seteditCountryId(id)
    seteditNetworkId(item?.network_id || '')
    form.setFieldsValue({
      network_weight: item?.network_weight,
      country_weight: '10',
    })
    initBgContry()
  }
  // 编辑保存
  const save = async (item: Item) => {
    let value = await form.validateFields()
    console.log(value)
    // 保存运营商权重
    await updateChannelsNetworkWeight({
      group_id: channlesStore.activeChannels?.id || '',
      channel_id: props.channelId,
      region_code: item.region_code,
      network_id: item.network_id,
      weight: value.network_weight,
    })
    await props.search()
    seteditNetworkId('')
    seteditCountryId('')
    initBgContry()
  }
  const cancel = () => {
    seteditNetworkId('')
    seteditCountryId('')
    initBgContry()
  }

  const Enbled = (enbledProps: EnbledProps) => {
    const [loading, setLoading] = useState(false)
    const checkEnbled = async () => {
      setLoading(true)
      await updateChannelCountryNetworkStatus({
        id: enbledProps.id,
        enabled: enbledProps.enabled == '0' ? '1' : '0',
      })
      await props.search()
      setLoading(false)
      initBgContry()
    }
    return (
      <Switch
        checked={enbledProps.enabled == '1'}
        onChange={checkEnbled}
        loading={loading}
        size='small'
      />
    )
  }

  const initBgContry = () => {
    bgContry = {
      enabled: 0, // 是否启用   1是  0否
      network: 0, // 运营商网络
      price_tra: 0, // 行业价格
      action: 0,
    }
  }

  const columns: TableColumnsType<DataType> = [
    {
      title: <div></div>,
      width: 100,
      className: 'paddingL30',
      render(_, record) {
        return (
          <div className='td-content'>
            <div onClick={() => changeLock(record)} className='lock'>
              {Math.random() > 0.5 ? (
                <LockFilled className='color-gray fn16' />
              ) : (
                <UnlockOutlined className='color fn16' />
              )}
            </div>
          </div>
        )
      },
    },
    {
      title: '国家/地区名称',
      width: 200,
      ellipsis: true,
      render(_, record) {
        return (
          <div className={`td-content fw500`}>{record.child[0].country_cn}</div>
        )
      },
    },
    {
      title: '国家/地区代码',
      className: 'paddingL30',
      render(_, record) {
        return <div className={`td-content`}>{record.child[0].region_code}</div>
      },
    },
    {
      title: <div className='paddingL12'>国家/地区权重</div>,
      width: 200,
      render(_, record) {
        return record.id == editCountryId ? (
          <div className='td-content sub-td'>
            <Form.Item name='country_weight'>
              <Input type='number' />
            </Form.Item>
          </div>
        ) : (
          <div className='td-content paddingL12'>{10}</div>
        )
      },
    },
    {
      title: <div className='paddingL30'>运营商网络类型</div>,
      className: 'col-line',
      render(_, record) {
        return (
          <div className='grid'>
            {record.child.map((item) => {
              let trClassName = ''
              if (bgContry.network % 2 != 0) {
                trClassName = 'bg-gray'
              }
              bgContry.network += 1
              return (
                <div
                  key={item.network_id}
                  className={`${trClassName} sub-td paddingL30`}>
                  {item.network_name}
                </div>
              )
            })}
          </div>
        )
      },
    },
    {
      title: <div className='paddingL12'>运营商权重</div>,
      width: 200,
      render(_, record) {
        return (
          <div className='grid'>
            {record.child.map((item) => {
              let trClassName = ''
              if (bgContry.price_tra % 2 != 0) {
                trClassName = 'bg-gray'
              }
              bgContry.price_tra += 1
              return (
                <div key={item.network_id} className={`${trClassName} sub-td `}>
                  {item.network_id == editNetworkId ? (
                    <Form.Item name='network_weight'>
                      <Input type='number' />
                    </Form.Item>
                  ) : (
                    <div className='paddingL12'>{item.network_weight}</div>
                  )}
                </div>
              )
            })}
          </div>
        )
      },
    },
    {
      title: '状态',
      render(_, record) {
        return (
          <div className='grid'>
            {record.child.map((item) => {
              let trClassName = ''
              if (bgContry.enabled % 2 != 0) {
                trClassName = 'bg-gray'
              }
              bgContry.enabled += 1
              return (
                <div key={item.network_id} className={`${trClassName} sub-td`}>
                  <Enbled id={item.network_id} enabled={item.enabled} />
                </div>
              )
            })}
          </div>
        )
      },
    },
    {
      title: '操作',
      width: 160,
      render(_, record) {
        return (
          <div className='grid'>
            {record.child.map((item) => {
              let trClassName = ''
              if (bgContry.action % 2 != 0) {
                trClassName = 'bg-gray'
              }
              bgContry.action += 1
              return (
                <div key={item.network_id} className={`${trClassName} sub-td`}>
                  {item.network_id == editNetworkId ? (
                    <>
                      <Button
                        type='link'
                        style={{ paddingLeft: 0 }}
                        onClick={() => save(item)}>
                        保存
                      </Button>
                      <Button type='link' onClick={cancel}>
                        取消
                      </Button>
                    </>
                  ) : (
                    <Button
                      type='link'
                      style={{ paddingLeft: 0 }}
                      onClick={() => showEdit(record.id, item)}>
                      编辑
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        )
      },
    },
  ]

  return (
    <Form component={false} form={form}>
      <ConfigProvider
        theme={{
          token: {
            colorBgContainer: 'transparent',
          },
        }}>
        <Table
          className='drawer-table'
          columns={columns}
          dataSource={tableData}
          sticky
          pagination={false}
          rowKey={'id'}
          rowClassName={(record, index) => {
            return index % 2 == 1 ? 'lock-row' : ''
          }}
          scroll={{ x: 'max-content' }}
        />
      </ConfigProvider>
    </Form>
  )
}
export default forwardRef(MyTable)
