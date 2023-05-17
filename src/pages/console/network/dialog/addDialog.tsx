import { useState, useImperativeHandle, forwardRef } from 'react'
import { Modal, Form, Input, App, Row, Col, Select } from 'antd'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
import styled from 'styled-components'

interface Props {
  // onSearch: () => void
}

const GroupTitle = styled.div`
  font-size: 16px;
  color: #b2b2b2;
  margin-bottom: 10px;
`

const Dialog = (props: Props, ref: any) => {
  const [isAdd, setisAdd] = useState<boolean>(true)
  const [form] = Form.useForm()
  const { message } = App.useApp()
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const open = (initValues: any) => {
    const { isAdd } = initValues
    setisAdd(isAdd)
    form.resetFields()

    form.setFieldsValue(initValues.record)
    setIsModalOpen(true)
  }

  const handleOk = async () => {
    try {
      // const params = await form.validateFields()
      // const res = await addAccount(params)
      // if (res) {
      //   message.success('保存成功！')
      // }
      setIsModalOpen(false)
    } catch (error) {}
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const onFinish = () => {}
  const onFinishFailed = () => {}

  const onChange1 = (value: string) => {
    console.log(`selected ${value}`)
  }

  const onSearch = (value: string) => {
    console.log('search:', value)
  }

  return (
    <Modal
      title={isAdd ? '新增网络信息' : '编辑网络信息'}
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
        onFinish={onFinish}
        initialValues={{ price1: '0.9' }}
        onFinishFailed={onFinishFailed}
        autoComplete='off'>
        <Row justify='space-between' gutter={30}>
          <Col span={24}>
            <Form.Item label='网络名称' name='net_name'>
              <Input disabled={!isAdd} placeholder='请输入网络名称' />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <GroupTitle>国家价格配置</GroupTitle>
          </Col>
        </Row>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item
              label='国家名称'
              name='country_name'
              validateTrigger='onSubmit'>
              <Select
                showSearch
                disabled={!isAdd}
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
              <Input type='text' disabled={!isAdd} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item
              label='成本价格'
              name='price1'
              validateTrigger='onSubmit'>
              <Input placeholder='请输入成本价格' suffix='元' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='建议零售价格'
              name='price2'
              validateTrigger='onSubmit'>
              <Input placeholder='请输入建议零售价格' suffix='元' />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
