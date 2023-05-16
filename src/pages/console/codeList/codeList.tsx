// 状态码对照表
import { useEffect, useState, MutableRefObject, useRef } from 'react'
import { ConfigProvider, Table, Row, Col } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import AddDialog from './dialog/addDialog'
import MenuTitle from '@/components/menuTitle/menuTitle'
import { API } from 'apis'
import './codeList.scss'

interface DataType {
  id: string
  error_code: string
  error_message: string
  code_type: string
  type: string
  update_time: string
}

// 国家信息配置
export default function CodeList() {
  const addDialogRef: MutableRefObject<any> = useRef(null)

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

  const columns: ColumnsType<DataType> = [
    {
      title: '错误码',
      dataIndex: 'error_code',
      className: 'paddingL30',
      width: 200,
    },
    {
      title: '错误信息',
      dataIndex: 'error_message',
    },
    {
      title: '错误码类型',
      dataIndex: 'code_type',
    },
    {
      title: '类型',
      dataIndex: 'type',
    },
    {
      title: '最后更新时间',
      dataIndex: 'update_time',
      width: 200,
    },
  ]

  const data: DataType[] = []
  for (let i = 0; i < 100; i++) {
    data.push({
      id: 'id' + i,
      error_code: '111',
      error_message: '中国' + i,
      code_type: 'CN',
      type: '公开',
      update_time: '2023-09-09 12:21:32',
    })
  }

  const updateCountryEvent = () => {
    addDialogRef.current.open()
  }

  return (
    <div data-class='codeList'>
      <MenuTitle title='状态码对照表'></MenuTitle>
      <Row justify='space-between' wrap align={'bottom'}>
        <Col>
          <div className='btn-group' style={{ marginBottom: '10px' }}>
            <div className='btn' onClick={updateCountryEvent}>
              <i className='icon iconfont icon-bianji'></i>
              <span>新增</span>
            </div>
            <div className='btn' onClick={updateCountryEvent}>
              <i className='icon iconfont icon-bianji'></i>
              <span>编辑</span>
            </div>
            <div className='btn delete'>
              <i className='icon iconfont icon-bianji'></i>
              <span>删除</span>
            </div>
          </div>
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
