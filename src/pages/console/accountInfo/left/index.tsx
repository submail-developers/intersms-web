import { useAppDispatch, useAppSelector } from '@/store/hook'
import {
  changeActiveAccount,
  accountInfoState,
} from '@/store/reducers/accountInfo'
import {
  useState,
  useEffect,
  useRef,
  MutableRefObject,
  forwardRef,
  useImperativeHandle,
} from 'react'
import {
  Input,
  ConfigProvider,
  Table,
  Popconfirm,
  App,
  Tooltip,
  Form,
} from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import AddDialog from './addDialog/addDialog'
import { usePoint } from '@/hooks'
import { getAccountList, deleteAccount } from '@/api'
import { API } from 'apis'
import './index.scss'
import { useSearchParams } from 'react-router-dom'

interface DataType extends API.AccountListItem {}
interface FormValues {
  page: string
  limit: string
}
/**
 * 客户信息
 */
function Left(props: any, ref: any) {
  useImperativeHandle(ref, () => {
    return {
      forceSearch: () => search(accountInfoStore.activeAccount?.account),
    }
  })
  const accountInfoStore = useAppSelector(accountInfoState)
  const dialogRef: MutableRefObject<any> = useRef(null)
  const tableContainerRef: MutableRefObject<any> = useRef(null)
  const { message } = App.useApp()
  const dispatch = useAppDispatch()
  const point = usePoint('xl')
  const [form] = Form.useForm()
  const [tableData, settableData] = useState<API.AccountListItem[]>([]) // table列表
  const [loading, setloading] = useState(false)
  const [activeRow, setactiveRow] = useState<DataType | null>(null) // 被点击的客户(不是被checkbox选中的客户)
  const [peopelNum, setpeopelNum] = useState<number>() //客户数量
  const [tableHeight, setTableHeight] = useState<number>(474) // table高度
  const [params] = useSearchParams()
  const account = params.get('sender')
  const [total, settotal] = useState<number>(0)
  const [page, setpage] = useState<number>(1)
  const [pageSize, setpageSize] = useState<number>(200)

  const onRow = (record: DataType, index?: number) => {
    return {
      onClick: () => {
        setactiveRow(record)
        dispatch(changeActiveAccount(record))
      },
    }
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'sender',
      dataIndex: 'sender',
      className: 'paddingL30',
      ellipsis: true,
      width: '45%',
      render: (_, record) => (
        <Tooltip title={record.sender}>
          <span>{record.sender}</span>
        </Tooltip>
      ),
    },
    {
      title: 'info_path',
      ellipsis: true,
      width: '10%',
      render: (_, record) => (
        <span className='color-gray'>
          <a
            href={record.info_path}
            target='_blank'
            className='icon iconfont icon-tiaozhuan color-gray'></a>{' '}
        </span>
      ),
    },
    {
      title: 'account',
      className: 'paddingL30',
      ellipsis: true,
      width: '45%',
      render: (_, record) => <span className='color-gray'>{record.name}</span>,
    },

    {
      title: 'qizi',
      width: '10%',
      align: 'right',
      render: (_, record) => (
        <div className='qizi-wrap'>
          <div className='qizi'>
            {record.test_flg == '1' ? (
              <span
                className='icon iconfont icon-a-biaoji2'
                title='测试用户'></span>
            ) : (
              <></>
            )}
          </div>
        </div>
      ),
    },
  ]

  useEffect(() => {
    search('', account)
    return () => {
      dispatch(changeActiveAccount(null))
    }
  }, [account])
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
    if (account && tableData.length > 0) {
      const record = tableData.find((item) => item.sender == account)
      setactiveRow(record)
      dispatch(changeActiveAccount(record))
    }
  }, [account, tableData])

  const search = async (activeAccountId: string = '', account: string = '') => {
    try {
      setloading(true)
      const values = await form.validateFields()
      const { keyword } = values
      const res = await getAccountList({
        keyword,
        page,
        limit: pageSize,
      })
      setpeopelNum(res.total)
      settableData(res.data)
      settotal(res.total)
      setloading(false)

      if (res.data.length > 0) {
        let defaultIndex = 0
        if (activeAccountId) {
          defaultIndex = res.data.findIndex(
            (item) => item.account == activeAccountId,
          )
        }
        if (!account) {
          dispatch(changeActiveAccount(res.data[defaultIndex]))
          setactiveRow(res.data[defaultIndex])
        }
      } else {
        dispatch(changeActiveAccount(null))
        setactiveRow(null)
      }
    } catch (error) {
      setloading(false)
    }
  }

  // 删除事件
  const deleteEvent = async () => {
    if (activeRow) {
      await deleteAccount({ account: activeRow.account })
      await search()
      message.warning('删除成功！')
    } else {
      message.warning('请选择客户！')
    }
  }
  // 开启dialog
  const openAddDialog = () => {
    dialogRef.current.open()
  }
  useEffect(() => {
    search()
  }, [page, pageSize])
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
    showSizeChanger: false,
    defaultPageSize: 200,
    // pageSizeOptions: [200],
    showTotal: (total, range) => `共 ${total} 条`,
  }

  return (
    <section data-class='account-left' className={`${point ? '' : 'xl'}`}>
      <div className='btn-group'>
        <div className='btn' onClick={openAddDialog}>
          <i className='icon iconfont icon-xinzeng'></i>
          <span>新增</span>
        </div>
        <Popconfirm
          placement='bottom'
          title='警告'
          description='确定删除选中的客户吗？'
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
          <Form
            name='search-form'
            id='search-form'
            form={form}
            style={{ width: '100%' }}>
            <Form.Item
              label=''
              name='keyword'
              validateTrigger='onSubmit'
              style={{ marginBottom: '0' }}>
              <Input
                bordered={false}
                placeholder='请输入关键字过滤'
                allowClear
                autoComplete='off'
                suffix={
                  <i
                    onClick={() => search()}
                    className='icon iconfont icon-sousuo fn12'
                    style={{ color: '#888', cursor: 'pointer' }}></i>
                }
                onPressEnter={() => search()}
                style={{
                  height: '38px',
                  borderBottom: '1px solid #E7E7E6',
                  borderRadius: 0,
                }}
              />
            </Form.Item>
          </Form>
          <div className='table-title' style={{ marginTop: '14px' }}>
            全部客户 ({peopelNum})
          </div>
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
              rowKey={'account'}
              onRow={onRow}
              rowClassName={(record, index) =>
                record.account == activeRow?.account ? 'active' : ''
              }
              size='small'
              // pagination={{ position: ['bottomRight'] }}
              pagination={pagination}
              scroll={{ y: tableHeight }}
              loading={loading}
            />
          </ConfigProvider>
        </div>
      </div>
      <AddDialog ref={dialogRef} onSearch={search} />
    </section>
  )
}

export default forwardRef(Left)
