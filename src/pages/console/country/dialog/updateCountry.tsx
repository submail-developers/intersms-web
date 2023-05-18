import { useState, useImperativeHandle, forwardRef } from 'react'
import { Modal, Form, Input, App, Row, Col, Select } from 'antd'
import { SaveGroup } from '@/api'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
import type { RadioChangeEvent } from 'antd'
import { API } from 'apis'
import './updateCountry.scss'

interface Props {
  allGruopData: API.GetAllGroupIdItems[]
  // onSearch: () => void
}

const Dialog = (props: Props, ref: any) => {
  const { Option } = Select

  const [form] = Form.useForm()
  const { message } = App.useApp()
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const open = (params: any) => {
    form.resetFields()
    form.setFieldsValue(params.record)

    setIsModalOpen(true)
  }

  const handleOk = async () => {
    try {
      const params = await form.validateFields()
      const res = await SaveGroup(params)
      console.log(params)
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
            <Form.Item label='country' name='country' hidden>
              <Input placeholder='country' maxLength={30} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label='country_area_code'
              name='country_area_code'
              hidden>
              <Input placeholder='country_area_code' maxLength={30} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item label='国家名称' name='country_cn'>
              <Input disabled style={{ color: '#000' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='国家代码' name='region_code'>
              <Input disabled style={{ color: '#000' }} />
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
              name='tra_group'
              validateTrigger='onSubmit'>
              <Select
                showSearch
                // bordered={false}
                placeholder='请选择'
                optionFilterProp='children'
                onChange={onChange1}
                onSearch={onSearch}
                options={props.allGruopData}
                fieldNames={{ label: 'name', value: 'id' }}
                filterOption={(input, option) =>
                  (option?.name ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='行业Sender'
              name='tra_sender'
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
              name='mke_group'
              validateTrigger='onSubmit'>
              <Select
                showSearch
                // bordered={false}
                placeholder='请选择'
                optionFilterProp='children'
                onChange={onChange1}
                onSearch={onSearch}
                options={props.allGruopData}
                fieldNames={{ label: 'name', value: 'id' }}
                filterOption={(input, option) =>
                  (option?.name ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='营销Sender'
              name='mke_sender'
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
