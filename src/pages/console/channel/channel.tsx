import { useEffect, useState, MutableRefObject, useRef } from 'react'
import { Button, Table, Row, Col, Popconfirm, App, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import AddChannel from './dialog/addChannel'
import MyDrawer from './dialog/drawer/drawer'
import BindSensitiveWordDialog from './dialog/bindSensitiveWordDialog/bindSensitiveWordDialog'
import BindBlackDialog from './dialog/bindBlackDialog/bindBlackDialog'
import MenuTitle from '@/components/menuTitle/menuTitle'
import { getChannelList, deleteChannel, channelUpdateListener } from '@/api'
import { useSize } from '@/hooks'
import { API } from 'apis'
import {
  mobileTypeOptions,
  getOptionsLabel,
  channelTypeOptions,
} from '@/utils/options'
import { LoadingOutlined } from '@ant-design/icons'

import './channel.scss'

interface DataType extends API.ChannelItem {}
type ConfigItemProps = {
  record: DataType
  type: '0' | '1' | '2' | '3' // 0添加配置1建立连接2删除连接3还原配置
  initData: () => void
}
enum Titles {
  '添加配置',
  '建立连接',
  '断开连接',
  '还原配置',
}

enum Icons {
  'peizhi',
  'lianjie',
  'duanlian',
  'huanyuan',
}
const ConfigItem = (props: ConfigItemProps) => {
  const [loading, setloading] = useState(false)
  let active = false
  switch (props.type) {
    case '0':
      active = props.record.listener_status == '0'
      break
    case '1':
      active = props.record.listener_status == '1'
      break
    case '2':
      active = props.record.listener_status == '2'
      break
    case '3':
      active = props.record.listener_status != '0'
      break
    default:
      break
  }
  const handleEvent = async () => {
    if (!active) return
    setloading(true)
    await channelUpdateListener(
      {
        channel_id: props.record.id,
      },
      props.type,
    )
    setloading(false)
    props.initData()
  }
  return (
    <>
      {loading ? (
        <LoadingOutlined style={{ fontSize: '16px' }} className='active' />
      ) : props.type == '3' && active ? (
        <Popconfirm
          placement='bottom'
          title='警告'
          description='确定还原该通道的配置吗？'
          onConfirm={() => handleEvent()}
          okText='确定'
          cancelText='取消'>
          <div
            title={Titles[props.type]}
            className={`icon iconfont icon-${Icons[props.type]} config ${
              active && 'active'
            }`}
            aria-disabled={true}></div>
        </Popconfirm>
      ) : (
        <div
          title={Titles[props.type]}
          className={`icon iconfont icon-${Icons[props.type]} config ${
            active && 'active'
          }`}
          aria-disabled={true}
          onClick={() => handleEvent()}></div>
      )}
    </>
  )
}

// 发送列表
export default function Channel() {
  const { message } = App.useApp()
  const size = useSize()
  const bindSensitiveWordDialogRef: MutableRefObject<any> = useRef(null)
  const bindBlackDialogRef: MutableRefObject<any> = useRef(null)
  const addChannelDialogRef: MutableRefObject<any> = useRef(null)
  const drawerRef: MutableRefObject<any> = useRef(null)
  const [list, setlist] = useState<DataType[]>([])
  const [loading, setloading] = useState(false)
  let timer = useRef(null) // 轮询
  const [resetTime, setResetTime] = useState(0) // 查询次数

  // 被点击的客户(不是被checkbox选中的客户)
  const [activeIndex, setactiveIndex] = useState<number>()
  // 选中的keys
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const onRow = (record: DataType, index?: number) => {
    return {
      onClick: () => {
        setactiveIndex(index)
      },
      onDoubleClick: () => {
        if (selectedRowKeys.includes(record.id)) {
          setSelectedRowKeys(
            selectedRowKeys.filter((item) => item != record.id),
          )
        } else {
          setSelectedRowKeys([...selectedRowKeys, record.id])
        }
      },
    }
  }
  const rowSelection = {
    columnWidth: size == 'small' ? 32 : 60,
    fixed: true,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys)
    },
  }

  const RenderConfig = (_: any, record: DataType) => {
    const arr: ConfigItemProps['type'][] = ['0', '1', '2', '3']
    return (
      <Row gutter={16} className='config-wrap'>
        {arr.map((item) => (
          <Col key={item}>
            <ConfigItem type={item} record={record} initData={initData} />
          </Col>
        ))}
      </Row>
    )
  }
  const columns: ColumnsType<DataType> = [
    {
      title: '通道名',
      width: size == 'small' ? 100 : 130,
      className: size == 'small' ? '' : 'paddingL30',
      fixed: true,
      render: (_, record: DataType) => (
        <div
          style={{ width: size == 'small' ? '100px' : '130px' }}
          className='g-ellipsis'
          title={record.name}>
          {record.name}
        </div>
      ),
    },
    {
      title: '通道类型',
      width: 120,
      className: 'paddingL30',
      dataIndex: 'type',
      render: (_, record: DataType) => (
        <>{getOptionsLabel(channelTypeOptions, record.type)}</>
      ),
    },
    {
      title: '流速',
      width: 80,
      render: (_, record: DataType) => <>{record.flow}t/s</>,
    },
    {
      title: '号码前缀',
      width: 100,
      render: (_, record: DataType) => {
        return <>{getOptionsLabel(mobileTypeOptions, record.mobile_type)}</>
      },
    },
    {
      title: '关联国家/地区',
      width: 120,
      render: (_, record) => (
        <Button
          type='link'
          onClick={() => showDetail(record)}
          style={{ padding: 0 }}>
          查看详情
        </Button>
      ),
    },
    {
      title: '敏感词绑定',
      width: 160,
      render: (_, record) => (
        <Tooltip title={record.sens_name}>
          <div className='bind-wrap color-gray'>
            <span className='text g-ellipsis' title={record.sens_name || ''}>
              {record.sens_name || '未绑定'}
            </span>
            <div
              className='icon-wrap fx-center-center'
              onClick={() => showBindSensDialog(record)}>
              <span className='icon iconfont icon-bangding fn14'></span>
            </div>
          </div>
        </Tooltip>
      ),
    },
    {
      title: '黑名单绑定',
      width: 160,
      render: (_, record) => (
        <Tooltip title={record.block_name}>
          <div className='bind-wrap color-gray'>
            <span className='text g-ellipsis' title={record.block_name || ''}>
              {record.block_name || '未绑定'}
            </span>
            <div
              className='icon-wrap fx-center-center'
              onClick={() => showBindBlackDialog(record)}>
              <span className='icon iconfont icon-bangding fn14'></span>
            </div>
          </div>
        </Tooltip>
      ),
    },
    {
      title: <span title='每10秒刷新一次列表'>连接状态</span>,
      width: 140,
      render: (_, record) => {
        let text = ''
        let color = ''
        switch (record.connection_status) {
          case 0:
            text = '无连接'
            color = ''
            break
          case -1:
            text = '连接失败：正在重试'
            color = 'color-error'
            break
          case -2:
            text = '绑定失败：正在重试'
            color = 'color-error'
            break
          case 99:
            text = '连接异常'
            color = 'color-error'
            break
          default:
            color = 'color-success'
            text = '连接正常'
        }

        return <div className={color}>{text}</div>
      },
    },
    {
      title: '链路数量',
      width: 80,
      render: (_, record) => {
        let num: number
        switch (record.connection_status) {
          case 0:
          case -1:
          case -2:
          case 99:
            num = 0
            break
          default:
            num = record.connection_status
        }

        return <div>{num}</div>
      },
    },
    {
      title: '配置',
      width: 160,
      render: RenderConfig,
    },
    {
      title: '操作',
      width: 120,
      render: (_, record) => (
        <>
          {[0, -1, -2, 99].includes(record.connection_status) ? (
            <>
              <Button
                type='link'
                style={{ paddingLeft: 0 }}
                onClick={() => editChannelEvent(record)}>
                编辑
              </Button>
              <Popconfirm
                placement='left'
                title='警告'
                description='确定删除该通道吗？'
                onConfirm={() => deleteEvent(record.id)}
                okText='确定'
                cancelText='取消'>
                <Button type='link'>删除</Button>
              </Popconfirm>
            </>
          ) : (
            <span title='连接状态，无法操作'>
              <Button type='link' style={{ paddingLeft: 0 }} disabled>
                编辑
              </Button>
              <Button type='link' disabled>
                删除
              </Button>
            </span>
          )}
        </>
      ),
    },
  ]

  const addChannelEvent = () => {
    addChannelDialogRef.current.open({ isAdd: true })
  }
  const editChannelEvent = (record: DataType) => {
    addChannelDialogRef.current.open({ isAdd: false, record })
  }
  const showDetail = (record: DataType) => {
    drawerRef.current.open(record.id)
  }
  const showBindSensDialog = (record: DataType) => {
    bindSensitiveWordDialogRef.current.open(record)
  }
  const showBindBlackDialog = (record: DataType) => {
    bindBlackDialogRef.current.open(record)
  }

  useEffect(() => {
    initData()
  }, [])

  useEffect(() => {
    timer.current && clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      initData(false)
    }, 10000) // 10s轮询一次，更新连接状态
    return () => {
      if (timer) clearTimeout(timer.current)
    }
  }, [resetTime])

  // 获取列表
  const initData = async (showLoading = true) => {
    try {
      setloading(showLoading)
      const res = await getChannelList({ id: '' })
      setlist(res.data)
      setloading(false)
      setResetTime(() => resetTime + 1)
    } catch (error) {
      setloading(false)
      setResetTime(() => resetTime + 1)
    }
  }
  // 删除通道
  const deleteEvent = async (id: string) => {
    try {
      await deleteChannel({ id })
      message.success('删除成功')
      initData()
      setSelectedRowKeys(selectedRowKeys.filter((item) => item != id))
    } catch (error) {}
  }

  // 批量处理配置（批量断连和批量还原不要这两个需求，但逻辑还在）
  const updateListner = async (type: ConfigItemProps['type']) => {
    if (selectedRowKeys.length == 0) {
      message.warning('请选择通道！')
      return
    }
    const selectedRows = list.filter((item) =>
      selectedRowKeys.includes(item.id),
    )
    let actives = true
    switch (type) {
      case '0':
      case '1':
      case '2':
        selectedRows.forEach((item) => {
          if (item.listener_status != type) {
            actives = false
          }
        })
        break
      case '3':
        selectedRows.forEach((item) => {
          if (item.listener_status == '0') {
            actives = false
          }
        })
        break
    }
    if (!actives) {
      switch (type) {
        case '0':
          message.warning('存在已添加配置的通道！')
          break
        case '1':
          message.warning('存在未添加配置或已建立连接的通道！')
          break
        case '2':
          message.warning('存在未建立连接的通道！')
          break
        case '3':
          message.warning('存在未添加配置的通道！')
          break
      }
      return
    }
    const channel_ids = selectedRowKeys.join(',')
    await channelUpdateListener(
      {
        channel_id: channel_ids,
      },
      type,
    )
    // message.success('操作成功！')
    initData()
  }

  return (
    <div data-class='channel'>
      <MenuTitle title='通道管理'></MenuTitle>
      <div className={`btn-group ${size}`} style={{ marginBottom: '10px' }}>
        <div className='btn' onClick={addChannelEvent}>
          <i className='icon iconfont icon-xinzeng'></i>
          <span>新增</span>
        </div>

        <Popconfirm
          placement='bottom'
          title='警告'
          description='确定配置选中的通道吗？'
          onConfirm={() => updateListner('0')}
          okText='确定'
          cancelText='取消'>
          <div className='btn'>
            <i className='icon iconfont icon-peizhi'></i>
            <span>配置</span>
          </div>
        </Popconfirm>
        <Popconfirm
          placement='bottom'
          title='警告'
          description='确定连接选中的通道吗？'
          onConfirm={() => updateListner('1')}
          okText='确定'
          cancelText='取消'>
          <div className='btn'>
            <i className='icon iconfont icon-lianjie'></i>
            <span>连接</span>
          </div>
        </Popconfirm>
        {/* <Popconfirm
          placement='bottom'
          title='警告'
          description='确定断连选中的通道吗？'
          onConfirm={() => updateListner('2')}
          okText='确定'
          cancelText='取消'>
          <div className='btn'>
            <i className='icon iconfont icon-duanlian'></i>
            <span>断连</span>
          </div>
        </Popconfirm>
        <Popconfirm
          placement='bottom'
          title='警告'
          description='确定还原选中的通道吗？'
          onConfirm={() => updateListner('3')}
          okText='确定'
          cancelText='取消'>
          <div className='btn delete'>
            <i className='icon iconfont icon-huanyuan'></i>
            <span>还原</span>
          </div>
        </Popconfirm> */}
      </div>
      <Table
        className='theme-cell bg-white'
        columns={columns}
        dataSource={list}
        sticky
        pagination={false}
        rowKey={'id'}
        onRow={onRow}
        rowSelection={rowSelection}
        rowClassName={(record, index) => (index == activeIndex ? 'active' : '')}
        scroll={{ x: 'max-content' }}
        loading={loading}
      />
      <AddChannel ref={addChannelDialogRef} initData={initData} />
      <BindSensitiveWordDialog
        ref={bindSensitiveWordDialogRef}
        onSearch={initData}
      />
      <BindBlackDialog ref={bindBlackDialogRef} onSearch={initData} />
      <MyDrawer ref={drawerRef} />
    </div>
  )
}
