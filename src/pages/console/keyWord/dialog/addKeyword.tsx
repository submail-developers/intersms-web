import { useState, useImperativeHandle, forwardRef } from 'react'
import { Modal, Form, Input, App, Row, Col, Radio, Select } from 'antd'
import { AddkeyWord } from '@/api'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
import type { CheckboxValueType } from 'antd/es/checkbox/Group'
import type { RadioChangeEvent } from 'antd'

interface Props {
  onSearch: () => void
}

const Dialog = ({ onSearch }: Props, ref: any) => {
  const [isAdd, setisAdd] = useState<boolean>(true)
  const [form] = Form.useForm()
  const { message } = App.useApp()
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const open = (params: any) => {
    const { isAdd } = params
    setisAdd(isAdd)
    form.resetFields()

    form.setFieldsValue(params.record)
    setIsModalOpen(true)
  }

  const handleOk = async () => {
    try {
      const params = await form.validateFields()
      const res = await AddkeyWord(params)
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
      title='添加关键词'
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
        initialValues={{}}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'>
        <Row>
          <Col span={24}>
            <Form.Item label='id' name='id' hidden>
              <Input placeholder='id' maxLength={30} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label='类目名称' name='name'>
              <Input placeholder='请输入类目名称' maxLength={30} />
            </Form.Item>
          </Col>
        </Row>

        <Row justify='space-between' gutter={30}>
          <Col span={24}>
            <Form.Item label='关键词' labelCol={{ span: 24 }} name='keywords'>
              <Input placeholder='请输入关键词' maxLength={30} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label='备注' name='comment'>
              <Input placeholder='请输入备注' maxLength={30} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
