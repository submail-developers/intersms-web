import { useState, useImperativeHandle, forwardRef } from 'react'
import { Modal, Form, Input, App, Row, Col, Radio } from 'antd'
import { addBlackList } from '@/api'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
import type { RadioChangeEvent } from 'antd'
import { API } from 'apis'
import './addDialog.scss'
interface Props {
  onSearch: () => void
}
interface OpenParams {
  rowData?: API.GetBlackListItems
}
const initFomeValue = {
  id: '',
  name: '',
  enabled: '1',
}
const Dialog = ({ onSearch }: Props, ref: any) => {
  const [form] = Form.useForm()
  const [isAdd, setisAdd] = useState<boolean>()
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

  const open = (params: OpenParams) => {
    const rowData = params?.rowData
    if (rowData) {
      setisAdd(false)
      form.setFieldsValue(rowData)
    } else {
      setisAdd(true)
      form.setFieldsValue(initFomeValue)
    }
    // form.resetFields()
    setIsModalOpen(true)
  }

  const handleOk = async () => {
    try {
      const params = await form.validateFields()
      const res = await addBlackList(params)
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
      title={isAdd ? '新增黑名单组' : '编辑黑名单组'}
      width={640}
      data-class='add-blacklist'
      closable={false}
      onCancel={handleCancel}
      wrapClassName='modal-reset'
      footer={<ModelFooter onOk={handleOk} onCancel={handleCancel} />}
      open={isModalOpen}>
      <Form
        name='form-0'
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        layout='vertical'
        initialValues={{ enabled: '1' }}
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
            name='enabled'
            validateTrigger='onSubmit'
            rules={[{ message: '请输入' }]}>
            <Radio.Group
              options={[
                { label: '启用', value: '1' },
                { label: '禁用', value: '0' },
              ]}
            />
          </Form.Item>
        </Row>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
