import { useState, useImperativeHandle, forwardRef } from 'react'
import { Modal, Form, Input, App, Row, Col, Radio } from 'antd'
import { addAccount } from '@/api'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
import type { RadioChangeEvent } from 'antd'

interface Props {
  onSearch: () => void
}

const options1 = [
  { label: '启用', value: '1' },
  { label: '禁用', value: '2' },
]

const options2 = [
  { label: '行业通道组', value: '1' },
  { label: '营销通道组', value: '2' },
]

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

  const onChange = (e: RadioChangeEvent) => {
    console.log('checked = ', e)
  }
  return (
    <Modal
      title='新增通道组'
      width={640}
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
        initialValues={{ status: '1', type: '1' }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'>
        <Row>
          <Col span={24}>
            <Form.Item
              label='通道组名称'
              name='name'
              validateTrigger='onSubmit'
              rules={[{ message: '请输入' }]}>
              <Input placeholder='请输入通道组名称' maxLength={30} />
            </Form.Item>
          </Col>
        </Row>

        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item label='状态' name='status' validateTrigger='onSubmit'>
              <Radio.Group options={options1} onChange={onChange} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='通道组类型'
              name='type'
              validateTrigger='onSubmit'>
              <Radio.Group options={options2} onChange={onChange} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
