import { Button, ConfigProvider, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import AccessCountryDrawer from '../dialog/accessCountry'
import { useEffect, MutableRefObject, useRef, useState } from 'react'

interface DataType {
  id: string
  channel_name: string
  access_type: string
  channel_group: string
  speed: string
  prefix: string
}

type Props = {
  accountId: string
}

// 国家价格配置
export default function Channel(props: Props) {
  const drawerRef: MutableRefObject<any> = useRef(null)

  // 选中的keys
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
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
  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys)
    },
  }

  useEffect(() => {
    console.log(props.accountId, 'accountid')
  }, [props.accountId])

  const openDrawer = () => {
    drawerRef.current.open()
  }
  const columns: ColumnsType<DataType> = [
    {
      title: <div style={{ marginLeft: '20px' }}>通道名</div>,
      render: (_, record) => (
        <div style={{ marginLeft: '20px' }}>{record.channel_name}</div>
      ),
    },
    {
      title: '接入类型',
      dataIndex: 'access_type',
    },
    {
      title: '通道类型',
      dataIndex: 'channel_group',
    },
    {
      title: '流速',
      render: (_, record) => (
        <div style={{ color: '#e81f1f' }}>{record.speed}</div>
      ),
    },
    {
      title: '号码前缀',
      dataIndex: 'prefix',
    },
    {
      title: '关联国家',
      dataIndex: 'actions',
      render: (_, record) => (
        <div>
          <Button
            type='link'
            style={{ paddingLeft: 0, paddingRight: 0 }}
            onClick={openDrawer}>
            关联国家
          </Button>
        </div>
      ),
    },
  ]

  const data: DataType[] = []
  for (let i = 0; i < 10; i++) {
    data.push({
      id: 'string' + i,
      channel_name: 'string' + i,
      access_type: 'string',
      channel_group: 'string',
      speed: '1000/s',
      prefix: 'string',
    })
  }

  const getCheckboxProps = (record: DataType) => {
    return {
      name: record.channel_name,
    }
  }

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
          dataSource={data}
          rowKey={'id'}
          onRow={onRow}
          rowSelection={rowSelection}
          sticky
          scroll={{ x: 'max-content' }}
        />
      </ConfigProvider>
      <AccessCountryDrawer ref={drawerRef} />
    </div>
  )
}
