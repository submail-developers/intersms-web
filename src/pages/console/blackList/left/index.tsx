import { useAppDispatch } from '@/store/hook'
import { changeActiveBlack } from '@/store/reducers/black'
import { useState, useEffect, useRef, MutableRefObject } from 'react'
import { ConfigProvider, Table, Switch, Popconfirm, App } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import AddDialog from './addDialog/addDialog'

import { usePoint } from '@/hooks'
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
  const point = usePoint('xl')
  const tableContainerRef: MutableRefObject<any> = useRef(null)
  // 列表
  const [tableData, settableData] = useState<API.GetBlackListItems[]>([])
  // 被点击的客户(不是被checkbox选中的客户)
  const [activeIndex, setactiveIndex] = useState<DataType | null>(null)
  const [blackNum, setblackNum] = useState<number>() //通道组数量
  const [tableHeight, setTableHeight] = useState<number>(474) // table高度
  const onRow = (record: DataType, index?: number) => {
    return {
      onClick: () => {
        setactiveIndex(record)
        dispatch(changeActiveBlack(record))
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
  useEffect(() => {
    // 获取tableContainer的内容区宽高
    const observer = new ResizeObserver(([entry]) => {
      setTableHeight(() => entry.contentRect.height - 80) // table 的滚动高度
    })
    if (point) {
      observer.observe(tableContainerRef?.current)
    } else {
      setTableHeight(474)
      if (tableContainerRef?.current)
        observer.unobserve(tableContainerRef?.current)
    }
    return () => {
      if (tableContainerRef?.current)
        observer.unobserve(tableContainerRef?.current)
    }
  }, [point])
  const search = async (noResetActive?: boolean) => {
    const res = await getBlackList({
      id: '',
      page: '1',
    })
    settableData(res.data)
    setblackNum(res.data.length)
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
    <section data-class='account-left' className={`${point ? '' : 'xl'}`}>
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
      <div className='filter-container' ref={tableContainerRef}>
        <div className='filter-wrap fx-col'>
          <div className='table-title'>黑名单表 ({blackNum})</div>
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
              scroll={{ y: tableHeight }}
            />
          </ConfigProvider>
        </div>
      </div>
      <AddDialog ref={dialogRef} onSearch={search} />
    </section>
  )
}
