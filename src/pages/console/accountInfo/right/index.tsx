import { ReactNode, useState } from 'react';
import { Tabs, Button, Select, Form, Input, DatePicker, ConfigProvider, Table, Tooltip, Grid, Col, Row, Space, Divider, Switch } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TabsProps, } from 'antd';
import { useSize } from '@/hooks';

import PriceConfig from './config/price';

import './index.scss'


export default () => {
  const [activeKey, setactiveKey] = useState<string>('1')
  const onChange = (key: string) => {
    console.log(key);
  };
  
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '国家价格配置',
      children: <PriceConfig />,
    },
    {
      key: '2',
      label: `国家通道配置`,
      children: `Content of Tab Pane 2`,
    },
    {
      key: '3',
      label: `失败处理配置`,
      children: `Content of Tab Pane 3`,
    },
  ];
  
  const size = useSize()


  // 自定义tabs导航
  const renderTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => {
    const changeALl = (checked: boolean) => {
      console.log(checked)
    }
    const changeTest = (checked: boolean) => {
      console.log(checked)
    }
    return (
      <div className='fx fx-wrap tabbar-head'>
        <div className={`fx fx-shrink panle-list ${size}`}>
          {
            items.map(item => (
              <div key={item.key} onClick={() => setactiveKey(item.key)} className={`panle ${size} ${item.key==activeKey?'active':''}`}>{item.label}</div>
            ))
          }
        </div>
        <div className='fx-auto fx-shrink fx-between-center ext-switch'>
          <div className='switch-all fx-shrink'>
            <Switch size={size=='small' ? 'small' : 'default'} onChange={changeALl}></Switch>
            <span> 开启全部营销</span>
          </div>
          <div className='switch-test fx-shrink'>
            <Switch size={size=='small' ? 'small' : 'default'} onChange={changeTest}></Switch>
            <span> 测试用户</span>
          </div>
        </div>

      </div>
    )
  }

  return (
    <section data-class='account-right' className='right-wrap fx-auto'>
      <div className='fx-col'>
        <Space.Compact size={size}>
          <Button type="primary" icon={<i className={`icon iconfont icon-xinzeng ${size}`} />}>新增</Button>
          <Button type="primary" icon={<i className={`icon iconfont icon-bianji ${size}`} />}>编辑</Button>
          <Button type='primary' danger icon={<i className={`icon iconfont icon-shanchu ${size}`} />}>删除</Button>
        </Space.Compact>
        <div className='tabs'>
          <Tabs
            type='card'
            activeKey={activeKey}
            items={items} 
            onChange={onChange} 
            renderTabBar={renderTabBar}
          />
        </div>
      </div>
    </section>
  )
}
