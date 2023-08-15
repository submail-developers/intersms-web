import {
  Button,
  Select,
  Form,
  Input,
  ConfigProvider,
  Table,
  Row,
  Col,
  Switch,
  Popconfirm,
  App,
} from 'antd'
import MenuTitle from '@/components/menuTitle/menuTitle'

export default function Fn() {
  return (
    <div data-class='warning'>
      <MenuTitle title='统计'></MenuTitle>
      <ConfigProvider
        theme={{
          token: {
            colorBgContainer: 'transparent',
          },
        }}>
        <Table
        // className='theme-cell bg-white reset-table'
        // columns={columns}
        // dataSource={tableData}
        // rowKey={'id'}
        // onRow={onRow}
        // rowSelection={rowSelection}
        // rowClassName={(record, index) =>
        //   index == activeIndex ? 'active' : ''
        // }
        // sticky
        // pagination={{ position: ['bottomRight'] }}
        // scroll={{ x: 'max-content' }}
        // loading={loading}
        />
      </ConfigProvider>
    </div>
  )
}
