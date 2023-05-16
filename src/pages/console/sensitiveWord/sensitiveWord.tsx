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
  Switch,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { RangePickerProps } from 'antd/es/date-picker'
import AddSensitive from './dialog/addSensitiveWord'
import ChannelDetail from './dialog/channelDetail/channelDetail'
import MenuTitle from '@/components/menuTitle/menuTitle'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { GetSensitiveWordList,DeleteSensitiveWordList,SensitiveWordListStopUsing } from '@/api'
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
      id: '',
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
  const [tableData, settableData] = useState<API.GetSensitiveWordListItems[]>(
    [],
  )
  const addSensitiveWordListRef: MutableRefObject<any> = useRef(null)
  // const detailRef: MutableRefObject<any> = useRef(null)
  const size = useSize()
  const [form] = Form.useForm()
  const { message } = App.useApp()

  interface DataType extends API.GetSensitiveWordListItems {}

  // 启用 停用事件
  const setSwicth=()=>{
    // console.log(checked)
  }

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
      render: (_, record: DataType) => (
        // record.enabled == '0' ? <div className='switch-all fx-shrink'>
        //                             <Switch size={'small'}></Switch>
        //                             <span> 未启用</span>
        //                         </div>
        //                       : 
        //                       <div className='switch-all fx-shrink'>
        //                         <Switch size={'small'} checked></Switch>
        //                         <span> 已启用</span>
        //                       </div>()=>this.handle_delete(id)
        <div className='switch-all fx-shrink' onClick={()=>setSwicth()}>
          <Switch size={'small'} checked={record.enabled == '1'} ></Switch> &nbsp;
          <span>{record.enabled == '1' ? '已启用' : '未启用'}</span>
        </div>
      ),
    },
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
  // 删除事件
  const deleteEvent = async () => {
    if (checkedIds.length === 0) {
      message.warning('请勾选要删除的客户！')
      return
    }
    const id = checkedIds.join(',')
    await DeleteSensitiveWordList({ id })
    await search()
  }
  // 批量停用
  const batchDeactivation = async () => {
    if (checkedIds.length === 0) {
      message.warning('请勾选要停用的客户！')
      return
    }
    const id = checkedIds.join(',')
    const status = '0'
    await SensitiveWordListStopUsing({ id,status })
    await search()
  }


  const addSensitiveEvent = () => {
    addSensitiveWordListRef.current.open()
  }

  
  return (
    <div data-class='channel'>
      <MenuTitle title='敏感词管理'></MenuTitle>
      <Row justify='space-between' wrap align={'bottom'}>
        <Col>
          <div className='btn-group' style={{ marginBottom: '10px' }}>
            <div className='btn' onClick={addSensitiveEvent}>
              <i className='icon iconfont icon-xinzeng'></i>
              <span>新增</span>
            </div>
            <div className='btn'>
              <i className='icon iconfont icon-bianji'></i>
              <span>修改</span>
            </div>


            <Popconfirm
              placement='bottom'
              title='警告'
              description='确定停用选中的敏感词吗？'
              onConfirm={batchDeactivation}
              okText='确定'
              cancelText='取消'>
              <div className='btn'>
                <i className='icon iconfont icon-tingyong'></i>
                <span>停用</span>
              </div>
            </Popconfirm>
            


            <Popconfirm
              placement='bottom'
              title='警告'
              description='确定删除选中敏感词吗？'
              onConfirm={deleteEvent}
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
      <AddSensitive ref={addSensitiveWordListRef} onSearch={search}/>
      {/* <ChannelDetail ref={detailRef} /> */}
    </div>
  )
}
