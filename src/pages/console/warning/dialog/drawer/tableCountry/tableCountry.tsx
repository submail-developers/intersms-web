import { useState, forwardRef, useImperativeHandle, useEffect } from 'react'
import { TableColumnsType, Popconfirm } from 'antd'
import { Form, Input, Table, Button } from 'antd'
import '@/style/drawerTable.scss'
import {} from '@/api'
import { API } from 'apis'
import { usePoint, useSize } from '@/hooks'

import type { DrawerContentRectType } from '../drawer'
type PointTablePopsType = {
  virtual: boolean
  scroll: {
    x: number | string
    y?: number | string
  }
}

interface DataType extends API.GetAlarmNotifierItems {}
interface EnbledProps {
  region_code: string
  checked: boolean
  disabled: boolean
  network_id: string
  channelId: string
  search: () => void
}

interface Props {
  loading: boolean
  tabData: DataType[]
  drawerContentRect: DrawerContentRectType
  search: () => void
  showTableLoading: () => void
}

function MyTable(props: Props, ref: any) {
  const point = usePoint('xl')
  useImperativeHandle(ref, () => {
    return {
      // cancel,
    }
  })
  const [form] = Form.useForm()
  const size = useSize()
  const [pointTablePops, setpointTablePops] = useState<PointTablePopsType>({
    virtual: true,
    scroll: { ...props.drawerContentRect },
  })

  // pc端使用虚拟表格，移动端不使用。原因：移动端虚拟表格无法左右滑动
  useEffect(() => {
    if (size == 'middle') {
      setpointTablePops({
        virtual: true,
        scroll: { ...props.drawerContentRect },
      })
    } else {
      setpointTablePops({
        virtual: false,
        scroll: { x: 'fit-content' },
      })
    }
  }, [size, props.drawerContentRect])

  const columns: TableColumnsType<DataType> = [
    {
      title: '手机号码',
      className: 'paddingL10',
      fixed: true,
      width: point ? 130 : 110,
      render(_, record) {
        return <div className={`td-content fw500`}>{record.mob}</div>
      },
    },
    {
      title: '姓名',
      width: 80,
      className: 'paddingL30',
      render(_, record) {
        return <div className={`td-content`}>{record.name}</div>
      },
    },

    {
      title: '操作',
      width: 120,

      render(_, record) {
        return (
          <Button type='link' style={{ padding: '0', marginTop: '9px' }}>
            <Popconfirm
              placement='left'
              title='警告'
              description='确定删除该条报警人员吗？'
              // onConfirm={() => singleDeleteEvent(record.mob)}
              okText='确定'
              cancelText='取消'>
              删除
            </Popconfirm>
          </Button>
        )
      },
    },
  ]

  return (
    <Form component={false} form={form}>
      <Table
        className='drawer-table'
        columns={columns}
        dataSource={props.tabData}
        pagination={false}
        rowKey={'id'}
        // rowClassName={(record, index) => {
        // return record.country_enabled == '0' ? 'lock-row' : ''
        // }}
        loading={props.loading}
        {...pointTablePops}
      />
    </Form>
  )
}
export default forwardRef(MyTable)
