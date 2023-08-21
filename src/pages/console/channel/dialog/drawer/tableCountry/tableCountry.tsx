import { useState, forwardRef, useImperativeHandle } from 'react'
import { TableColumnsType } from 'antd'
import { Form, Input, Table, Button, Switch } from 'antd'
import { LockFilled, UnlockOutlined } from '@ant-design/icons'
import '@/style/drawerTable.scss'
import {
  updateChannelCountryNetworkPrice,
  updateChannelCountryNetworkStatus,
} from '@/api'
import { API } from 'apis'
import { usePoint } from '@/hooks'

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
  loading: boolean
  channelId: string
  tabData: DataType[]
  search: () => void
  showTableLoading: () => void
}

const Enbled = (enbledProps: EnbledProps) => {
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
}

function MyTable(props: Props, ref: any) {
  const point = usePoint('xl')
  useImperativeHandle(ref, () => {
    return {
      cancel,
    }
  })
  const [editCountryId, seteditCountryId] = useState<string>('') // 当前编辑的国家ID
  const [editNetId, seteditNetId] = useState<string>('') // 当前编辑的运营商ID
  const [form] = Form.useForm()

  const changeLock = async (record: DataType) => {
    props.showTableLoading()
    try {
      await updateChannelCountryNetworkStatus({
        channel_id: props.channelId,
        region_code: record.region_code,
        network_id: '0',
        status: record.country_enabled == '1' ? '0' : '1', // 0禁用1启用,
        type: '1', // 1操作国家  2操作运营商网络
      })
    } catch (error) {}
    await props.search()
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
    props.showTableLoading()
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
    } catch (error) {}
    await props.search()
  }
  const cancel = () => {
    seteditCountryId('')
    seteditNetId('')
  }

  const columns: TableColumnsType<DataType> = [
    {
      title: <div></div>,
      width: point ? 60 : 32,
      fixed: true,
      render(_, record) {
        return (
          <div className='td-content'>
            <div onClick={() => changeLock(record)} className='lock'>
              {record.country_enabled != '1' ? (
                <LockFilled className='color-gray fn16' rev={undefined} />
              ) : (
                <UnlockOutlined className='color fn16' rev={undefined} />
              )}
            </div>
          </div>
        )
      },
    },
    {
      title: '国家/地区名称',
      className: 'paddingL10',
      fixed: true,
      width: point ? 130 : 110,
      render(_, record) {
        return <div className={`td-content fw500`}>{record.country_cn}</div>
      },
    },
    {
      title: '代码',
      width: 80,
      className: 'paddingL30',
      render(_, record) {
        return <div className={`td-content`}>{record.region_code}</div>
      },
    },
    {
      title: <div className='paddingL12'>行业成本</div>,
      width: 110,
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
      title: <div className='paddingL12'>营销成本</div>,
      width: 110,
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
      width: 120,
      render(_, record) {
        if (record.network_list.length > 0) {
          return (
            <div className='grid'>
              {record.network_list.map((item, index) => {
                let trClassName = ''
                if ((index + record.bg_start) % 2 == 1) {
                  trClassName = 'bg-gray'
                }
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
          let trClassName = record.bg_start == 0 ? '' : 'bg-gray'
          return <div className={`sub-td paddingL30 ${trClassName}`}>-</div>
        }
      },
    },
    {
      title: <div className='paddingL12'>行业成本</div>,
      width: 110,
      render(_, record) {
        if (record.network_list.length > 0) {
          return (
            <div className='grid'>
              {record.network_list.map((item, index) => {
                let trClassName = ''
                if ((index + record.bg_start) % 2 == 1) {
                  trClassName = 'bg-gray'
                }
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
          let trClassName = record.bg_start == 0 ? '' : 'bg-gray'
          return <div className={`sub-td paddingL12 ${trClassName}`}>-</div>
        }
      },
    },
    {
      title: <div className='paddingL12'>营销成本</div>,
      width: 110,
      render(_, record) {
        if (record.network_list.length > 0) {
          return (
            <div className='grid'>
              {record.network_list.map((item, index) => {
                let trClassName = ''
                if ((index + record.bg_start) % 2 == 1) {
                  trClassName = 'bg-gray'
                }
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
          let trClassName = record.bg_start == 0 ? '' : 'bg-gray'
          return <div className={`sub-td paddingL12 ${trClassName}`}>-</div>
        }
      },
    },
    {
      title: '状态',
      width: 60,
      render(_, record) {
        if (record.network_list.length > 0) {
          return (
            <div className='grid'>
              {record.network_list.map((item, index) => {
                let trClassName = ''
                if ((index + record.bg_start) % 2 == 1) {
                  trClassName = 'bg-gray'
                }
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
          let trClassName = record.bg_start == 0 ? '' : 'bg-gray'
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
                if ((index + record.bg_start) % 2 == 1) {
                  trClassName = 'bg-gray'
                }
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
          let trClassName = record.bg_start == 0 ? '' : 'bg-gray'
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
        loading={props.loading}
        scroll={{ x: 'max-content' }}
      />
    </Form>
  )
}
export default forwardRef(MyTable)
