import { useState, useImperativeHandle, forwardRef } from 'react'
import { Modal, Form, Input, App, Row, Col, Radio } from 'antd'
import { updateChannelGroup } from '@/api'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
import type { RadioChangeEvent } from 'antd'
import { channelsTypeOptions, enableTypeOptions } from '@/utils/options'
import { API } from 'apis'
interface Props {
  onSearch: () => void
}
interface OpenParams {
  rowData?: API.GetChannelGroupListItem
}

const initFomeValue = {
  id: '',
  name: '',
  type: '0',
  enabled: '1',
}

const Dialog = ({ onSearch }: Props, ref: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAdd, setisAdd] = useState<boolean>()
  const [form] = Form.useForm()
  const { message } = App.useApp()
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })

  // 新增/编辑
  const open = (params: OpenParams) => {
    const rowData = params?.rowData
    if (rowData) {
      setisAdd(false)
      form.setFieldsValue(rowData)
    } else {
      setisAdd(true)
      form.setFieldsValue(initFomeValue)
    }
    setIsModalOpen(true)
  }

  const handleOk = async () => {
    const values = await form.getFieldsValue()
    const res = await updateChannelGroup(values)
    onSearch()
    message.success('保存成功')
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const onChange = (e: RadioChangeEvent) => {
    console.log('checked = ', e)
  }
  return (
    <Modal
      title={isAdd ? '新增通道组' : '编辑通道组'}
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
        autoComplete='off'>
        <Form.Item label='id' hidden name='id'>
          <Input placeholder='' maxLength={30} />
        </Form.Item>
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
            <Form.Item label='状态' name='enabled' validateTrigger='onSubmit'>
              <Radio.Group options={enableTypeOptions} onChange={onChange} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='通道组类型'
              name='type'
              validateTrigger='onSubmit'>
              <Radio.Group options={channelsTypeOptions} onChange={onChange} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
