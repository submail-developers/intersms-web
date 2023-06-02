import {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  memo,
  useCallback,
} from 'react'
import { TableColumnsType, App } from 'antd'
import { Form, Input, Table, Button, Switch } from 'antd'
import { LockFilled, UnlockOutlined } from '@ant-design/icons'
import '@/style/drawerTable.scss'
import {
  updateChannelCountryNetworkPrice,
  updateChannelCountryNetworkStatus,
} from '@/api'
import { API } from 'apis'

interface DataType extends API.ChannelCountryConfigItem {}
interface EnbledProps {
  region_code: string
  checked: boolean
  disabled: boolean
  network_id: string
  channelId: string
  search: () => void
}

interface Props {
  channelId: string
  tabData: DataType[]
  search: () => void
}

let bgContry = {
  enabled: 0,
  network: 0,
  price_mke: 0,
  price_tra: 0,
  action: 0,
}

const Enbled = memo((enbledProps: EnbledProps) => {
  const [loading, setLoading] = useState(false)
  const checkEnbled = async () => {
    try {
      setLoading(true)
      await updateChannelCountryNetworkStatus({
        channel_id: enbledProps.channelId,
        region_code: enbledProps.region_code,
        network_id: enbledProps.network_id,
        status: enbledProps.checked ? '0' : '1',
        type: '2',
      })
      await enbledProps.search()
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  return (
    <Switch
      checked={enbledProps.checked}
      disabled={enbledProps.disabled}
      onChange={checkEnbled}
      loading={loading}
      size='small'
    />
  )
})

function MyTable(props: Props, ref: any) {
  const { message } = App.useApp()
  useImperativeHandle(ref, () => {
    return {
      cancel,
    }
  })
  const [editCountryId, seteditCountryId] = useState<string>('') // 当前编辑的国家ID
  const [editNetId, seteditNetId] = useState<string>('') // 当前编辑的运营商ID
  const [form] = Form.useForm()

  const changeLock = async (record: DataType) => {
    message.loading({
      content: '',
      duration: 0,
    })
    try {
      await updateChannelCountryNetworkStatus({
        channel_id: props.channelId,
        region_code: record.region_code,
        network_id: '0',
        status: record.country_enabled == '1' ? '0' : '1', // 0禁用1启用,
        type: '1', // 1操作国家  2操作运营商网络
      })
      message.destroy()
    } catch (error) {}
    await props.search()
    cancel()
  }

  const showEdit = (record: DataType, index: number = -1) => {
    seteditCountryId(record.id)
    if (index != -1) seteditNetId(record.network_list[index].id)
    form.setFieldsValue({
      country_price_tra: record.price_tra,
      country_price_mke: record.price_mke,
      price_tra: index == -1 ? '' : record.network_list[index].price_tra,
      price_mke: index == -1 ? '' : record.network_list[index].price_mke,
    })
  }
  // 编辑保存
  const save = async (record: DataType, index: number = -1) => {
    message.loading({
      content: '',
      duration: 0,
    })
    let value = await form.validateFields()
    try {
      let countryParams: API.UpdateChannelCountryNetworkPriceParams,
        netParams: API.UpdateChannelCountryNetworkPriceParams | null
      countryParams = {
        id: record.id,
        price_mke: value.country_price_mke,
        price_tra: value.country_price_tra,
      }
      if (index == -1) {
        netParams = null
      } else {
        netParams = {
          id: record.network_list[index].id,
          price_mke: value.price_mke,
          price_tra: value.price_tra,
        }
      }
      const list = [
        updateChannelCountryNetworkPrice(countryParams),
        netParams && updateChannelCountryNetworkPrice(netParams),
      ]
      await Promise.all(list)
      message.destroy()
    } catch (error) {}
    await props.search()
    seteditCountryId('')
    seteditNetId('')
  }
  const cancel = () => {
    seteditCountryId('')
    seteditNetId('')
  }

  bgContry = {
    enabled: 0, // 是否启用   1是  0否
    network: 0, // 运营商网络
    price_mke: 0, // 营销价格
    price_tra: 0, // 行业价格
    action: 0,
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
              {record.country_enabled != '1' ? (
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
      width: 150,
      render(_, record) {
        return <div className={`td-content fw500`}>{record.country_cn}</div>
      },
    },
    {
      title: '代码',
      width: 100,
      className: 'paddingL30',
      render(_, record) {
        return <div className={`td-content`}>{record.region_code}</div>
      },
    },
    {
      title: <div className='paddingL12'>行业价格</div>,
      width: 180,
      render(_, record) {
        return (
          <div className='td-content paddingR10'>
            {record.id == editCountryId ? (
              <Form.Item name='country_price_tra'>
                <Input type='number' step={0.00001} min={0} />
              </Form.Item>
            ) : (
              <div className='paddingL12'>{record.price_tra || '-'}</div>
            )}
          </div>
        )
      },
    },
    {
      title: <div className='paddingL12'>营销价格</div>,
      width: 180,
      render(_, record) {
        return (
          <div className='td-content paddingR10'>
            {record.id == editCountryId ? (
              <Form.Item name='country_price_mke'>
                <Input type='number' step={0.00001} min={0} />
              </Form.Item>
            ) : (
              <div className='paddingL12'>{record.price_mke || '-'}</div>
            )}
          </div>
        )
      },
    },
    {
      title: <div className='paddingL30'>运营商网络</div>,
      className: 'col-line',
      width: 240,
      render(_, record) {
        if (record.network_list.length > 0) {
          return (
            <div className='grid'>
              {record.network_list.map((item) => {
                let trClassName = ''
                if (bgContry.network % 2 != 0) {
                  trClassName = 'bg-gray'
                }
                bgContry.network += 1
                return (
                  <div
                    key={'name' + item.id}
                    className={`${trClassName} sub-td paddingL30`}>
                    {item.network_name || '-'}
                  </div>
                )
              })}
            </div>
          )
        } else {
          let trClassName = ''
          if (bgContry.network % 2 != 0) {
            trClassName = 'bg-gray'
          }
          bgContry.network += 1
          return <div className={`sub-td paddingL30 ${trClassName}`}>-</div>
        }
      },
    },
    {
      title: <div className='paddingL12'>行业价格</div>,
      width: 180,
      render(_, record) {
        if (record.network_list.length > 0) {
          return (
            <div className='grid'>
              {record.network_list.map((item) => {
                let trClassName = ''
                if (bgContry.price_tra % 2 != 0) {
                  trClassName = 'bg-gray'
                }
                bgContry.price_tra += 1
                return (
                  <div
                    key={'price_tra' + item.id}
                    className={`${trClassName} sub-td `}>
                    {item.id == editNetId ? (
                      <Form.Item name='price_tra'>
                        <Input type='number' step={0.00001} min={0} />
                      </Form.Item>
                    ) : (
                      <div className='paddingL12'>{item.price_tra || '-'}</div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        } else {
          let trClassName = ''
          if (bgContry.price_tra % 2 != 0) {
            trClassName = 'bg-gray'
          }
          bgContry.price_tra += 1
          return <div className={`sub-td paddingL12 ${trClassName}`}>-</div>
        }
      },
    },
    {
      title: <div className='paddingL12'>营销价格</div>,
      width: 180,
      render(_, record) {
        if (record.network_list.length > 0) {
          return (
            <div className='grid'>
              {record.network_list.map((item) => {
                let trClassName = ''
                if (bgContry.price_mke % 2 != 0) {
                  trClassName = 'bg-gray'
                }
                bgContry.price_mke += 1
                return (
                  <div
                    key={'price_mke' + item.id}
                    className={`${trClassName} sub-td `}>
                    {item.id == editNetId ? (
                      <Form.Item name='price_mke'>
                        <Input type='number' step={0.00001} min={0} />
                      </Form.Item>
                    ) : (
                      <div className='paddingL12'>{item.price_mke || '-'}</div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        } else {
          let trClassName = ''
          if (bgContry.price_mke % 2 != 0) {
            trClassName = 'bg-gray'
          }
          bgContry.price_mke += 1
          return <div className={`sub-td paddingL12 ${trClassName}`}>-</div>
        }
      },
    },
    {
      title: '状态',
      render(_, record) {
        if (record.network_list.length > 0) {
          return (
            <div className='grid'>
              {record.network_list.map((item) => {
                let trClassName = ''
                if (bgContry.enabled % 2 != 0) {
                  trClassName = 'bg-gray'
                }
                bgContry.enabled += 1
                return (
                  <div
                    key={'state' + item.id}
                    className={`${trClassName} sub-td`}>
                    <Enbled
                      region_code={record.region_code}
                      network_id={item.network_id}
                      checked={item.network_enabled == '1'}
                      disabled={
                        record.country_enabled != '1' || !item.network_id
                      }
                      channelId={props.channelId}
                      search={props.search}
                    />
                  </div>
                )
              })}
            </div>
          )
        } else {
          let trClassName = ''
          if (bgContry.enabled % 2 != 0) {
            trClassName = 'bg-gray'
          }
          bgContry.enabled += 1
          return <div className={`sub-td ${trClassName}`}>-</div>
        }
      },
    },
    {
      title: '操作',
      width: 120,
      render(_, record) {
        if (record.network_list.length > 0) {
          return (
            <div className='grid'>
              {record.network_list.map((item, index) => {
                let trClassName = ''
                if (bgContry.action % 2 != 0) {
                  trClassName = 'bg-gray'
                }
                bgContry.action += 1
                return (
                  <div
                    key={'action' + item.id}
                    className={`${trClassName} sub-td`}>
                    {record.id == editCountryId && item.id == editNetId ? (
                      <>
                        <Button
                          type='link'
                          style={{ paddingLeft: 0 }}
                          onClick={() => save(record, index)}>
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
                        onClick={() => showEdit(record, index)}>
                        编辑
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          )
        } else {
          let trClassName = ''
          if (bgContry.action % 2 != 0) {
            trClassName = 'bg-gray'
          }
          bgContry.action += 1
          return (
            <div key={'action' + record.id} className={`${trClassName} sub-td`}>
              {record.id == editCountryId ? (
                <>
                  <Button
                    type='link'
                    style={{ paddingLeft: 0 }}
                    onClick={() => save(record)}>
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
                  onClick={() => showEdit(record)}>
                  编辑
                </Button>
              )}
            </div>
          )
        }
      },
    },
  ]

  return (
    <Form component={false} form={form}>
      <Table
        className='drawer-table'
        columns={columns}
        dataSource={props.tabData}
        sticky
        pagination={false}
        rowKey={'id'}
        rowClassName={(record, index) => {
          return record.country_enabled == '0' ? 'lock-row' : ''
        }}
        scroll={{ x: 'max-content' }}
      />
    </Form>
  )
}
export default forwardRef(MyTable)
