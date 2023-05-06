
import { ReactNode, useState } from 'react';
import { Button, Select, Form, Input, DatePicker, ConfigProvider, Table, Tooltip, Grid } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import MenuTitle from '@/components/menuTitle/menuTitle';
import MyFormItem from '@/components/antd/myFormItem/myFormItem';
import day from 'dayjs';

import { useSize } from '@/hooks';

import './sendList.scss';


interface DataType {
  key: number;
  number: string;
  message: string;
  sendName: string;
  time: string;
  timer: string;
  return: string;
  country: string;
  route: string;
  routes: string;
  net: string;
  messageType: string;
  price: string;
}

// 发送列表
export default () => {
  const { Option } = Select
  const { RangePicker } = DatePicker

  const size = useSize()

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const changeTime = (value: any) => {
    console.log(value)
  }

  const columns: ColumnsType<DataType> = [
    {
      title: '号码',
      dataIndex: 'number',
      width: 150,
    },
    {
      title: '短信正文',
      dataIndex: 'message',
      width: 320,
      render: (_, record) => (
        <Tooltip title={record.message} placement="bottom">
          <div className='g-ellipsis-2'>{record.message}</div>
        </Tooltip>
      ),
    },
    {
      title: '发送名称',
      dataIndex: 'sendName',
      width: 100,
    },
    {
      title: '请求/完成时间',
      dataIndex: 'time',
      width: 200,
      render: (_, recort) => {
        const _time = recort.time.split(' - ')
        return (
          <span>{_time[0]}<br />{_time[1]}</span>
        )
      }
    },
    {
      title: '下行耗时',
      dataIndex: 'timer',
      width: 100,
      render: (_, recort) => (
        <span style={{ color: "#0074d7" }}>{recort.timer}</span>
      )
    },
    {
      title: '回执',
      dataIndex: 'return',
      render: (_, recort) => (
        <span style={{ color: "#00ae6f" }}>{recort.return}</span>
      )
    },
    {
      title: '国家',
      dataIndex: 'country',
    },
    {
      title: '通道',
      dataIndex: 'route',
    },
    {
      title: '通道组',
      dataIndex: 'routes',
      width: 200
    },
    {
      title: '网络类型',
      dataIndex: 'net',
      width: 100,
    },
    {
      title: '短信类型',
      dataIndex: 'messageType',
      width: 100,
    },
    {
      title: '成本/计费价',
      dataIndex: 'price',
      width: 120,
      render: (_, recort) => {
        const _price = recort.price.split(' - ')
        return (
          <span><span style={{ color: '#888888' }}>{_price[0]}</span><br />{_price[1]}</span>
        )
      }
    }
  ];

  const data: DataType[] = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      key: i,
      number: `1581234123${i}`,
      message: `您已成功登記CLINIQUE皇牌淡斑去印精華體驗！請於3月27日到大埔超級城一田百貨 換領體驗裝: s.buys.hk/7l9eoINIQUE皇牌淡斑去印精華體驗！請於3月27日到大埔超級城一田百貨`,
      sendName: 'eNotice',
      time: '2023-04-12 15:00:41 - 2023-03-27 13:56:35',
      timer: '30s',
      return: 'DELIVRD',
      country: '中国-香港',
      route: '飞鸽',
      routes: '8001-飞鸽行业通道组',
      net: 'osifao',
      messageType: '行业',
      price: '0.330 - 0.330',
    });
  }

  const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | string[]>([])
  const rowSelection = {
    selectedRowKeys,
    onChange: () => { },
    hideSelectAll: true,
    columnWidth: 4,
    renderCell: (checked: boolean, record: DataType, index: number, originNode: ReactNode) => {
      return null
    }
  }
  // 点击整行选择
  const onSelectRow = (record: DataType) => {
    setSelectedRowKeys([record.key])
  }


  return (
    <div data-class='sendlist'>
      <MenuTitle title="发送列表"></MenuTitle>
      <Form
        name="basic"
        layout={size=='small' ? 'inline' : 'inline'}
        wrapperCol={{ span: 24 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label=""
          name="route"
          style={{ marginBottom: 10 }}
        >
          <Select
            placeholder="请选择"
            style={{ width: 162 }}
            size={size}
            suffixIcon={<i className='icon iconfont icon-xiala' style={{ color: '#000', fontSize: '12px', transform: 'scale(.45)' }} />}
          >
            <Option value="male">male</Option>
            <Option value="female">female</Option>
            <Option value="other">other</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label=""
          name="message"
          style={{ marginBottom: 10 }}
        >
          <Select
            placeholder="请选择"
            style={{ width: 162 }}
            size={size}
            suffixIcon={<i className='icon iconfont icon-xiala' style={{ color: '#000', fontSize: '12px', transform: 'scale(.45)' }} />}
          >
            <Option value="male">全部短信类型</Option>
            <Option value="female">female</Option>
            <Option value="other">other</Option>
          </Select>
        </Form.Item>

        <MyFormItem size={size} label="注册时间" style={{marginBottom: '10px'}}>
          <Form.Item
            label=""
            name="time"
            style={{marginBottom: '0px'}}
          >
            <RangePicker size={size} bordered={false} onChange={changeTime} style={{width: size=='small'?190:240}}></RangePicker>
          </Form.Item>
        </MyFormItem>
        <Form.Item
          label=""
          name="account"
          style={{ marginBottom: 10 }}
        >
          <Input size={size} placeholder='账户/手机号/国家' style={{width: 162}}></Input>
        </Form.Item>
        <Form.Item
          style={{ marginBottom: 10 }}
        >
          <ConfigProvider theme={
            {
              token: {
                colorPrimary: '#ff5e2d',
                colorPrimaryHover: '#ff5e2d'
              }
            }
          }>
            <Button type="primary" size={size} htmlType="submit" style={{ width: 110, marginLeft: 0 }}>
              搜索
            </Button>
          </ConfigProvider>
        </Form.Item>
        <Form.Item
          style={{ marginBottom: 10 }}
        >
          <div className={`refresh fx-center-center ${size}`}>
            <i className={`icon iconfont icon-shuaxin1`}></i>
          </div>
        </Form.Item>
      </Form>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 50 }}
        sticky
        rowSelection={rowSelection}
        onRow={(record) => ({
          onClick: () => onSelectRow(record)
        })}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};
