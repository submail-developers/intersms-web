import { useState, useImperativeHandle, forwardRef } from 'react'
import { Modal, Form, Input, App, Row, Col, Select, Divider } from 'antd'
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
      title='网络信息配置'
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
        initialValues={{ trade_group: '1', sale_group: '2' }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'>
        <Row justify='space-between' gutter={30}>
          <Col span={24}>
            <Form.Item label='网络名称' name='name'>
              <Input placeholder='请输入网络名称' />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div className='group-title'>国家价格配置</div>
          </Col>
        </Row>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item
              label='国家名称'
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
                    label: '中国',
                  },
                  {
                    value: '2',
                    label: '美国',
                  },
                  {
                    value: '3',
                    label: '阿富汗',
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='国家代码' name='country_code'>
              <span className='disabled-value'>CN</span>
            </Form.Item>
          </Col>
        </Row>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item
              label='成本价格'
              name='price1'
              validateTrigger='onSubmit'>
              <div className='price-wrap'>
                <Input placeholder='请输入成本价格' />
                <span className='affix-text'>元</span>
              </div>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='建议零售价格'
              name='price2'
              validateTrigger='onSubmit'>
              <div className='price-wrap'>
                <Input placeholder='请输入建议零售价格' />
                <span className='affix-text'>元</span>
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
