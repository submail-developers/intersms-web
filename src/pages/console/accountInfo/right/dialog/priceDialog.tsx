import { useState, useImperativeHandle, forwardRef } from 'react'
import { Modal, Form, Input, App, Row, Col, Checkbox } from 'antd'
import { addAccount } from '@/api'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
import type { CheckboxValueType } from 'antd/es/checkbox/Group'

interface Props {
  // onSearch: () => void
}

const Dialog = (props: Props, ref: any) => {
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
    } catch (error) {}
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const onFinish = () => {}
  const onFinishFailed = () => {}

  const onChange = (checkedValues: CheckboxValueType[]) => {
    console.log('checked = ', checkedValues)
  }

  const options = [
    { label: '行业短信', value: '1' },
    { label: '营销短信', value: '2' },
  ]

  return (
    <Modal
      data-class='dialog'
      title='新增客户'
      width={700}
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
        initialValues={{ type: ['1'] }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'>
        <Form.Item
          label='国家名称'
          name='name'
          validateTrigger='onSubmit'
          rules={[{ message: '请输入' }]}>
          <Input placeholder='请输入国家名称' maxLength={30} />
        </Form.Item>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item label='短信类型' name='type' validateTrigger='onSubmit'>
              <Checkbox.Group options={options} onChange={onChange} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='价格'
              name='price'
              validateTrigger='onSubmit'
              rules={[
                { message: '请输入' },
                {
                  type: 'number',
                  message: '请输入正确的数字!',
                },
              ]}>
              <Input placeholder='请输入价格' maxLength={30} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
