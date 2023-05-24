import { useAppDispatch, useAppSelector } from '@/store/hook'
import { changeActiveBlack } from '@/store/reducers/black'
import { useState, useEffect, useRef, MutableRefObject } from 'react'
import {
  Button,
  Input,
  Affix,
  ConfigProvider,
  Table,
  Switch,
  Checkbox,
  Popconfirm,
  App,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import AddDialog from './addDialog/addDialog'

import { useSize } from '@/hooks'
import { getBlackList, BlackListStopUsing, deleteBlackList } from '@/api'
import { API } from 'apis'
import './index.scss'

interface DataType extends API.GetBlackListItems {}
interface SwitchProps {
  record: DataType
}

/**
 * 客户信息
 */
export default function Left() {
  const dialogRef: MutableRefObject<any> = useRef(null)
  const { message } = App.useApp()
  const dispatch = useAppDispatch()
  // const accountInfoStore = useAppSelector(accountInfoState)
  const size = useSize()
  // 列表
  const [tableData, settableData] = useState<API.GetBlackListItems[]>([])
  // 被点击的客户(不是被checkbox选中的客户)
  // const [activeIndex, setactiveIndex] = useState<number>()
  const [activeIndex, setactiveIndex] = useState<DataType | null>(null)
  const onRow = (record: DataType, index?: number) => {
    return {
      onClick: () => {
        setactiveIndex(record)
      },
    }
  }

  //单独启用 停用事件
  const SwitchNode = (props: SwitchProps) => {
    const [loading, setloading] = useState(false)
    // 修改开启状态
    const changeState = async (_: any, event: any) => {
      event.stopPropagation()
      setloading(true)
      await BlackListStopUsing({
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
      title: 'name',
      dataIndex: 'name',
      className: 'paddingL30',
      ellipsis: true,
    },
    {
      title: 'account',
      dataIndex: 'account',
      ellipsis: true,
      width: 50,
      render: (_, record) => <SwitchNode record={record}></SwitchNode>,
    },
  ]

  useEffect(() => {
    search()
  }, [])
  const search = async (noResetActive?: boolean) => {
    const res = await getBlackList({
      id: '',
      page: '1',
    })
    settableData(res.data)
    if (noResetActive) return
    if (res.data.length > 0) {
      dispatch(changeActiveBlack(res.data[0]))
      setactiveIndex(res.data[0])
    } else {
      dispatch(changeActiveBlack(null))
      setactiveIndex(null)
    }
  }

  // 删除黑名单
  const deleteEvent = async () => {
    if (activeIndex) {
      await deleteBlackList({
        id: activeIndex.id,
      })
      await search()
    } else {
      message.warning('请选择黑名单！')
    }
  }
  // 开启dialog
  const openAddDialog = (isAdd: boolean = true) => {
    if (isAdd === true) {
      dialogRef.current.open()
    } else {
      if (activeIndex) {
        dialogRef.current.open({ rowData: activeIndex })
      } else {
        message.warning('请选择黑名单！')
      }
    }
  }

  return (
    <section data-class='account-left' className={`${size}`}>
      <div className='btn-group'>
        <div className='btn' onClick={() => openAddDialog()}>
          <i className='icon iconfont icon-xinzeng'></i>
          <span>新增</span>
        </div>
        <div className='btn' onClick={() => openAddDialog(false)}>
          <i className='icon iconfont icon-bianji'></i>
          <span>编辑</span>
        </div>
        <Popconfirm
          placement='bottom'
          title='警告'
          description='确定删除选中的黑名单表吗？'
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
        <div className='table-title'>黑名单表</div>
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
              record.id == activeIndex?.id ? 'active' : ''
            }
            pagination={false}
            scroll={{ y: 450 }}
          />
        </ConfigProvider>
      </div>
      <AddDialog ref={dialogRef} onSearch={search} />
    </section>
  )
}
