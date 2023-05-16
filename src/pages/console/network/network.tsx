import { useEffect, useState, MutableRefObject, useRef } from 'react'
import { Button, Form, Input, ConfigProvider, Table, Row, Col } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import AddDialog from './dialog/addDialog'
import MenuTitle from '@/components/menuTitle/menuTitle'
import type { Dayjs } from 'dayjs'
import { useSize } from '@/hooks'
import { API } from 'apis'

import './network.scss'

interface DataType {
  id: string
  net_name: string
  country_name: string
  country_code: string
  area_name: string
  price1: string
  price2: string
}
interface FormValues {
  channel: string
  group: string
  time: [Dayjs, Dayjs] | null
  keyword: string
}

// 国家信息配置
export default function Network() {
  const addDialogRef: MutableRefObject<any> = useRef(null)
  const size = useSize()
  const [form] = Form.useForm()

  // 被点击的客户(不是被checkbox选中的客户)
  const [activeIndex, setactiveIndex] = useState<number>()
  // 选中的keys
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const onRow = (record: DataType, index?: number) => {
    return {
      onClick: () => {
        setactiveIndex(index)
      },
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

  const onFinish = (values: FormValues) => {}

  const columns: ColumnsType<DataType> = [
    {
      title: '运营商网络',
      dataIndex: 'net_name',
      width: 180,
      className: 'paddingL30',
      ellipsis: true,
      render: (_, record) => (
        <span className='color'>{record.country_name}</span>
      ),
    },
    {
      title: '国家名称',
      dataIndex: 'country_name',
      width: 180,
      ellipsis: true,
    },
    {
      title: '国家代码',
      dataIndex: 'country_code',
    },
    {
      title: '地区名称',
      dataIndex: 'area_name',
    },
    {
      title: '成本价格',
      dataIndex: 'price1',
    },
    {
      title: '建议零售价格',
      dataIndex: 'price2',
    },
    {
      title: '操作',
      width: 140,
      render: (_, record) => (
        <div>
          <Button
            type='link'
            style={{ paddingLeft: 0 }}
            onClick={() => updateCountryEvent(false, record)}>
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
      id: 'id' + i,
      net_name: 'Chain',
      country_name: '中国' + i,
      country_code: 'CN',
      area_name: '+86',
      price1: '0.0500',
      price2: '0.0500',
    })
  }

  const updateCountryEvent = (isAdd: boolean = true, record?: DataType) => {
    addDialogRef.current.open({ isAdd, record })
  }

  return (
    <div data-class='network'>
      <MenuTitle title='网络信息配置'></MenuTitle>
      <Row justify='space-between' wrap align={'bottom'}>
        <Col>
          <div className='btn-group' style={{ marginBottom: '10px' }}>
            <div className='btn' onClick={() => updateCountryEvent()}>
              <i className='icon iconfont icon-bianji'></i>
              <span>新增</span>
            </div>
            <div className='btn delete'>
              <i className='icon iconfont icon-bianji'></i>
              <span>删除</span>
            </div>
          </div>
        </Col>
        <Col>
          <ConfigProvider
            theme={{
              token: {
                controlHeight: 40,
              },
            }}>
            <Form
              name='basic'
              form={form}
              initialValues={{ channels_type: 'all' }}
              layout='inline'
              wrapperCol={{ span: 24 }}
              onFinish={onFinish}
              autoComplete='off'>
              <Form.Item label='' name='country' style={{ marginBottom: 10 }}>
                <Input
                  size={size}
                  placeholder='网络名称/国家/国家代码'
                  maxLength={20}
                  style={{ width: 220 }}></Input>
              </Form.Item>
              <Form.Item style={{ marginBottom: 10 }}>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: '#ff5e2d',
                      colorPrimaryHover: '#ff5e2d',
                    },
                  }}>
                  <Button
                    type='primary'
                    size={size}
                    htmlType='submit'
                    style={{ width: 110, marginLeft: 0 }}>
                    搜索
                  </Button>
                </ConfigProvider>
              </Form.Item>
            </Form>
          </ConfigProvider>
        </Col>
      </Row>
      <ConfigProvider
        theme={{
          token: {
            colorBgContainer: 'transparent',
          },
        }}>
        <Table
          className='theme-cell bg-white reset-table'
          columns={columns}
          dataSource={data}
          rowKey={'id'}
          onRow={onRow}
          rowSelection={rowSelection}
          rowClassName={(record, index) =>
            index == activeIndex ? 'active' : ''
          }
          sticky
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      </ConfigProvider>
      <AddDialog ref={addDialogRef} />
    </div>
  )
}
