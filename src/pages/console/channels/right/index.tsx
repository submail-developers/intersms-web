import { useState, useRef, MutableRefObject, useEffect } from 'react'
import { useAppSelector } from '@/store/hook'
import { channelsState } from '@/store/reducers/channels'
import BindKeyword from './dialog/bindKeyword/bindKeyword'
import {
  Tabs,
  Button,
  Space,
  Switch,
  Popconfirm,
  ConfigProvider,
  Table,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TabsProps } from 'antd'
import { useSize } from '@/hooks'
import { getChannelGroupRelatedData } from '@/api'
import ChannelDialog from './dialog/channelDialog'
import { API } from 'apis'
import AccessCountryDrawer from './dialog/drawer/accessCountry'
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
  const channelDialogRef: MutableRefObject<any> = useRef(null)
  const bindKeywordRef: MutableRefObject<any> = useRef(null)
  const drawerRef: MutableRefObject<any> = useRef(null)
  const size = useSize()
  // 展示新增弹框
  const showAddDialog = () => {
    channelDialogRef.current.open()
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
    settableData(Array.isArray(res.data) ? res.data : Object.values(res.data))
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
      render: (_, record) => (
        <div className='bind-wrap color-gray'>
          <span className='text'>未绑定</span>
          <div
            className='icon-wrap fx-center-center'
            onClick={() => bindKeywordRef.current.open(record)}>
            <span className='icon iconfont icon-bangding fn14'></span>
          </div>
        </div>
      ),
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
        <Button type='link' style={{ paddingLeft: 0, paddingRight: 0 }}>
          删除
        </Button>
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
          <div className='btn'>
            <i className='icon iconfont icon-bianji'></i>
            <span>编辑</span>
          </div>
          <Popconfirm
            placement='bottom'
            title='警告'
            description='确定删除选中的客户吗？'
            // onConfirm={deleteEvent}
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
            />
          </ConfigProvider>
        </div>
      </div>
      <ChannelDialog ref={channelDialogRef} />
      <AccessCountryDrawer ref={drawerRef} />
      <BindKeyword ref={bindKeywordRef} />
    </section>
  ) : null
}
