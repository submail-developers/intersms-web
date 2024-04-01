import { useAppDispatch, useAppSelector } from '@/store/hook'
import { changeActiveChannels } from '@/store/reducers/channels'
import { useState, useEffect, useRef, MutableRefObject } from 'react'
import {
  Input,
  ConfigProvider,
  Table,
  Switch,
  Popconfirm,
  App,
  Button,
  Dropdown,
  Space,
  Tooltip,
} from 'antd'
import { PaperClipOutlined } from '@ant-design/icons'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
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
interface FormValues {
  page: string
  limit: string
}
/**
 * 客户信息
 */
export default function Left() {
  const dialogRef: MutableRefObject<any> = useRef(null)
  const bindSensitiveWordDialogRef: MutableRefObject<any> = useRef(null)
  const bindBlackDialogRef: MutableRefObject<any> = useRef(null)
  const tableContainerRef: MutableRefObject<any> = useRef(null)
  const { message } = App.useApp()
  const dispatch = useAppDispatch()
  const point = usePoint('xl')
  const [keyword, setkeyword] = useState<string>('')
  const [channelsNum, setchannelsNum] = useState<number>() //通道组数量
  const [tableHeight, setTableHeight] = useState<number>(474) // table高度
  const [total, settotal] = useState<number>(0)
  const [page, setpage] = useState<number>(1)
  const [pageSize, setpageSize] = useState<number>(200)
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
      width: 230,
      ellipsis: true,
    },
    {
      title: '敏感词&黑名单',
      width: 60,
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
            <div className='sens-word g-ellipsis'>
              {sens_word && (
                <Tooltip title={sens_word}>
                  <i
                    style={{ border: '0', paddingRight: '0' }}
                    className='icon iconfont icon-guanjianci'></i>{' '}
                  &nbsp; &nbsp;
                </Tooltip>
              )}
              {/* </div>
            <div className='black-word g-ellipsis' title={block_name}> */}
              {block_name && (
                <Tooltip title={block_name}>
                  <i
                    style={{ border: '0' }}
                    className='icon iconfont icon-heimingdan'></i>
                </Tooltip>
              )}
            </div>
          </div>
        )
      },
    },
    {
      title: '状态',
      width: 40,
      render: (_, record) => <SwitchNode record={record}></SwitchNode>,
    },
  ]

  const setValue = (e: any) => {
    setkeyword(e.target.value)
  }

  useEffect(() => {
    // search()
    return () => {
      // 清除副作用，切换到其他页面时清空store
      dispatch(changeActiveChannels(null))
      setactiveRow(null)
    }
  }, [keyword])
  useEffect(() => {
    // 获取tableContainer的内容区宽高
    const observer = new ResizeObserver(([entry]) => {
      setTableHeight(() => entry.contentRect.height - 164) // table 的滚动高度
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

  useEffect(() => {
    search()
  }, [page, pageSize])
  // noResetActive是否重置当前选中项
  const search = async (noResetActive?: boolean) => {
    try {
      const res = await getChannelGroupList({
        id: '',
        keyword,
        page,
        limit: pageSize,
      })
      settableData(res.data)
      setchannelsNum(res.total)
      settotal(res.total)
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
  const onMenuClick = (e) => {
    // console.log('click', e)
    if (e.key == '1') {
      showBindSensDialog()
    } else if (e.key == '2') {
      showBindBlackDialog()
    }
  }
  const items = [
    {
      key: '1',
      label: '敏感词绑定',
      icon: <PaperClipOutlined rev={undefined} />,
    },
    {
      key: '2',
      label: '黑名单绑定',
      icon: <PaperClipOutlined rev={undefined} />,
    },
    // {
    //   key: '3',
    //   label: '模板套用绑定',
    //   icon: <PaperClipOutlined />,
    // },
  ]

  const changePage = async (_page: number, _pageSize: number) => {
    if (_page != page) setpage(_page)
    if (_pageSize != pageSize) {
      // pagesize由大到小切换时，此时tableData.length大于pagesize，会有个报错警告。解决掉这个警告
      if (_pageSize < pageSize) {
        settableData(tableData.slice(0, _pageSize))
      }
      setpageSize(_pageSize)
    }
  }
  const pagination: TablePaginationConfig = {
    current: page,
    position: ['bottomRight'],
    onChange: changePage,
    total: total,
    defaultPageSize: 200,
    // pageSizeOptions: [10, 20, 50, 100],
    showSizeChanger: false,
    // showQuickJumper: true, // 快速跳转
    showTotal: (total, range) => `共 ${total} 条`,
  }
  return (
    <section data-class='channels-left' className={`${point ? '' : 'xl'}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className='btn-group'>
          <div className='btn' onClick={openAddDialog}>
            <i className='icon iconfont icon-xinzeng'></i>
            <span>新增</span>
          </div>
          <div className='btn' onClick={editEvent}>
            <i className='icon iconfont icon-bianji'></i>
            <span>编辑</span>
          </div>
          {/*  <div className='btn' onClick={showBindSensDialog}>
            <i className='icon iconfont icon-bangding'></i>
            <span>敏感词绑定</span>
          </div>
         <div className='btn' onClick={showBindBlackDialog}>
            <i className='icon iconfont icon-bangding'></i>
            <span>黑名单绑定</span>
          </div> */}
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
        <div>
          <Space direction='vertical'>
            <Dropdown.Button
              menu={{
                items,
                onClick: onMenuClick,
              }}
              icon={<PaperClipOutlined rev={undefined} />}>
              &nbsp;绑定 &nbsp;
            </Dropdown.Button>
          </Space>
        </div>
      </div>
      <div className='filter-container' ref={tableContainerRef}>
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
          <div className='table-title'>全部通道组 ({channelsNum})</div>
          <ConfigProvider
            theme={{
              token: {
                colorBgContainer: 'transparent',
              },
            }}>
            <Table
              className='acc-table theme-cell bg-gray'
              showHeader={false}
              columns={columns}
              dataSource={tableData}
              rowKey={'id'}
              onRow={onRow}
              rowClassName={(record) =>
                record.id == activeRow?.id ? 'active' : ''
              }
              pagination={pagination}
              scroll={{ y: tableHeight }}
            />
          </ConfigProvider>
        </div>
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
