import { Button, ConfigProvider, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'

import { useEffect } from 'react'

interface DataType {
  appid: string
  country: string
  channel_group: string
  type: string
  sign: string
  price: string
  warning: string
}

type Props = {
  accountId: string
}

// 国家价格配置
export default function Channel(props: Props) {
  useEffect(() => {
    console.log(props.accountId, 'accountid')
  }, [props.accountId])
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
      dataIndex: 'country',
    },
    {
      title: '通道组',
      dataIndex: 'channel_group',
    },
    {
      title: '短信类型',
      dataIndex: 'type',
    },
    {
      title: '签名',
      dataIndex: 'sign',
    },
    {
      title: '价格提醒',
      dataIndex: 'price',
    },
    {
      title: '提醒配置',
      dataIndex: 'warning',
    },
    {
      title: '操作',
      dataIndex: 'actions',
      width: 140,
      render: (_, record) => (
        <div>
          <Button type='link' style={{ paddingLeft: 0 }}>
            编辑
          </Button>
          <Button type='link'>删除</Button>
        </div>
      ),
    },
  ]

  const data: DataType[] = []
  for (let i = 0; i < 10; i++) {
    data.push({
      appid: 'string' + i,
      country: 'string',
      channel_group: 'string',
      type: 'string',
      sign: 'string',
      price: 'string',
      warning: 'string',
    })
  }

  const getCheckboxProps = (record: DataType) => {
    return {
      name: record.country,
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
          rowSelection={{
            type: 'checkbox',
            getCheckboxProps: getCheckboxProps,
          }}
          rowKey={'appid'}
          sticky
          scroll={{ x: 'max-content' }}
        />
      </ConfigProvider>
    </div>
  )
}
