import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react'
import type { TableColumnsType } from 'antd'
import { Form, Input, Table, ConfigProvider, Button, Switch } from 'antd'
import { LockFilled, UnlockOutlined } from '@ant-design/icons'
import './tableCountry.scss'
import {
  updateChannelCountryNetworkPrice,
  updateChannelCountryNetworkStatus,
} from '@/api'
import { API } from 'apis'

interface Item extends API.ChannelCountryConfigItem {}
interface DataType {
  id: React.Key
  child: Item[]
}
interface EnbledProps {
  checked: boolean
  disabled: boolean
  id: string
}

interface Props {
  tabData: Item[][]
  search: () => void
}

let bgContry = {
  enabled: 0,
  network: 0,
  price_mke: 0,
  price_tra: 0,
  action: 0,
}

function MyTable(props: Props, ref: any) {
  useImperativeHandle(ref, () => {
    return {
      cancel,
    }
  })
  const [editId, seteditId] = useState<string>('') // 当前编辑的ID
  const [tableData, settableData] = useState<DataType[]>([])
  const [form] = Form.useForm()

  useEffect(() => {
    initBgContry()
    let _data: DataType[] = []
    props.tabData.forEach((item) => {
      _data.push({
        id: item[0].id,
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

  const showEdit = (record: Item) => {
    seteditId(record.id)
    form.setFieldsValue({
      price_tra: record.price_tra,
      price_mke: record.price_mke,
    })
    initBgContry()
  }
  // 编辑保存
  const save = async (record: Item) => {
    let value = await form.validateFields()
    await updateChannelCountryNetworkPrice({ ...value, id: record.id })
    await props.search()
    seteditId('')
    initBgContry()
  }
  const cancel = () => {
    seteditId('')
    initBgContry()
  }

  const Enbled = (enbledProps: EnbledProps) => {
    const [loading, setLoading] = useState(false)
    const checkEnbled = async () => {
      setLoading(true)
      await updateChannelCountryNetworkStatus({
        id: enbledProps.id,
        enabled: enbledProps.checked ? '0' : '1',
      })
      await props.search()
      setLoading(false)
      initBgContry()
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

  const initBgContry = () => {
    bgContry = {
      enabled: 0, // 是否启用   1是  0否
      network: 0, // 运营商网络
      price_mke: 0, // 营销价格
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
      render(_, record) {
        return (
          <div className={`td-content fw500`}>{record.child[0].country_cn}</div>
        )
      },
    },
    {
      title: '国家/地区代码',
      className: 'paddingL50',
      render(_, record) {
        return <div className={`td-content`}>{record.child[0].region_code}</div>
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
                  key={item.id}
                  className={`${trClassName} sub-td paddingL30`}>
                  {item.name || '-'}
                </div>
              )
            })}
          </div>
        )
      },
    },
    {
      title: <div className='paddingL12'>行业价格</div>,
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
                <div key={item.id} className={`${trClassName} sub-td `}>
                  {item.id == editId ? (
                    <Form.Item name='price_tra'>
                      <Input type='number' step={0.00001} min={0} />
                    </Form.Item>
                  ) : (
                    <div className='paddingL12'>{item.price_tra}</div>
                  )}
                </div>
              )
            })}
          </div>
        )
      },
    },
    {
      title: <div className='paddingL12'>营销价格</div>,
      width: 200,
      render(_, record) {
        return (
          <div className='grid'>
            {record.child.map((item) => {
              let trClassName = ''
              if (bgContry.price_mke % 2 != 0) {
                trClassName = 'bg-gray'
              }
              bgContry.price_mke += 1
              return (
                <div key={item.id} className={`${trClassName} sub-td `}>
                  {item.id == editId ? (
                    <Form.Item name='price_mke'>
                      <Input type='number' step={0.00001} min={0} />
                    </Form.Item>
                  ) : (
                    <div className='paddingL12'>{item.price_mke}</div>
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
                <div key={item.id} className={`${trClassName} sub-td`}>
                  <Enbled
                    id={item.id}
                    checked={item.network_related_flg == '1'}
                    disabled={item.country_related_flg != '1' || !item.network}
                  />
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
                <div key={item.id} className={`${trClassName} sub-td`}>
                  {item.id == editId ? (
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
                      onClick={() => showEdit(item)}>
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
          className='theme-cell-reset bg-white'
          columns={columns}
          dataSource={tableData}
          sticky
          pagination={false}
          rowKey={'id'}
          rowClassName={(record, index) => {
            return record.child[0].country_related_flg == '0' ? 'lock-text' : ''
          }}
          scroll={{ x: 'max-content' }}
        />
      </ConfigProvider>
    </Form>
  )
}
export default forwardRef(MyTable)
