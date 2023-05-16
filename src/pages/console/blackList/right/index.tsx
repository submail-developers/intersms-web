import { useState, useRef, MutableRefObject } from 'react'
import {
  ConfigProvider,
  Button,
  Input,
  Checkbox,
  Popconfirm,
  Row,
  Col,
  Form,
  Pagination,
} from 'antd'
import { useSize } from '@/hooks'
import AddDialog from './dialog/addDialog'

import './index.scss'
import type { CheckboxValueType } from 'antd/es/checkbox/Group'
import type { PaginationProps } from 'antd'

export default function Right() {
  const addDialogRef: MutableRefObject<any> = useRef(null)
  const [form] = Form.useForm()

  const data = []
  for (let i = 0; i < 100; i++) {
    data.push({
      value: 'id' + i,
      label: '13012341234',
    })
  }

  const onChange = (checkedValues: CheckboxValueType[]) => {
    console.log('checked = ', checkedValues)
  }
  const onFinish = (values: any) => {}

  const size = useSize()
  // 展示新增弹框
  const showDialog = () => {
    addDialogRef.current.open()
  }
  const observerBle = {
    xs: 24,
    sm: 24,
    md: 12,
    lg: 12,
    xl: 8,
    xxl: 4,
  }
  const observerGutter = {
    xs: 6,
    sm: 6,
    md: 8,
    lg: 10,
    xl: 12,
    xxl: 14,
  }
  const showTotal: PaginationProps['showTotal'] = (total) =>
    `当前展示1-100/共${total}个`
  return (
    <section
      data-class='account-right'
      className='right-wrap fx-auto fx-shrink'
      style={{ minWidth: `${size === 'small' ? '100%' : ''}` }}>
      <div className='fx-col'>
        <Row justify={'space-between'}>
          <Col>
            <div className='btn-group'>
              <div className='btn' onClick={showDialog}>
                <i className='icon iconfont icon-xinzeng'></i>
                <span>新增</span>
              </div>
              <div className='btn'>
                <i className='icon iconfont icon-bianji'></i>
                <span>编辑</span>
              </div>
              <Popconfirm
                placement='bottom'
                title='警告'
                description='确定删除选中的客户吗？'
                // onConfirm={deleteEvent}
                okText='确定'
                cancelText='取消'>
                <div className='btn delete'>
                  <i className='icon iconfont icon-shanchu'></i>
                  <span>删除</span>
                </div>
              </Popconfirm>
            </div>
          </Col>
          <Col>
            <Form
              name='basic'
              form={form}
              initialValues={{}}
              layout='inline'
              wrapperCol={{ span: 24 }}
              onFinish={onFinish}
              autoComplete='off'>
              <Form.Item label='' name='name' style={{ marginBottom: 10 }}>
                <Input
                  size={size}
                  placeholder='手机号'
                  maxLength={20}
                  style={{ width: 162 }}></Input>
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
          </Col>
        </Row>
        <Row justify={'space-between'} align={'bottom'} wrap gutter={[10, 10]}>
          <Col>
            <div className='list-title'>黑名单表-钓鱼</div>
          </Col>
          <Col>
            <Pagination
              size='small'
              total={1000}
              showSizeChanger
              showQuickJumper
              pageSizeOptions={[100, 200, 300]}
              showTotal={showTotal}
            />
          </Col>
        </Row>
      </div>
      <Checkbox.Group
        style={{ width: '100%', marginTop: '10px' }}
        onChange={onChange}>
        <Row wrap gutter={observerGutter}>
          {data.map((item) => (
            <Col key={item.value} {...observerBle}>
              <div className='checkbox-item fx-between-center'>
                <Checkbox value={item.value}>{item.label}</Checkbox>
                <div className='delete-btn'>
                  <i className='icon iconfont icon-shanchu fn12'></i>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Checkbox.Group>
      <AddDialog ref={addDialogRef} />
    </section>
  )
}