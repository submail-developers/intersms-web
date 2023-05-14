import { useState, useImperativeHandle, forwardRef } from 'react'
import { Modal, Form, Input, App, Row, Col, Radio, Select } from 'antd'
import { addAccount } from '@/api'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
import type { CheckboxValueType } from 'antd/es/checkbox/Group'
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

  const onChange = (e: RadioChangeEvent) => {
    console.log('checked = ', e)
  }

  const options = [
    { label: '行业通道组', value: '1' },
    { label: '营销通道组', value: '2' },
  ]

  const onChange1 = (value: string) => {
    console.log(`selected ${value}`)
  }

  const onSearch = (value: string) => {
    console.log('search:', value)
  }

  return (
    <Modal
      title='新增通道'
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
            <Form.Item label='通道名称' name='name'>
              <Input placeholder='请输入通道名称' maxLength={30} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item
              label='接入类型'
              name='group_type'
              validateTrigger='onSubmit'>
              <Radio.Group options={options} onChange={onChange} />
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
              label='SMSC服务方IP地址'
              labelCol={{ span: 24 }}
              name='group_type'>
              <Input placeholder='请输入IP地址' maxLength={30} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='SMSC服务方端口号'
              labelCol={{ span: 24 }}
              name='group_type'
              validateTrigger='onSubmit'>
              <Input placeholder='请输入端口号' maxLength={30} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label='用户名' name='name'>
              <Input placeholder='请输入用户名' maxLength={30} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label='用户密码' name='name'>
              <Input placeholder='请输入密码' maxLength={30} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item label='服务类型' name='group_type'>
              <Input placeholder='请输入服务类型' maxLength={30} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='项目类型'
              name='group_type'
              validateTrigger='onSubmit'>
              <Input placeholder='请输入项目类型' maxLength={30} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item label='流速' name='sign'>
              <Input placeholder='请输入流速' maxLength={30} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='号码前缀类型' name='appid'>
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
                    label: '无前缀',
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
        </Row>
        <Row justify={'space-between'} gutter={30}>
          <Col span={12}>UDH模式</Col>
          <Col span={12}>
            <Form.Item label='' name='group_type' validateTrigger='onSubmit'>
              <Radio.Group
                options={[
                  {
                    label: '是',
                    value: '1',
                  },
                  {
                    label: '否',
                    value: '0',
                  },
                ]}
                onChange={onChange}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
