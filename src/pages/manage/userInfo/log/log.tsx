import { useEffect, useState, useRef } from 'react'
import { Table } from 'antd'
import { findDOMNode } from 'react-dom'
import type { ColumnsType } from 'antd/es/table'
import { API } from 'apis'
import { getLoginLog } from '@/api'
import { useThrottleFn } from 'ahooks'
import './log.scss'

interface DataType extends API.LoginLogItem {}

let page = 1
export default function Fn() {
  const scrollRef = useRef(null)
  const [tabData, settabData] = useState<API.LoginLogItem[]>([])
  const [loading, setloading] = useState(false)
  const [total, settotal] = useState(0)

  useEffect(() => {
    page = 1
    run()
  }, [])

  const getInfo = async (next = false) => {
    setloading(true)
    let p = next ? page + 1 : page
    const res = await getLoginLog({
      page: p,
      limit: 20,
    })
    if (res.data.length > 0) {
      settabData([...tabData, ...res.data])
      if (next) page += 1
    }
    settotal(res.total)
    setloading(false)
  }

  const { run } = useThrottleFn(getInfo, {
    wait: 2000,
  })

  const scrollEvent = () => {
    // 如果正在加载数据中，不重复进行操作
    if (loading || total <= tabData.length) return

    // 获取表格dom元素
    const table = findDOMNode(scrollRef.current)
    const tableBody = (table as Element)?.querySelector('.ant-table-body')

    // 容器可视区高度
    const tableBodyHeight: number = tableBody?.clientHeight
      ? tableBody?.clientHeight
      : 0

    // 内容高度
    const contentHeight = tableBody?.scrollHeight ? tableBody?.scrollHeight : 0

    // 距离顶部的高度
    const toTopHeight = tableBody?.scrollTop ? tableBody?.scrollTop : 0

    // 当距离底部只有1时，重新获取数据
    if (contentHeight - (toTopHeight + tableBodyHeight) <= 200) {
      // 如果当前页数据大于等于总页数，则代表没有数据了
      run(true)
    }
  }

  const columns: ColumnsType<DataType> = [
    {
      title: '日期',
      dataIndex: 'datetime',
      className: 'pdL16',
      width: 170,
    },
    {
      title: '地点',
      dataIndex: 'city',
      width: 100,
    },
    {
      title: '浏览器',
      dataIndex: 'agent',
      width: 100,
    },
    {
      title: '操作系统',
      dataIndex: 'platform',
      width: 100,
    },
    {
      title: 'IP 地址',
      dataIndex: 'ip',
      width: 100,
    },
  ]
  return (
    <div data-class='user-log'>
      <b className='title'>登陆日志</b>
      <div onScrollCapture={scrollEvent}>
        <Table
          className='theme-cell log-tab'
          columns={columns}
          dataSource={tabData}
          sticky
          pagination={false}
          rowKey={'datetime'}
          scroll={{ x: 'max-content', y: 400 }}
          ref={(c) => {
            scrollRef.current = c
          }}
          loading={page == 1 && loading}
        />
      </div>
    </div>
  )
}
