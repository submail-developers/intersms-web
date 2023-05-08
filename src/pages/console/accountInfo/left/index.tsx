import { ReactNode, useState } from 'react'
import { Button, Input, ConfigProvider, Table, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'

import { useSize } from '@/hooks'

import './index.scss'

interface DataType {
  key: number
  email: string
  address: string
}

// 客户信息
export default function Left() {
  const size = useSize()

  const columns: ColumnsType<DataType> = [
    {
      title: 'email',
      dataIndex: 'email',
    },
    {
      title: 'address',
      dataIndex: 'address',
      render: (_, record) => <div className='gray'>{record.address}</div>,
    },
  ]

  const data: DataType[] = []
  for (let i = 0; i < 100; i++) {
    data.push({
      key: i,
      email: `1581234123${i}`,
      address: '深圳市宝安区递意货运代理点',
    })
  }

  const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | string[]>(
    [],
  )
  const rowSelection = {
    selectedRowKeys,
    onChange: () => {},
    renderCell: (
      checked: boolean,
      record: DataType,
      index: number,
      originNode: ReactNode,
    ) => {
      return originNode
    },
  }
  // 点击整行选择
  const onSelectRow = (record: DataType) => {
    setSelectedRowKeys([record.key])
  }

  return (
    <section
      data-class='account-left'
      className='fx-shrink'
      style={{ minWidth: `${size === 'small' ? '100%' : '510px'}` }}>
      <Space.Compact size={size}>
        <Button
          type='primary'
          icon={<i className={`icon iconfont icon-xinzeng ${size}`} />}>
          新增
        </Button>
        <Button
          type='primary'
          danger
          icon={<i className={`icon iconfont icon-shanchu ${size}`} />}>
          删除
        </Button>
      </Space.Compact>
      <div className='filter-wrap fx-col'>
        <div className='input-wrap'>
          <Input
            bordered={false}
            placeholder='请输入关键字过滤'
            suffix={
              <i
                className='icon iconfont icon-sousuo fn12'
                style={{ color: '#888', cursor: 'pointer' }}></i>
            }
            style={{
              height: '38px',
              borderBottom: '1px solid #E7E7E6',
              borderRadius: 0,
            }}
          />
        </div>
        <div className='table-title'>全部客户</div>
        <div className='table-wrap fx-shrink'>
          <ConfigProvider
            theme={{
              token: {
                colorBgContainer: 'transparent',
              },
            }}>
            <Table
              size={size}
              showHeader={false}
              columns={columns}
              dataSource={data}
              rowSelection={rowSelection}
              onRow={(record) => ({
                onClick: () => onSelectRow(record),
              })}
              pagination={false}
              scroll={{ x: 'max-content', y: 510 }}
            />
          </ConfigProvider>
        </div>
      </div>
    </section>
  )
}
