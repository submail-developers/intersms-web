import { useState, useImperativeHandle, forwardRef } from 'react'
import { Modal, Form, Input, App, Row, Col, Select } from 'antd'
import { addAccount } from '@/api'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
import type { RadioChangeEvent } from 'antd'
import './updateCountry.scss'

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
      title='国家信息配置'
      width={640}
      closable={false}
      wrapClassName='modal-reset'
      data-class='updata-country-config'
      footer={<ModelFooter onOk={handleOk} onCancel={handleCancel} />}
      open={isModalOpen}>
      <Form
        name='form'
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        layout='vertical'
        initialValues={{ trade_group: '1', sale_group: '2' }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item label='国家名称' name='name'>
              <span className='disabled-value'>中国</span>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='国家代码' name='name'>
              <span className='disabled-value'>CN</span>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div className='group-title'>行业通道组</div>
          </Col>
        </Row>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item
              label='默认通道组'
              name='trade_group'
              validateTrigger='onSubmit'>
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
                    value: '1',
                    label: '0001-AutoSubList',
                  },
                  {
                    value: '2',
                    label: '0002-AutoSubList',
                  },
                  {
                    value: '3',
                    label: '0003-AutoSubList',
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='行业Sender'
              name='trade_sender'
              validateTrigger='onSubmit'>
              <Input placeholder='请输入行业Sender' maxLength={30} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div className='group-title'>营销通道组</div>
          </Col>
        </Row>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item
              label='默认通道组'
              name='sale_group'
              validateTrigger='onSubmit'>
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
                    value: '1',
                    label: '0001-AutoSubList',
                  },
                  {
                    value: '2',
                    label: '0002-AutoSubList',
                  },
                  {
                    value: '3',
                    label: '0003-AutoSubList',
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='营销Sender'
              name='sale_sender'
              validateTrigger='onSubmit'>
              <Input placeholder='请输入营销Sender' maxLength={30} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
