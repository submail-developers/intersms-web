import { useState, useImperativeHandle, forwardRef } from 'react'
import { Modal, Form, Input, App, Row, Col, Radio } from 'antd'
import { addAccount } from '@/api'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
import type { RadioChangeEvent } from 'antd'
import './addDialog.scss'
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

  const onChange = (e: RadioChangeEvent) => {
    console.log('checked = ', e)
  }

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
      title='新增黑名单组'
      width={640}
      data-class='add-blacklist'
      closable={false}
      wrapClassName='modal-reset'
      footer={<ModelFooter onOk={handleOk} onCancel={handleCancel} />}
      open={isModalOpen}>
      <Form
        name='form'
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        layout='vertical'
        initialValues={{ status: '1' }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'>
        <Form.Item
          label='黑名单组名称'
          name='name'
          validateTrigger='onSubmit'
          rules={[{ message: '请输入' }]}>
          <Input placeholder='请输入黑名单组名称' maxLength={30} />
        </Form.Item>
        <Row justify='space-between' align='middle'>
          <span>启用状态</span>
          <Form.Item
            label=''
            name='status'
            validateTrigger='onSubmit'
            rules={[{ message: '请输入' }]}>
            <Radio.Group
              options={[
                { label: '启用', value: '1' },
                { label: '禁用', value: '2' },
              ]}
            />
          </Form.Item>
        </Row>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
