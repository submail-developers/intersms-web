import React, { ReactNode, useState } from 'react';
import { Button, Select, Form, Input, DatePicker, ConfigProvider, Table, Tooltip, Grid, Col, Row, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import './index.scss'

interface DataType {
  key: number
  country: string
  price: string
  type: string
}

// 国家价格配置
export default () => {
  const columns: ColumnsType<DataType> = [
    {
      title: '国家名',
      dataIndex: 'country',
      width: 120,
    },
    {
      title: '单价',
      dataIndex: 'price',
      width: 120,
      render: (_, record) => (
        <div>{record.price}</div>
      )
    },
    {
      title: '短信类型',
      dataIndex: 'type',
      render: (_, record) => (
        <div>{record.type}</div>
      )
    },
    {
      title: '操作',
      dataIndex: 'actions',
      render: (_, record) => (
        <div>
          <Button type='link' style={{paddingLeft: 0,paddingRight: 0}}>编辑</Button>
          <Button type='link'>删除</Button>
        </div>
      )

    }
  ];

  const data: DataType[] = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      key: i,
      country: `中国`,
      price: '0.08',
      type: '国际短信'
    });
  }

  const getCheckboxProps = (record: DataType) => {
    return ({
      name: record.country,
    })
  }

  return (
    <div data-class='account-config-table'>
      <ConfigProvider
        theme={{
          token: {
            colorBgContainer: '#fff'
          }
        }}
      >
        <Table
          columns={columns}
          dataSource={data}
          rowSelection={{
            type: 'checkbox',
            getCheckboxProps: getCheckboxProps
          }}
          sticky
          pagination={false}
          scroll={{ x: 'max-content'}}
        />

      </ConfigProvider>
    </div>
  )
}
