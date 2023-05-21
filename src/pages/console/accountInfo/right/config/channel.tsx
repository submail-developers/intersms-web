import { useImperativeHandle, forwardRef, useState, useEffect } from 'react'
import { Button, ConfigProvider, App, Table, Popconfirm } from 'antd'
import { useAppSelector } from '@/store/hook'
import { accountInfoState } from '@/store/reducers/accountInfo'
import type { ColumnsType } from 'antd/es/table'
import { getAccountChannelList, deleteAccountChannel } from '@/api'
import { API } from 'apis'

interface DataType extends API.AccountChannelItem {}

type Props = {
  activeKey: string
  selfKey: string
  showEdit: (params: DataType) => void
}

// 国家价格配置
function Channel(props: Props, ref: any) {
  useImperativeHandle(ref, () => {
    return {
      updateTableData, // 更行table
      getRowSelectKeys, // 获取选中的rowKey
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
      const res = await getAccountChannelList({
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
      await deleteAccountChannel({ id })
      message.success('删除成功')
      updateTableData()
    } catch (error) {}
  }

  const getRowSelectKeys = () => {
    return selectedRowKeys
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
      title: <div style={{ marginLeft: '20px' }}>Appid</div>,
      dataIndex: 'appid',
      render: (_, record) => (
        <div style={{ marginLeft: '20px' }}>{record.appid}</div>
      ),
    },
    {
      title: '国家',
      dataIndex: 'country_cn',
    },
    {
      title: '通道组',
      dataIndex: 'group_id',
    },
    {
      title: '短信类型',
      dataIndex: 'group_type',
    },
    {
      title: '签名',
      dataIndex: 'signature',
    },
    {
      title: '价格提醒',
      render: (_, record) => <div>没有字段</div>,
    },
    {
      title: '提醒配置',
      render: (_, record) => <div>没有字段</div>,
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
    <div data-class='account-config-table'>
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

export default forwardRef(Channel)
