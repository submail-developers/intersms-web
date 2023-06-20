import { useEffect, useState, MutableRefObject, useRef } from 'react'
import { Button, Table, Row, Col, Popconfirm, App } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import AddChannel from './dialog/addChannel'
import MyDrawer from './dialog/drawer/drawer'
import BindSensitiveWordDialog from './dialog/bindSensitiveWordDialog/bindSensitiveWordDialog'
import BindBlackDialog from './dialog/bindBlackDialog/bindBlackDialog'
import MenuTitle from '@/components/menuTitle/menuTitle'
import { getChannelList, deleteChannel } from '@/api'
import { useSize } from '@/hooks'
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
  const size = useSize()
  const bindSensitiveWordDialogRef: MutableRefObject<any> = useRef(null)
  const bindBlackDialogRef: MutableRefObject<any> = useRef(null)
  const addChannelDialogRef: MutableRefObject<any> = useRef(null)
  const drawerRef: MutableRefObject<any> = useRef(null)
  const [list, setlist] = useState<DataType[]>([])
  const [loading, setloading] = useState(false)

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
      ),
    },
    {
      title: '黑名单绑定',
      width: 160,
      render: (_, record) => (
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
      ),
    },
    {
      title: '连接状态',
      width: 100,
      render: (_, record) => <div className='color-success'>无字段</div>,
    },
    {
      title: '链路数量',
      width: 80,
      render: (_, record) => <div>1</div>,
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
  const showBindSensDialog = (record: DataType) => {
    bindSensitiveWordDialogRef.current.open(record)
  }
  const showBindBlackDialog = (record: DataType) => {
    bindBlackDialogRef.current.open(record)
  }

  useEffect(() => {
    initData()
  }, [])

  // 获取列表
  const initData = async () => {
    try {
      setloading(true)
      const res = await getChannelList({ id: '' })
      setlist(res.data)
      setloading(false)
    } catch (error) {
      setloading(false)
    }
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
      <div className={`btn-group ${size}`} style={{ marginBottom: '10px' }}>
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
