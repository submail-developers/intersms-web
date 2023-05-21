import { useState, useImperativeHandle, forwardRef } from 'react'
import { Modal, Form, Input, App, Row, Col, Radio, Select } from 'antd'
import { addAccount } from '@/api'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
import type { RadioChangeEvent } from 'antd'

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

  const onChange = (e: RadioChangeEvent) => {}

  const options = [
    { label: '行业通道组', value: '1' },
    { label: '营销通道组', value: '2' },
  ]

  const onChange1 = (value: string) => {}

  const onSearch = (value: string) => {}

  return (
    <Modal
      data-class='dialog'
      title='失败处理配置'
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
        initialValues={{ group: '1', group_type: ['1'] }}
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
            <Form.Item label='APPID' name='appid' validateTrigger='onSubmit'>
              <Select
                showSearch
                // bordered={false}
                placeholder='请选择'
                optionFilterProp='children'
                onChange={onChange1}
                onSearch={onSearch}
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={[
                  {
                    value: 'all',
                    label: '全部',
                  },
                  {
                    value: '1',
                    label: 'appid1',
                  },
                  {
                    value: '2',
                    label: 'appid2',
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='通道组类型'
              name='group_type'
              validateTrigger='onSubmit'>
              <Radio.Group options={options} onChange={onChange} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item
              label='response_time'
              name='response_time'
              validateTrigger='onSubmit'>
              <Input placeholder='' maxLength={30} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='delivrd'
              name='delivrd'
              validateTrigger='onSubmit'
              rules={[{ message: '' }]}>
              <Input placeholder='' maxLength={30} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item
              label='undeliv'
              name='undeliv'
              validateTrigger='onSubmit'>
              <Input placeholder='' maxLength={30} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='expired'
              name='expired'
              validateTrigger='onSubmit'
              rules={[{ message: '' }]}>
              <Input placeholder='' maxLength={30} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item
              label='accepted'
              name='accepted'
              validateTrigger='onSubmit'>
              <Input placeholder='' maxLength={30} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='unknown'
              name='unknown'
              validateTrigger='onSubmit'
              rules={[{ message: '' }]}>
              <Input placeholder='' maxLength={30} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item
              label='resjected'
              name='resjected'
              validateTrigger='onSubmit'>
              <Input placeholder='' maxLength={30} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='spname'
              name='spname'
              validateTrigger='onSubmit'
              rules={[{ message: '' }]}>
              <Input placeholder='' maxLength={30} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
