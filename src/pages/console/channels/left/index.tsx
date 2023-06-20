import { useAppDispatch, useAppSelector } from '@/store/hook'
import { changeActiveChannels } from '@/store/reducers/channels'
import { useState, useEffect, useRef, MutableRefObject } from 'react'
import { Input, ConfigProvider, Table, Switch, Popconfirm, App } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import AddDialog from './addDialog/addDialog'
import BindSensitiveWordDialog from './bindSensitiveWordDialog/bindSensitiveWordDialog'
import BindBlackDialog from './bindBlackDialog/bindBlackDialog'

import { usePoint } from '@/hooks'
import {
  getChannelGroupList,
  deleteChannelGroup,
  updateChannelGroup,
} from '@/api'
import { API } from 'apis'
import './index.scss'

interface DataType extends API.GetChannelGroupListItem {}
interface SwitchProps {
  record: DataType
}
/**
 * 客户信息
 */
export default function Left() {
  const dialogRef: MutableRefObject<any> = useRef(null)
  const bindSensitiveWordDialogRef: MutableRefObject<any> = useRef(null)
  const bindBlackDialogRef: MutableRefObject<any> = useRef(null)
  const { message } = App.useApp()
  const dispatch = useAppDispatch()
  const point = usePoint('xl')
  const [keyword, setkeyword] = useState<string>('')
  // 列表
  const [tableData, settableData] = useState<DataType[]>([])
  // 被点击的客户(不是被checkbox选中的客户)
  const [activeRow, setactiveRow] = useState<DataType | null>(null)
  const onRow = (record: DataType, index?: number) => {
    return {
      onClick: () => {
        setactiveRow(record)
        dispatch(changeActiveChannels(record))
      },
    }
  }

  // switch
  const SwitchNode = (props: SwitchProps) => {
    const [loading, setloading] = useState(false)
    // 修改开启状态
    const changeState = async (_: any, event: any) => {
      event.stopPropagation()
      setloading(true)
      await updateChannelGroup({
        ...props.record,
        enabled: props.record.enabled == '1' ? '0' : '1',
      })
      await search(true)
      setloading(false)
    }
    return (
      <Switch
        size='small'
        checked={props.record.enabled == '1'}
        loading={loading}
        onClick={(_, event) => changeState(_, event)}></Switch>
    )
  }

  const columns: ColumnsType<DataType> = [
    {
      title: '通道组名称',
      dataIndex: 'name',
      className: 'paddingL30',
      width: 130,
      ellipsis: true,
    },
    {
      title: '敏感词&黑名单',
      width: 200,
      render: (_, record) => {
        let sens_word =
          record.sens_word_list && record.sens_word_list.length > 0
            ? record.sens_word_list[0].name
            : ''
        let block_name =
          record.mobile_block_list && record.mobile_block_list.length > 0
            ? record.mobile_block_list[0].name
            : ''
        return (
          <div className='fx word-wrap'>
            <div className='sens-word g-ellipsis' title={sens_word}>
              {sens_word}
            </div>
            <div className='black-word g-ellipsis' title={sens_word}>
              {block_name}
            </div>
          </div>
        )
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 50,
      render: (_, record) => <SwitchNode record={record}></SwitchNode>,
    },
  ]

  const setValue = (e: any) => {
    setkeyword(e.target.value)
  }

  useEffect(() => {
    search()
    return () => {
      // 清除副作用，切换到其他页面时清空store
      dispatch(changeActiveChannels(null))
      setactiveRow(null)
    }
  }, [])

  // noResetActive是否重置当前选中项
  const search = async (noResetActive?: boolean) => {
    try {
      const res = await getChannelGroupList({ id: '', keyword })
      settableData(res.data)
      if (noResetActive) return
      if (res.data.length > 0) {
        dispatch(changeActiveChannels(res.data[0]))
        setactiveRow(res.data[0])
      } else {
        dispatch(changeActiveChannels(null))
        setactiveRow(null)
      }
    } catch (error) {}
  }

  // 删除通道组
  const deleteEvent = async () => {
    if (activeRow) {
      await deleteChannelGroup({
        id: activeRow.id,
      })
      await search()
    } else {
      message.warning('请选择通道组！')
    }
  }
  // 新增通道组-弹框
  const openAddDialog = () => {
    dialogRef.current.open()
  }
  // 编辑通道组-弹框
  const editEvent = () => {
    if (activeRow) {
      dialogRef.current.open({ rowData: activeRow })
    } else {
      message.warning('请选择通道组！')
    }
  }
  const showBindSensDialog = () => {
    if (activeRow) {
      bindSensitiveWordDialogRef.current.open(activeRow)
    } else {
      message.warning('请选择通道组！')
    }
  }

  const showBindBlackDialog = () => {
    if (activeRow) {
      bindBlackDialogRef.current.open(activeRow)
    } else {
      message.warning('请选择通道组！')
    }
  }

  return (
    <section data-class='channels-left' className={`${point ? '' : 'xl'}`}>
      <div className='btn-group'>
        <div className='btn' onClick={openAddDialog}>
          <i className='icon iconfont icon-xinzeng'></i>
          <span>新增</span>
        </div>
        <div className='btn' onClick={editEvent}>
          <i className='icon iconfont icon-bianji'></i>
          <span>编辑</span>
        </div>
        <div className='btn' onClick={showBindSensDialog}>
          <i className='icon iconfont icon-bangding'></i>
          <span>敏感词绑定</span>
        </div>
        <div className='btn' onClick={showBindBlackDialog}>
          <i className='icon iconfont icon-bangding'></i>
          <span>黑名单绑定</span>
        </div>
        <Popconfirm
          placement='bottom'
          title='警告'
          description='确定删除当前通道组吗？'
          onConfirm={deleteEvent}
          okText='确定'
          cancelText='取消'>
          <div className='btn delete'>
            <i className='icon iconfont icon-shanchu'></i>
            <span>删除</span>
          </div>
        </Popconfirm>
      </div>
      <div className='filter-wrap fx-col'>
        <div className='input-wrap'>
          <Input
            bordered={false}
            placeholder='请输入关键字过滤'
            maxLength={20}
            allowClear
            suffix={
              <i
                onClick={() => search()}
                className='icon iconfont icon-sousuo fn12'
                style={{ color: '#888', cursor: 'pointer' }}></i>
            }
            onChange={setValue}
            onPressEnter={() => search()}
            value={keyword}
            style={{
              height: '38px',
              borderBottom: '1px solid #E7E7E6',
              borderRadius: 0,
            }}
          />
        </div>
        <div className='table-title'>全部通道组</div>
        <ConfigProvider
          theme={{
            token: {
              colorBgContainer: 'transparent',
            },
          }}>
          <Table
            className='theme-cell bg-gray'
            showHeader={false}
            columns={columns}
            dataSource={tableData}
            rowKey={'id'}
            onRow={onRow}
            rowClassName={(record) =>
              record.id == activeRow?.id ? 'active' : ''
            }
            pagination={false}
            scroll={{ y: 450 }}
          />
        </ConfigProvider>
      </div>
      <AddDialog ref={dialogRef} onSearch={search} />
      <BindSensitiveWordDialog
        ref={bindSensitiveWordDialogRef}
        onSearch={search}
      />
      <BindBlackDialog ref={bindBlackDialogRef} onSearch={search} />
    </section>
  )
}
