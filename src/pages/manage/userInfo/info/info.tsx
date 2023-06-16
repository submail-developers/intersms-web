import { ConfigProvider, Form, Input, Row, Col } from 'antd'
import user from '@/assets/img/user.jpg'
import './info.scss'
import { useEffect, useState } from 'react'
import { getUserInfo } from '@/api'
import { usePoint } from '@/hooks'

export default function Fn() {
  const [form] = Form.useForm()
  const point = usePoint('xs')

  useEffect(() => {
    getInfo()
  }, [])

  const getInfo = async () => {
    const res = await getUserInfo()
    form.setFieldsValue({
      ...res.data,
      department: '国际短信事业部',
    })
  }

  return (
    <div data-class='user-info'>
      <div className='form'>
        <div className='fx-between-center'>
          <div className='fn16 title'>个人资料</div>
          <div className='avatar-wrap'>
            <img className='avatar' src={user} alt='' />
          </div>
        </div>

        <ConfigProvider
          theme={{
            token: {
              controlHeight: 40,
              marginLG: 16,
            },
          }}>
          <Form
            className='form'
            name='form'
            form={form}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 24 }}
            layout='vertical'
            autoComplete='off'>
            <Row justify='space-between' gutter={10}>
              <Col span={point ? 24 : 12}>
                <Form.Item label='姓名' name='name'>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={point ? 24 : 12}>
                <Form.Item label='电话' name='mob'>
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row justify='space-between' gutter={10}>
              <Col span={point ? 24 : 12}>
                <Form.Item label='邮箱' name='mail'>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={point ? 24 : 12}>
                <Form.Item label='部门' name='department'>
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </ConfigProvider>
      </div>
    </div>
  )
}
