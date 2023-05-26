import { useState, forwardRef, useTransition } from 'react'
import { Modal, Form, Input, App, Row, Col, Radio, Select } from 'antd'
import Logo from '@/assets/img/logo.png'

import './index.scss'
interface Props {
  step: number
  next: () => void
}

function Welcome(props: Props) {
  const [loading, setLoaidng] = useState(false)
  const [form] = Form.useForm()
  const getCode = async () => {
    props.next()
    try {
      setLoaidng(true)
      const values = await form.validateFields()
      nextStep()
      setLoaidng(false)
    } catch (error) {
      setLoaidng(false)
    }
  }
  const nextStep = () => {
    props.next()
  }
  return (
    <div data-class='welcome' style={{ opacity: props.step == 0 ? '1' : '0' }}>
      <div>
        <div className='title'>欢迎登陆</div>
        <div className='logo-wrap fx-y-center'>
          <img src={Logo} className='logo' alt='' />
          <span>国际短信网关</span>
        </div>
        <Form
          name='form'
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 24 }}
          layout='vertical'
          style={{ width: '100%' }}
          autoComplete='on'>
          <Form.Item
            label='电子邮箱'
            name='email'
            rules={[
              { required: true, message: '请输入电子邮箱！' },
              {
                type: 'email',
                message: '请输入正确格式的电子邮箱！',
              },
            ]}
            validateTrigger='onSubmit'>
            <Input placeholder='请输入' maxLength={30} type='email' />
          </Form.Item>
          <Form.Item
            label='密码'
            name='password'
            rules={[{ required: true, message: '请输入密码' }]}
            validateTrigger='onSubmit'>
            <Input placeholder='请输入' maxLength={30} />
          </Form.Item>
        </Form>
        <div className={`btn ${loading && 'loading'}`} onClick={getCode}>
          获取验证码
        </div>
      </div>
    </div>
  )
}
export default Welcome
