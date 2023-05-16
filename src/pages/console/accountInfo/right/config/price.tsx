import { Button, ConfigProvider, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'

import { useEffect } from 'react'

interface DataType {
  key: number
  country: string
  price: string
  type: string
}

type Props = {
  accountId: string
}

// 国家价格配置
export default function Price(props: Props) {
  useEffect(() => {
    console.log(props.accountId, 'accountid')
  }, [props.accountId])
  const columns: ColumnsType<DataType> = [
    {
      title: <div style={{ marginLeft: '20px' }}>国家名</div>,
      dataIndex: 'country',
      render: (_, record) => (
        <div style={{ marginLeft: '20px' }}>{record.country}</div>
      ),
    },
    {
      title: '单价',
      dataIndex: 'price',
      render: (_, record) => <div>{record.price}</div>,
    },
    {
      title: '短信类型',
      dataIndex: 'type',
      render: (_, record) => <div>{record.type}</div>,
    },
    {
      title: '操作',
      dataIndex: 'actions',
      width: '25%',
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
  for (let i = 0; i < 100; i++) {
    data.push({
      key: i,
      country: `中国`,
      price: '0.08',
      type: '国际短信',
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
          sticky
          pagination={{ position: ['bottomRight'] }}
          scroll={{ x: 'max-content' }}
        />
      </ConfigProvider>
    </div>
  )
}
