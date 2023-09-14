import { useState, useImperativeHandle, forwardRef } from 'react'
import { Modal, Form, Input, App, Row, Col, Radio, Select } from 'antd'
import { saveChannel } from '@/api'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
import {
  mobileTypeOptions,
  yesOrNoOptions,
  accessTypeOptions,
  channelTypeOptions,
} from '@/utils/options'
import { ProFormDependency } from '@ant-design/pro-components'
import { API } from 'apis'
interface Props {
  initData: () => void
}

// 新增时初始化的值
const initialValues = {
  name: '',
  access_type: '0',
  type: '1',
  smsc_ip: '',
  smsc_port: '',
  http_url: '',
  sysid: '',
  password: '',
  service_type: '',
  system_type: '',
  flow: '',
  udh: '1',
  mobile_type: '0',
}

const Dialog = (props: Props, ref: any) => {
  const [isAdd, setisAdd] = useState<boolean>(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const { message } = App.useApp()
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })

  const open = (initFomeValue: any) => {
    setIsModalOpen(true)
    const { isAdd } = initFomeValue
    setisAdd(!!isAdd)
    form.resetFields()
    form.setFieldsValue(!!isAdd ? initialValues : initFomeValue.record)
  }

  const handleOk = async () => {
    try {
      const formVal = await form.validateFields()
      const res = await saveChannel(formVal)
      message.success('保存成功')
      props.initData()
      setIsModalOpen(false)
    } catch (error) {}
  }

  const handleCancel = async () => {
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
      title={isAdd ? '新增通道' : '编辑通道'}
      width={640}
      wrapClassName='modal-reset'
      onCancel={handleCancel}
      footer={<ModelFooter onOk={handleOk} onCancel={handleCancel} />}
      open={isModalOpen}>
      <Form
        name='form'
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        layout='vertical'
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'>
        <Row>
          <Col span={24}>
            <Form.Item label='id' name='id' hidden>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label='通道名称' name='name'>
              <Input placeholder='请输入通道名称' maxLength={30} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item label='接入类型' name='access_type'>
              <Radio.Group options={accessTypeOptions} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='通道类型' name='type'>
              <Radio.Group options={channelTypeOptions} />
            </Form.Item>
          </Col>
        </Row>
        <ProFormDependency name={['access_type']}>
          {({ access_type }) => {
            return (
              <Row justify='space-between' gutter={30}>
                <Col span={access_type == '0' ? 12 : 0}>
                  <Form.Item
                    hidden={access_type != '0'}
                    label='SMSC服务方IP地址'
                    labelCol={{ span: 24 }}
                    shouldUpdate
                    name='smsc_ip'>
                    <Input placeholder='请输入IP地址' maxLength={30} />
                  </Form.Item>
                </Col>
                <Col span={access_type == '0' ? 12 : 0}>
                  <Form.Item
                    hidden={access_type != '0'}
                    label='SMSC服务方端口号'
                    labelCol={{ span: 24 }}
                    name='smsc_port'>
                    <Input placeholder='请输入端口号' maxLength={30} />
                  </Form.Item>
                </Col>
                <Col span={access_type == '0' ? 0 : 24}>
                  <Form.Item
                    label='http接口地址'
                    name='http_url'
                    hidden={access_type == '0'}>
                    <Input placeholder='请输入http接口地址' maxLength={30} />
                  </Form.Item>
                </Col>
              </Row>
            )
          }}
        </ProFormDependency>
        <Row>
          <Col span={24}>
            <Form.Item label='用户名' name='sysid'>
              <Input placeholder='请输入用户名' maxLength={30} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label='用户密码' name='password'>
              <Input placeholder='请输入密码' maxLength={30} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item label='服务类型' name='service_type'>
              <Input placeholder='请输入服务类型' maxLength={30} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='项目类型' name='system_type'>
              <Input placeholder='请输入项目类型' maxLength={30} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item label='流速(t/s)' name='flow'>
              <Input placeholder='请输入流速' type='number' maxLength={30} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='号码前缀类型' name='mobile_type'>
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
                options={mobileTypeOptions}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify={'space-between'} gutter={30}>
          <Col span={12}>UDH模式</Col>
          <Col span={12}>
            <Form.Item label='' name='udh'>
              <Radio.Group options={yesOrNoOptions} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
