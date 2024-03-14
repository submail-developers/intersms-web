import { useState, useImperativeHandle, forwardRef, useRef } from 'react'
import { Modal, Form, Input, App, Row, Col, Radio, Select } from 'antd'
import { addkeyWord, saveChaneNetwork } from '@/api'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
import type { CheckboxValueType } from 'antd/es/checkbox/Group'
import type { RadioChangeEvent } from 'antd'

interface Props {
  onSearch: () => void
}

const Dialog = ({ onSearch }: Props, ref: any) => {
  const recordEditCopyRef = useRef(null)
  const [isAdd, setisAdd] = useState<boolean>(true)
  const [form] = Form.useForm()
  const { message } = App.useApp()
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  let id: string
  let type = 1
  let network_name = ''
  let network_price = ''

  const open = (params: any) => {
    id = params.record.id
    const { isAdd } = params
    setisAdd(isAdd)
    form.resetFields()
    form.setFieldsValue(params.record)
    setIsModalOpen(true)
    recordEditCopyRef.current = {
      id,
      type,
      network_name,
      network_price,
    }
  }

  const handleOk = async () => {
    try {
      const params = await form.validateFields()
      let comment = params.comment
      let price = params.price
      const res = await saveChaneNetwork({
        comment,
        price,
        ...recordEditCopyRef.current,
      })
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
  const { TextArea } = Input
  return (
    <Modal
      title={isAdd ? '添加关键字' : '编辑通道'}
      width={640}
      closable={false}
      onCancel={handleCancel}
      wrapClassName='modal-reset'
      footer={<ModelFooter onOk={handleOk} onCancel={handleCancel} />}
      open={isModalOpen}>
      <Form
        name='form1'
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        layout='vertical'
        initialValues={{}}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item label='通道名称' name='channel_name'>
              <Input
                placeholder='请输入通道名称'
                maxLength={30}
                disabled={!isAdd}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='价格' name='price'>
              <Input placeholder='请输入价格' maxLength={30} />
            </Form.Item>
          </Col>
        </Row>

        <Row justify='space-between' gutter={30}>
          <Col span={24}>
            <Form.Item
              label={<div>备注</div>}
              labelCol={{ span: 24 }}
              name='comment'>
              <TextArea
                rows={4}
                className='color-words'
                style={{ fontSize: '16px' }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
