import { ReactNode, useEffect, useState, MutableRefObject, useRef } from 'react'
import {
  Button,
  Select,
  Form,
  Input,
  DatePicker,
  ConfigProvider,
  Table,
  App,
  Row,
  Col,
  Space,
  Checkbox,
  Popconfirm,
  Switch
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { RangePickerProps } from 'antd/es/date-picker'
import AddChannel from './dialog/addSensitiveWord'
import ChannelDetail from './dialog/channelDetail/channelDetail'
import MenuTitle from '@/components/menuTitle/menuTitle'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { GetSensitiveWordList } from '@/api'
import { useSize } from '@/hooks'
import { API } from 'apis'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'

import './sensitiveWord.scss'

interface DataType {
  id: string
  channel_name: string
  access_type: string
  channel_type: string
  speed: string
  prefix: string
}
interface FormValues {
  channel: string
  group: string
  time: [Dayjs, Dayjs] | null
  keyword: string
}

// 发送列表
export default function Channel() {
  useEffect(() => {
    search()
  }, [])

  const search = async () => {
    const res = await GetSensitiveWordList({
      id:'',
      page: '1',
    })
    settableData(res.data)
    if (res.data.length > 0) {
      // dispatch(changeActiveAccountId(res.data[0].account))
      // setSelectedRowKeys([res.data[0].account])
    } else {
      // dispatch(changeActiveAccountId(''))
      // setSelectedRowKeys([''])
    }
  }
  const [tableData, settableData] = useState<API.GetSensitiveWordListParams[]>([])
  const addChannelDialogRef: MutableRefObject<any> = useRef(null)
  const detailRef: MutableRefObject<any> = useRef(null)
  const size = useSize()
  const [form] = Form.useForm()
  const { message } = App.useApp()

  interface DataType extends API.GetSensitiveWordListParams {}

  const columns: ColumnsType<DataType> = [
    {
      title: <Checkbox></Checkbox>,
      dataIndex: 'checkbox',
      className: 'checkbox-wrap',
      width: 60,
      render: (_, record) => (
        <Checkbox
          className='checkbox'
          onChange={(e) => onChange(e, record)}></Checkbox>
      ),
    },
    {
      title: '类目名称',
      dataIndex: 'name',
      width: 160,
      onCell: (record: DataType) => {
        return {
          onClick: () => {
            setSelectedRowKeys([record.id])
          },
        }
      },
    },
    {
      title: '敏感词',
      width: 600,
      dataIndex: 'keywords',
      onCell: (record: DataType) => {
        return {
          onClick: () => {
            setSelectedRowKeys([record.id])
          },
        }
      },
    },
    {
      title: '备注',
      dataIndex: 'comment',
      width: 160,
      onCell: (record: DataType) => {
        return {
          onClick: () => {
            setSelectedRowKeys([record.id])
          },
        }
      },
    },
    {
      title: '启用状态',
      dataIndex: 'enabled',
      width: 160,
      render: (_, record) => (
        <div className='switch-all fx-shrink'>
          <Switch size={'small'}></Switch>
          <span> 未启用</span>
        </div>
      ),
    }
  ]

  // 被点击的客户(不是被checkbox选中的客户)
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | string[]>(
    [],
  )
  // checkbox勾选的客户
  const [checkedIds, setcheckedIds] = useState<string[]>([])

  // checkbox勾选的事件
  const onChange = (e: CheckboxChangeEvent, record: DataType) => {
    if (e.target.checked) {
      setcheckedIds([...checkedIds, record.id])
    } else {
      setcheckedIds(checkedIds.filter((account) => account !== record.id))
    }
  }

  const rowSelection = {
    selectedRowKeys,
    hideSelectAll: true,
    columnWidth: 4,
    renderCell: () => {
      return null
    },
  }

  // const data: DataType[] = []
  // for (let i = 0; i < 100; i++) {
  //   data.push({
  //     id: 'id' + i,
  //     channel_name: 'string' + i,
  //     access_type: 'string',
  //     channel_type: 'string',
  //     speed: 'string',
  //     prefix: 'string',
  //   })
  // }

  const addChannelEvent = () => {
    addChannelDialogRef.current.open()
  }
  const showDetail = (record: DataType) => {
    detailRef.current.open()
  }

  return (
    <div data-class='channel'>
      <MenuTitle title='敏感词管理'></MenuTitle>
      <Row justify='space-between' wrap align={'bottom'}>
        <Col>
          <div className='btn-group' style={{ marginBottom: '10px' }}>
            <div className='btn' onClick={addChannelEvent}>
              <i className='icon iconfont icon-xinzeng'></i>
              <span>新增</span>
            </div>
            <div className='btn'>
              <i className='icon iconfont icon-bianji'></i>
              <span>修改</span>
            </div>
            <div className='btn'>
              <i className='icon iconfont icon-tingyong'></i>
              <span>停用</span>
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
        </Col>
        
      </Row>
      <ConfigProvider
        theme={{
          token: {
            colorBgContainer: 'transparent',
          },
        }}>
        <Table
          className='theme-cell bg-white'
          columns={columns}
          dataSource={tableData}
          rowSelection={rowSelection}
          rowKey={'id'}
          sticky
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      </ConfigProvider>
      <AddChannel ref={addChannelDialogRef} />
      <ChannelDetail ref={detailRef} />
    </div>
  )
}
