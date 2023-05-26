import { useState, useRef, MutableRefObject, useEffect } from 'react'
import { useAppSelector } from '@/store/hook'
import { channelsState } from '@/store/reducers/channels'
import BindKeyword from './dialog/bindKeyword/bindKeyword'
import { Button, Popconfirm, ConfigProvider, Table, App } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useSize } from '@/hooks'
import { getChannelGroupRelatedData, channelGroupDeleteChannel } from '@/api'
import AddChannelDialog from './dialog/addChannelDialog'
import { API } from 'apis'
import AccessCountryDrawer from './dialog/drawer/drawer'
import { channelTypeOptions, getOptionsLabel } from '@/utils/options'

import './index.scss'

interface DataType extends API.GetChannelGroupRelatedDataItem {}

type Props = {
  activeChannels: API.GetChannelGroupListItem | null
}

export default function Right() {
  // 列表
  const [tableData, settableData] = useState<DataType[]>([])
  const channlesStore = useAppSelector(channelsState)
  const addChannelDialogRef: MutableRefObject<any> = useRef(null)
  const bindKeywordRef: MutableRefObject<any> = useRef(null)
  const drawerRef: MutableRefObject<any> = useRef(null)
  const size = useSize()
  const { message } = App.useApp()
  // 展示新增弹框
  const showAddDialog = () => {
    addChannelDialogRef.current.open()
  }

  useEffect(() => {
    if (channlesStore.activeChannels) {
      getList()
    }
  }, [channlesStore.activeChannels])
  const getList = async () => {
    const res = await getChannelGroupRelatedData({
      group_id: channlesStore.activeChannels?.id || '',
    })
    settableData(res.data)
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

  const columns: ColumnsType<DataType> = [
    {
      title: <div style={{ marginLeft: '20px' }}>通道名</div>,
      render: (_, record) => (
        <div style={{ marginLeft: '20px' }}>{record.channel_name}</div>
      ),
    },
    {
      title: '通道类型',
      dataIndex: 'channel_type',
      render: (_, record) => (
        <div>{getOptionsLabel(channelTypeOptions, record.channel_type)}</div>
      ),
    },
    {
      title: '连接状态',
      render: (_, record) => <div style={{ color: '#e81f1f' }}>没有字段</div>,
    },
    {
      title: '关键字',
      width: 180,
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
      render: (_, record) => (
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
      <AddChannelDialog ref={addChannelDialogRef} onSearch={getList} />
      <AccessCountryDrawer ref={drawerRef} onUpdate={() => updateList()} />
      <BindKeyword ref={bindKeywordRef} onSearch={getList} />
    </section>
  ) : null
}
