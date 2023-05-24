import { useImperativeHandle, forwardRef, useState, useEffect } from 'react'
import { Button, ConfigProvider, App, Table, Popconfirm } from 'antd'
import { useAppSelector } from '@/store/hook'
import { accountInfoState } from '@/store/reducers/accountInfo'
import type { ColumnsType } from 'antd/es/table'
import { getAccountErrorList, deleteAccountError } from '@/api'
import { API } from 'apis'

interface DataType extends API.AccountErrorItem {}

type Props = {
  activeKey: string
  selfKey: string
  showEdit: (params: DataType) => void
}

// 失败处理配置
function Error(props: Props, ref: any) {
  useImperativeHandle(ref, () => {
    return {
      updateTableData, // 更行table
      deleteSelectEvent, // 获取选中的rowKey
    }
  })
  const [tableData, settableData] = useState<DataType[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const { message } = App.useApp()

  const accountInfoStore = useAppSelector(accountInfoState)
  useEffect(() => {
    if (props.activeKey == props.selfKey && accountInfoStore.activeAccount) {
      updateTableData()
    }
  }, [props.activeKey, accountInfoStore.activeAccount])
  // 修改客户后-清空选中项
  useEffect(() => {
    if (accountInfoStore.activeAccount) {
      setSelectedRowKeys([])
    }
  }, [accountInfoStore.activeAccount])
  const updateTableData = async () => {
    try {
      const res = await getAccountErrorList({
        sender: accountInfoStore.activeAccount?.account || '', // 客户account
        page: '1',
      })
      settableData(res.data)
    } catch (error) {}
  }
  // 编辑弹框
  const editEvent = (record: DataType) => {
    props.showEdit(record)
  }
  // 删除
  const deleteEvent = async (id: string) => {
    try {
      await deleteAccountError({ id })
      message.success('删除成功')
      setSelectedRowKeys(selectedRowKeys.filter((item) => item != id))
      updateTableData()
    } catch (error) {}
  }
  // 删除选中的
  const deleteSelectEvent = async () => {
    if (selectedRowKeys.length == 0) {
      message.warning('请选择要删除的配置项！')
      return
    }
    try {
      await deleteAccountError({ id: selectedRowKeys.join(',') })
      setSelectedRowKeys([])
      message.success('删除成功')
      updateTableData()
    } catch (error) {}
  }

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys)
    },
  }

  const onRow = (record: DataType, index?: number) => {
    return {
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
  const columns: ColumnsType<DataType> = [
    {
      title: 'appid',
      dataIndex: 'appid',
    },
    {
      title: '国家/地区名',
      render: (_, record) => <div>缺少该字段</div>,
    },
    {
      title: '短信类型',
      dataIndex: 'sms_type',
      render: (_, record) => (
        <div>{record.sms_type == '1' ? '短信通道组' : '营销通道组'}</div>
      ),
    },
    {
      title: 'response_time',
      dataIndex: 'response_time',
      width: 120,
    },
    {
      title: 'delivrd',
      dataIndex: 'delivrd',
    },
    {
      title: 'undeliv',
      dataIndex: 'undeliv',
    },
    {
      title: 'expired',
      dataIndex: 'expired',
    },
    {
      title: 'accepted',
      dataIndex: 'accepted',
    },
    {
      title: 'unknown',
      dataIndex: 'unknown',
    },
    {
      title: 'rejected',
      dataIndex: 'rejected',
    },
    {
      title: 'spname',
      dataIndex: 'spname',
    },
    {
      title: '操作',
      dataIndex: 'actions',
      width: 140,
      render: (_, record) => (
        <div>
          <Button
            type='link'
            style={{ paddingLeft: 0 }}
            onClick={() => editEvent(record)}>
            编辑
          </Button>
          <Popconfirm
            placement='bottom'
            title='警告'
            description='确定删除选中的客户吗？'
            onConfirm={() => deleteEvent(record.id)}
            okText='确定'
            cancelText='取消'>
            <Button type='link'>删除</Button>
          </Popconfirm>
        </div>
      ),
    },
  ]

  return (
    <div>
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
          rowKey={'id'}
          rowSelection={rowSelection}
          onRow={onRow}
          sticky
          pagination={{ position: ['bottomRight'] }}
          scroll={{ x: 'max-content' }}
        />
      </ConfigProvider>
    </div>
  )
}
export default forwardRef(Error)
