import { useState, useImperativeHandle, forwardRef } from 'react'
import { Modal, Form, Input, App, Row, Col, Select, Radio } from 'antd'
import { addAccount } from '@/api'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
import type { RadioChangeEvent } from 'antd'
import './addDialog.scss'

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

  const onChange1 = (value: string) => {
    console.log(`selected ${value}`)
  }

  const onSearch = (value: string) => {
    console.log('search:', value)
  }

  return (
    <Modal
      title='报警设置'
      width={640}
      closable={false}
      wrapClassName='modal-reset'
      data-class='net-config-dialog'
      footer={<ModelFooter onOk={handleOk} onCancel={handleCancel} />}
      open={isModalOpen}>
      <Form
        name='form'
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        layout='vertical'
        initialValues={{ type: '1', status: '1' }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item label='报警类型' name='type'>
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
                    label: '账号报警',
                  },
                  {
                    value: '2',
                    label: '通道报警',
                  },
                  {
                    value: '4',
                    label: '国家报警',
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='选择国家/地区'>
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
                    label: '国家1',
                  },
                  {
                    value: '2',
                    label: '通道2',
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div className='group-title'>报警条件</div>
          </Col>
        </Row>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item
              label='报警时间范围'
              name='time'
              validateTrigger='onSubmit'>
              <Input placeholder='请输入报警时间范围' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='报警最小条数' name='min_length'>
              <Input placeholder='请输入最小条数' />
            </Form.Item>
          </Col>
        </Row>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item label='失败率' name='fail' validateTrigger='onSubmit'>
              <Input placeholder='请输入失败率' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='报警开关' name='status'>
              <Radio.Group
                options={[
                  { label: '打开', value: '1' },
                  { label: '关闭', value: '2' },
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
