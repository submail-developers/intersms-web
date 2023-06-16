import { useState, useEffect } from 'react'
import { Input, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'

import { useSize } from '@/hooks'
import { getAccountList } from '@/api'
import { API } from 'apis'

interface DataType extends API.AccountListItem {}

import './numberAttribution.scss'
import MenuTitle from '@/components/menuTitle/menuTitle'

// 号码归属查询
export default function NumberAttr() {
  const size = useSize()
  const [keyword, setkeyword] = useState<string>('')
  // 列表
  const [tableData, settableData] = useState<API.AccountListItem[]>([])

  const columns: ColumnsType<DataType> = [
    {
      title: '国家/地区',
      ellipsis: true,
      width: 132,
      render: (_, record) => (
        <div style={{ width: 100 }} className='g-ellipsis'>
          中国
        </div>
      ),
    },
    {
      title: '国家/地区代码',
      width: 130,
      render: (_, record) => <div>CN</div>,
    },
    {
      title: '运营商',
      width: 120,
      render: (_, record) => <div>中国移动</div>,
    },
  ]

  useEffect(() => {
    search()
  }, [])

  const setValue = (e: any) => {
    setkeyword(e.target.value)
  }
  const search = async () => {
    const res = await getAccountList({
      keyword,
    })
    settableData(res.data)
  }

  return (
    <div data-class='numberAttribution'>
      <MenuTitle title='号码归属查询'></MenuTitle>
      <div className={`attr-wrap fx-col-start-center ${size}`}>
        <div className='title'>号码归属查询</div>
        <div className='sub-title'>查询号码所在国家、地区和网络信息</div>
        <div className='input-wrap'>
          <Input
            bordered={false}
            placeholder='请输入国家/地区/国家代码'
            maxLength={20}
            allowClear
            suffix={
              <i
                onClick={search}
                className='icon iconfont icon-sousuo fn14'
                style={{ color: '#888', cursor: 'pointer' }}></i>
            }
            onChange={setValue}
            onPressEnter={search}
            value={keyword}
            style={{
              height: '38px',
              borderBottom: '1px solid #E7E7E6',
              borderRadius: 0,
            }}
          />
        </div>
        <div className='table-wrap fx-shrink'>
          <Table
            className='reset-theme'
            columns={columns}
            dataSource={tableData}
            rowKey={'id'}
            pagination={false}
            scroll={{ y: 480, x: 'max-content' }}
          />
        </div>
      </div>
    </div>
  )
}
