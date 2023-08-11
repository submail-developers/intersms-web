import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  MutableRefObject,
} from 'react'

import type { TableColumnsType } from 'antd'
import { Form, Input, Table, Button, Switch, Popconfirm } from 'antd'
import { LockFilled, UnlockOutlined } from '@ant-design/icons'
import '@/style/drawerTable.scss'
import {
  updateGroupCountryNetworkStatus,
  updateChannelsNetworkWeight,
} from '@/api'
import { API } from 'apis'
import { useAppSelector } from '@/store/hook'
import { channelsState } from '@/store/reducers/channels'
import { usePoint } from '@/hooks'
import BatchSetDialog from '../../batchSetDialog'

interface DataType extends API.GroupRelatedDataItem {}

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

// Switch组件
const Enbled = (enbledProps: EnbledProps) => {
  const channlesStore = useAppSelector(channelsState)
  const [loading, setLoading] = useState(false)
  const checkEnbled = async () => {
    setLoading(true)
    await updateGroupCountryNetworkStatus({
      group_id: channlesStore.activeChannels?.id || '',
      channel_id: enbledProps.channelId,
      region_code: enbledProps.region_code,
      network_id: enbledProps.network_id,
      status: enbledProps.checked ? '0' : '1', // 0禁用1启用,
      type: '2', // 1操作国家  2操作运营商网络
    })
    await enbledProps.search()
    setLoading(false)
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
  const channlesStore = useAppSelector(channelsState)
  const [editNetworkId, seteditNetworkId] = useState<string>('') // 当前运营商权重的ID
  const [editCountryId, seteditCountryId] = useState<React.Key>('') // 编辑国家权重的ID
  const [form] = Form.useForm()

  const batchSetDialogRef: MutableRefObject<any> = useRef(null)
  // 展示新增弹框

  const showAddDialog = () => {
    batchSetDialogRef.current.open(1)
  }
  const showOperatorDialog = () => {
    batchSetDialogRef.current.open(2)
  }

  // 修改国家状态
  const changeLock = async (record: DataType) => {
    props.showTableLoading()
    try {
      await updateGroupCountryNetworkStatus({
        group_id: channlesStore.activeChannels?.id || '',
        channel_id: props.channelId,
        region_code: record.region_code,
        network_id: record.network_id,
        status: record.country_enabled == '1' ? '0' : '1', // 0禁用1启用,
        type: '1', // 1操作国家  2操作运营商网络
      })
    } catch (error) {}
    await props.search()
  }
  // 编辑
  const showEdit = (record: DataType, index: number = -1) => {
    seteditCountryId(record.id)
    if (index != -1) seteditNetworkId(record.network_list[index].id)
    form.setFieldsValue({
      country_weight: record.weight,
      network_weight: index == -1 ? '' : record.network_list[index].weight,
    })
  }
  // 编辑保存
  const save = async (record: DataType, index: number = -1) => {
    props.showTableLoading()
    let value = await form.validateFields()
    try {
      let countryParams: API.UpdateChannelsCountryNetworkParams,
        netParams: API.UpdateChannelsCountryNetworkParams | null
      countryParams = {
        group_id: channlesStore.activeChannels?.id || '',
        channel_id: props.channelId,
        region_code: record.region_code,
        network_id: record.network_id,
        weight: value.country_weight,
      }
      if (index == -1) {
        netParams = null
      } else {
        netParams = {
          group_id: channlesStore.activeChannels?.id || '',
          channel_id: props.channelId,
          region_code: record.region_code,
          network_id: record.network_list[index].network_id,
          weight: value.network_weight,
        }
      }
      const list = [
        updateChannelsNetworkWeight(countryParams),
        netParams && updateChannelsNetworkWeight(netParams),
      ]
      // 保存权重
      await Promise.all(list)
    } catch (error) {}
    await props.search()
  }
  // 取消编辑
  const cancel = () => {
    seteditNetworkId('')
    seteditCountryId('')
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
      width: point ? 130 : 110,
      fixed: true,
      ellipsis: true,
      render(_, record) {
        return <div className='td-content fw500'>{record.country_cn}</div>
      },
    },
    {
      title: '代码',
      width: 80,
      className: 'paddingL30',
      render(_, record) {
        return <div className='td-content'>{record.region_code}</div>
      },
    },
    {
      title: <div className='paddingL12'>国家/地区权重</div>,
      width: 80,
      render(_, record) {
        return record.id == editCountryId ? (
          <div className='td-content sub-td'>
            <Form.Item name='country_weight'>
              <Input type='number' min={1} max={99} />
            </Form.Item>
          </div>
        ) : (
          <div className='td-content paddingL12'>{record.weight}</div>
        )
      },
    },
    {
      title: (
        <Popconfirm
          placement='bottom'
          title='警告'
          description='确定批量设置吗？'
          onConfirm={showAddDialog}
          okText='确定'
          cancelText='取消'>
          <Button type='link' style={{ padding: 0 }}>
            批量设置
          </Button>
        </Popconfirm>
      ),
      width: 110,
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
      title: <div className='paddingL12'>运营商权重</div>,
      width: 70,
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
                    key={'network_weight' + item.id}
                    className={`${trClassName} sub-td `}>
                    {item.id == editNetworkId ? (
                      <Form.Item name='network_weight'>
                        <Input type='number' min={1} max={99} />
                      </Form.Item>
                    ) : (
                      <div className='paddingL12'>{item.weight || '-'}</div>
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
      title: (
        <Popconfirm
          placement='bottom'
          title='警告'
          description='确定批量设置吗？'
          onConfirm={showOperatorDialog}
          okText='确定'
          cancelText='取消'>
          <Button type='link' style={{ padding: 0 }}>
            批量设置
          </Button>
        </Popconfirm>
      ),
      width: 110,
    },
    {
      title: <div className='paddingL12'>状态</div>,
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
                    key={'status' + item.id}
                    className={`${trClassName} sub-td paddingL12`}>
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
          return <div className={`${trClassName} sub-td paddingL12`}>-</div>
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
                    key={'active' + item.id}
                    className={`${trClassName} sub-td`}>
                    {record.id == editCountryId && item.id == editNetworkId ? (
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
            <div className={`${trClassName} sub-td`}>
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
        loading={props.loading}
      />
      <BatchSetDialog
        ref={batchSetDialogRef}
        channelId={props.channelId}
        onSearch={props.search}
      />
    </Form>
  )
}
export default forwardRef(MyTable)
