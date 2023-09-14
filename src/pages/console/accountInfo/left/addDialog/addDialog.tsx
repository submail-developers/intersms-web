import { useState, useImperativeHandle, forwardRef } from 'react'
import { Modal, Form, Input, App } from 'antd'
import { addAccount } from '@/api'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'

interface Props {
  onSearch: () => void
}

const Dialog = ({ onSearch }: Props, ref: any) => {
  const [form] = Form.useForm()
  const { message } = App.useApp()
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const open = () => {
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleOk = async () => {
    try {
      const params = await form.validateFields()
      const res = await addAccount(params)
      if (res) {
        message.success('保存成功！')
      }
      setIsModalOpen(false)
      onSearch()
    } catch (error) {}
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const onFinish = () => {}
  const onFinishFailed = () => {}

  return (
    <Modal
      title='新增客户信息配置'
      width={640}
      closable={false}
      onCancel={handleCancel}
      wrapClassName='modal-reset'
      footer={<ModelFooter onOk={handleOk} onCancel={handleCancel} />}
      open={isModalOpen}>
      <Form
        name='form'
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        layout='vertical'
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'>
        <Form.Item
          label='客户邮箱'
          name='mail'
          validateTrigger='onSubmit'
          rules={[
            { message: '请输入客户邮箱!' },
            {
              type: 'email',
              message: '请输入正确邮箱!',
            },
          ]}>
          <Input placeholder='请输入客户邮箱' maxLength={60} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
