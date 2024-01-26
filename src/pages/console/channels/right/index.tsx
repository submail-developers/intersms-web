import { useState, useRef, MutableRefObject, useEffect } from 'react'
import { useAppSelector } from '@/store/hook'
import { channelsState } from '@/store/reducers/channels'
import BindKeyword from './dialog/bindKeyword/bindKeyword'
import { Button, Popconfirm, ConfigProvider, Table, App, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useSize } from '@/hooks'
import { getGroupChannelList, channelGroupDeleteChannel } from '@/api'
import AddChannelDialog from './dialog/addChannelDialog'
import { API } from 'apis'
import AccessCountryDrawer from './dialog/drawer/drawer'
import { channelTypeOptions, getOptionsLabel } from '@/utils/options'

import './index.scss'

interface DataType extends API.GroupChannelItem {}

export default function Right() {
  // 列表
  const [tableData, settableData] = useState<DataType[]>([])

  const channlesStore = useAppSelector(channelsState)
  const addChannelDialogRef: MutableRefObject<any> = useRef(null)
  const bindKeywordRef: MutableRefObject<any> = useRef(null)
  const drawerRef: MutableRefObject<any> = useRef(null)
  const size = useSize()
  const { message } = App.useApp()
  let timer = useRef(null) // 轮询
  const [resetTime, setResetTime] = useState(0) // 查询次数
  // 展示新增弹框
  const showAddDialog = () => {
    addChannelDialogRef.current.open()
  }

  useEffect(() => {
    if (channlesStore.activeChannels) {
      getList()
    }
  }, [channlesStore.activeChannels])

  useEffect(() => {
    if (channlesStore.activeChannels) {
      timer.current && clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        getList()
      }, 10000) // 10s轮询一次，更新连接状态
    }
    return () => {
      if (timer) clearTimeout(timer.current)
    }
  }, [channlesStore.activeChannels, resetTime])
  const getList = async () => {
    try {
      const res = await getGroupChannelList({
        group_id: channlesStore.activeChannels?.id || '',
      })
      settableData(res.data)
      setResetTime(() => resetTime + 1)
    } catch (error) {
      setResetTime(() => resetTime + 1)
    }
  }

  const updateList = async () => {
    await getList()
  }

  // 选中的keys
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const onRow = (record: DataType, index?: number) => {
    return {
      onDoubleClick: () => {
        if (selectedRowKeys.includes(record.channel_id)) {
          setSelectedRowKeys(
            selectedRowKeys.filter((item) => item != record.channel_id),
          )
        } else {
          setSelectedRowKeys([...selectedRowKeys, record.channel_id])
        }
      },
    }
  }
  const rowSelection = {
    columnWidth: 60,
    fixed: true,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys)
    },
  }

  const openDrawer = (record: DataType) => {
    drawerRef.current.open(record)
  }

  // 删除选中的通道
  const deleteSelectChannel = async () => {
    console.log(selectedRowKeys)
    if (selectedRowKeys.length == 0) {
      message.warning('请选择要删除的通道!')
      return
    }
    let params: API.ChannelGroupDeleteChannelParams
    params = {
      channel_id: selectedRowKeys.join(','),
      group_id: channlesStore.activeChannels?.id || '',
    }
    await channelGroupDeleteChannel(params)
    getList()
    setSelectedRowKeys([])
    message.success('删除成功')
  }

  // 删除单个通道
  const deleteChannel = async (record: DataType) => {
    let params: API.ChannelGroupDeleteChannelParams
    params = {
      channel_id: record.channel_id,
      group_id: channlesStore.activeChannels?.id || '',
    }
    await channelGroupDeleteChannel(params)
    getList()
    message.success('删除成功')
    setSelectedRowKeys(
      selectedRowKeys.filter((item) => item != record.channel_id),
    )
  }
  // 点击提示复制
  type TipProps = {
    record: DataType
  }
  const Tip = (props: TipProps) => {
    let text = `
        ${props.record.channel_name}
      `
    const copy = async () => {
      try {
        await navigator.clipboard.writeText(text)
        message.success('复制成功')
      } catch (error) {
        message.success('复制失败')
      }
    }
    return (
      <div onClick={copy}>
        <div>{props.record.channel_name}</div>
      </div>
    )
  }
  const columns: ColumnsType<DataType> = [
    {
      title: <div style={{ marginLeft: '20px' }}>通道名</div>,
      width: size == 'small' ? 80 : 130,
      fixed: true,
      render: (_, record) => (
        <Tooltip
          title={<Tip record={record} />}
          placement='bottom'
          mouseEnterDelay={0.3}
          trigger={['hover', 'click']}>
          <div className='g-ellipsis'>{record.channel_name}</div>
        </Tooltip>
      ),
      // render: (_, record) => (
      //   <div style={{ marginLeft: '20px', width: 140 }} className='g-ellipsis'>
      //     {record.channel_name}
      //   </div>
      // ),
    },
    {
      title: '通道类型',
      dataIndex: 'channel_type',
      width: 160,
      render: (_, record) => (
        <div>{getOptionsLabel(channelTypeOptions, record.channel_type)}</div>
      ),
    },
    {
      title: <span title='每10秒刷新一次列表'>连接状态</span>,
      width: 140,
      render: (_, record) => {
        let text = ''
        let color = ''
        switch (record.connection_status) {
          case -100:
            text = '未配置'
            color = ''
            break
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
      title: '关键字',
      width: 140,
      render: (_, record) => {
        let keywords = ''
        keywords = record.keyroute_list[0]?.keyroute_name || ''
        return (
          <div className={`bind-wrap ${keywords ? '' : 'color-gray'}`}>
            <span title={keywords || ''} className='text'>
              {keywords || '未绑定'}
            </span>
            <div
              className='icon-wrap fx-center-center'
              onClick={() => bindKeywordRef.current.open(record)}>
              <span className='icon iconfont icon-bangding fn14'></span>
            </div>
          </div>
        )
      },
    },
    {
      title: '关联国家/地区',
      dataIndex: 'actions',
      width: 160,
      render: (_, record) => (
        <Button
          type='link'
          style={{ paddingLeft: 0, paddingRight: 0 }}
          onClick={() => openDrawer(record)}>
          查看详情
        </Button>
      ),
    },
    {
      title: '操作',
      dataIndex: 'actions',
      width: 120,
      render: (_, record) => (
        <>
          {[0, -1, -2, 99].includes(record.connection_status) ? (
            <Popconfirm
              placement='bottom'
              title='警告'
              description='确定删除该通道吗？'
              onConfirm={() => deleteChannel(record)}
              okText='确定'
              cancelText='取消'>
              <Button type='link' style={{ paddingLeft: 0, paddingRight: 0 }}>
                删除
              </Button>
            </Popconfirm>
          ) : (
            <span title='连接状态，无法操作'>
              <Button
                type='link'
                style={{ paddingLeft: 0, paddingRight: 0 }}
                disabled>
                删除
              </Button>
            </span>
          )}
        </>
      ),
    },
  ]

  return channlesStore.activeChannels ? (
    <section
      data-class='channels-right'
      className='right-wrap fx-auto fx-shrink'
      style={{ minWidth: `${size === 'small' ? '100%' : ''}` }}>
      <div className='fx-col'>
        <div className='btn-group'>
          <div className='btn' onClick={showAddDialog}>
            <i className='icon iconfont icon-xinzeng'></i>
            <span>新增</span>
          </div>
          <Popconfirm
            placement='bottom'
            title='警告'
            description='确定删除选中的通道吗？'
            onConfirm={deleteSelectChannel}
            okText='确定'
            cancelText='取消'>
            <div className='btn delete'>
              <i className='icon iconfont icon-shanchu'></i>
              <span>删除</span>
            </div>
          </Popconfirm>
        </div>
        <div className='list-title'>通道管理配置</div>

        <div className='tabs'>
          <ConfigProvider
            theme={{
              token: {
                colorBgContainer: '#fff',
              },
            }}>
            <Table
              className='theme-grid'
              columns={columns}
              dataSource={tableData}
              rowKey={'channel_id'}
              onRow={onRow}
              rowSelection={rowSelection}
              sticky
              scroll={{ x: 'max-content' }}
              pagination={false}
            />
          </ConfigProvider>
        </div>
      </div>
      <AddChannelDialog
        disableList={tableData}
        ref={addChannelDialogRef}
        onSearch={getList}
      />
      <AccessCountryDrawer ref={drawerRef} onUpdate={() => updateList()} />
      <BindKeyword ref={bindKeywordRef} onSearch={getList} />
    </section>
  ) : null
}
