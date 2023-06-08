import { useEffect, useState, MutableRefObject, useRef } from 'react'
import { Button, ConfigProvider, Table, Row, Col, Popconfirm, App } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import AddChannel from './dialog/addChannel'
import MyDrawer from './dialog/drawer/drawer'
import MenuTitle from '@/components/menuTitle/menuTitle'
import { getChannelList, deleteChannel } from '@/api'
import { API } from 'apis'
import {
  mobileTypeOptions,
  getOptionsLabel,
  channelTypeOptions,
} from '@/utils/options'

import './channel.scss'

interface DataType extends API.ChannelItem {}

// 发送列表
export default function Channel() {
  const { message } = App.useApp()
  const addChannelDialogRef: MutableRefObject<any> = useRef(null)
  const drawerRef: MutableRefObject<any> = useRef(null)
  const [list, setlist] = useState<DataType[]>([])

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
    columnWidth: 60,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys)
    },
  }

  const RenderConfig = (_: any, record: DataType) => {
    return (
      <Row gutter={16} className='config-wrap'>
        <Col>
          <div title='添加配置' className={`icon iconfont icon-peizhi`}></div>
        </Col>
        <Col>
          <div title='建立连接' className={`icon iconfont icon-lianjie`}></div>
        </Col>
        <Col>
          <div title='关闭连接' className={`icon iconfont icon-duanlian`}></div>
        </Col>
        <Col>
          <div title='删除配置' className={`icon iconfont icon-huanyuan`}></div>
        </Col>
      </Row>
    )
  }
  const columns: ColumnsType<DataType> = [
    {
      title: '通道名',
      width: '12%',
      className: 'paddingL30',
      dataIndex: 'name',
    },
    {
      title: '通道类型',
      dataIndex: 'type',
      render: (_, record: DataType) => (
        <>{getOptionsLabel(channelTypeOptions, record.type)}</>
      ),
    },
    {
      title: '流速',
      render: (_, record: DataType) => <>{record.flow}t/s</>,
    },
    {
      title: '号码前缀',
      width: '10%',
      render: (_, record: DataType) => {
        return <>{getOptionsLabel(mobileTypeOptions, record.mobile_type)}</>
      },
    },
    {
      title: '关联国家/地区',
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
      title: '连接状态',
      render: (_, record) => <div className='color-success'>无字段</div>,
    },
    {
      title: '链路数量',
      width: '10%',
      render: (_, record) => <div>1</div>,
    },
    {
      title: '配置',
      render: RenderConfig,
    },
    {
      title: '操作',
      width: 120,
      render: (_, record) => (
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

  useEffect(() => {
    initData()
  }, [])

  // 获取列表
  const initData = async () => {
    try {
      const res = await getChannelList({ id: '' })
      setlist(res.data)
    } catch (error) {}
  }
  // 删除通道
  const deleteEvent = async (ids: string | React.Key[]) => {
    let id = ''
    if (Array.isArray(ids)) {
      if (ids.length === 0) {
        message.warning('请选择删除的通道！')
        return
      }
      id = ids.join(',')
    } else {
      id = ids
    }
    try {
      await deleteChannel({ id })
      message.success('删除成功')
      initData()
      if (Array.isArray(ids)) {
        setSelectedRowKeys([])
      } else {
        setSelectedRowKeys(selectedRowKeys.filter((item) => item != ids))
      }
    } catch (error) {}
  }

  return (
    <div data-class='channel'>
      <MenuTitle title='通道管理'></MenuTitle>
      <div className='btn-group' style={{ marginBottom: '10px' }}>
        <div className='btn' onClick={addChannelEvent}>
          <i className='icon iconfont icon-xinzeng'></i>
          <span>新增</span>
        </div>
        <div className='btn'>
          <i className='icon iconfont icon-peizhi'></i>
          <span>配置</span>
        </div>
        <Popconfirm
          placement='bottom'
          title='警告'
          description='确定连接选中的通道吗？'
          // onConfirm={deleteEvent}
          okText='确定'
          cancelText='取消'>
          <div className='btn'>
            <i className='icon iconfont icon-lianjie'></i>
            <span>连接</span>
          </div>
        </Popconfirm>
        <Popconfirm
          placement='bottom'
          title='警告'
          description='确定断连选中的通道吗？'
          // onConfirm={deleteEvent}
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
          // onConfirm={deleteEvent}
          okText='确定'
          cancelText='取消'>
          <div className='btn delete'>
            <i className='icon iconfont icon-huanyuan'></i>
            <span>还原</span>
          </div>
        </Popconfirm>
        <Popconfirm
          placement='bottom'
          title='警告'
          description='确定删除选中的通道吗？'
          onConfirm={() => deleteEvent(selectedRowKeys)}
          okText='确定'
          cancelText='取消'>
          <div className='btn delete line'>
            <i className='icon iconfont icon-shanchu'></i>
            <span>删除</span>
          </div>
        </Popconfirm>
      </div>
      <ConfigProvider
        theme={{
          token: {
            colorBgContainer: 'transparent',
          },
        }}>
        <Table
          className='theme-cell bg-white'
          columns={columns}
          dataSource={list}
          sticky
          pagination={false}
          rowKey={'id'}
          onRow={onRow}
          rowSelection={rowSelection}
          rowClassName={(record, index) =>
            index == activeIndex ? 'active' : ''
          }
          scroll={{ x: 'max-content' }}
        />
      </ConfigProvider>
      <AddChannel ref={addChannelDialogRef} initData={initData} />
      <MyDrawer ref={drawerRef} />
    </div>
  )
}
