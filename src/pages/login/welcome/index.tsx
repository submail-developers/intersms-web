import { useState, forwardRef, useTransition } from 'react'
import { Modal, Form, Input, App, Row, Col, Radio, Select } from 'antd'
import Logo from '@/assets/img/submil.png'
import ErrorMessage from '@/components/antd/formErrorTips/formErrorTips'

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
      props.next()
      setLoaidng(false)
    } catch (error) {
      setLoaidng(false)
    }
  }
  return (
    <div data-class='welcome' style={{ opacity: props.step == 0 ? '1' : '0' }}>
      <div className='top-text'>
        <div className='title fx-y-center'>
          <img src={Logo} className='img' alt='' />
          欢迎登录
        </div>
        <div className='name'>SUBMAIL国际短信网关</div>
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
          label=''
          name='email'
          rules={[
            {
              required: true,
              message: <ErrorMessage>请输入电子邮箱</ErrorMessage>,
            },
            {
              type: 'email',
              message: <ErrorMessage>电子邮箱错误，请重试</ErrorMessage>,
            },
          ]}
          validateTrigger='onSubmit'>
          <Input placeholder='请输入电子邮箱' maxLength={30} type='email' />
        </Form.Item>
        <Form.Item
          label=''
          name='password'
          rules={[
            {
              required: true,
              message: <ErrorMessage>请输入密码</ErrorMessage>,
            },
          ]}
          validateTrigger='onSubmit'>
          <Input placeholder='请输入密码' maxLength={30} />
        </Form.Item>
      </Form>
      <div className={`btn ${loading && 'loading'}`} onClick={getCode}>
        获取验证码
      </div>
    </div>
  )
}
export default Welcome
