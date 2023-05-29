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
      await deleteAccountChannel({ id: selectedRowKeys.join(',') })
      setSelectedRowKeys([])
      message.success('删除成功')
      updateTableData()
    } catch (error) {}
  }

  const rowSelection = {
    columnWidth: 60,
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
      title: '国家/地区',
      dataIndex: 'country_cn',
      width: 200,
      ellipsis: true,
    },
    {
      title: '通道组',
      dataIndex: 'group_name',
    },
    {
      title: '短信类型',
      dataIndex: 'group_type',
      render: (_, record) => <>{record.group_type == '1' ? '行业' : '营销'}</>,
    },
    {
      title: '签名',
      dataIndex: 'signature',
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
            placement='left'
            title='警告'
            description='确定删除该配置吗？'
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
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      </ConfigProvider>
    </div>
  )
}

export default forwardRef(Channel)
