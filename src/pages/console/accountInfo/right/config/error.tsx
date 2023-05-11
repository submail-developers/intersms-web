import { Button, ConfigProvider, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'

import { useEffect } from 'react'

interface DataType {
  appid: string
  region_code: string
  sms_type: string
  response_time: string
  delivrd: string
  undeliv: string
  expired: string
  accepted: string
  unknown: string
  rejected: string
  spname: string
}

type Props = {
  accountId: string
}

// 国家价格配置
export default function Error(props: Props) {
  useEffect(() => {
    console.log(props.accountId, 'accountid')
  }, [props.accountId])
  const columns: ColumnsType<DataType> = [
    {
      title: 'appid',
      dataIndex: 'appid',
    },
    {
      title: 'region_code',
      dataIndex: 'region_code',
    },
    {
      title: 'sms_type',
      dataIndex: 'sms_type',
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
      render: (_, record) => (
        <div>
          <Button type='link' style={{ paddingLeft: 0, paddingRight: 0 }}>
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
      appid: `id` + i,
      region_code: 'string',
      sms_type: 'string',
      response_time: 'string',
      delivrd: 'string',
      undeliv: 'string',
      expired: 'string',
      accepted: 'string',
      unknown: 'string',
      rejected: 'string',
      spname: 'string',
    })
  }

  const getCheckboxProps = (record: DataType) => {
    return {
      name: record.appid,
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
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      </ConfigProvider>
    </div>
  )
}
