import { useState, useImperativeHandle, forwardRef } from 'react'
import { Modal, Form, Input, App, Row, Col, Radio, Select } from 'antd'
import { saveChannel } from '@/api'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
import {
  mobileTypeOptions,
  yesOrNoOptions,
  accessTypeOptions,
  channelTypeOptions,
  isOpenTypeOptions,
} from '@/utils/options'
import { ProFormDependency } from '@ant-design/pro-components'
import { API } from 'apis'
import { useSize } from '@/hooks'
interface Props {
  initData: () => void
  allChannelData: API.GetAllChannelIdParamsItems[]
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
  resend: '0',
  // resend_id: '0',
  resend_timer: '40',
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
  const size = useSize()
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
      console.log(formVal)
      if (formVal.resend == '0') {
        formVal.resend_timer = '0'
        formVal.resend_id = '0'
      }
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
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item label='通道名称' name='name'>
              <Input placeholder='请输入通道名称' maxLength={30} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='通道类型' name='type'>
              {/* <Radio.Group options={channelTypeOptions} /> */}
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
                options={channelTypeOptions}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item label='接入类型' name='access_type'>
              <Radio.Group options={accessTypeOptions} />
            </Form.Item>
          </Col>
        </Row>
        <ProFormDependency name={['access_type']}>
          {({ access_type }) => {
            return (
              <Row justify='space-between' gutter={30}>
                {/* SMPP接入类型的表单项 */}
                {['0'].includes(access_type) && (
                  <>
                    <Col span={12}>
                      <Form.Item
                        label='SMSC服务方IP地址'
                        labelCol={{ span: 24 }}
                        shouldUpdate
                        name='smsc_ip'>
                        <Input placeholder='请输入IP地址' maxLength={30} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label='SMSC服务方端口号'
                        labelCol={{ span: 24 }}
                        name='smsc_port'>
                        <Input placeholder='请输入端口号' maxLength={30} />
                      </Form.Item>
                    </Col>
                  </>
                )}

                {/* CMPP接入类型的表单项 */}
                {['2'].includes(access_type) && (
                  <>
                    <Col span={12}>
                      <Form.Item
                        label='CMPP服务方IP地址'
                        labelCol={{ span: 24 }}
                        shouldUpdate
                        name='cmpp_ip'>
                        <Input placeholder='请输入IP地址' maxLength={30} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label='CMPP服务方端口号'
                        labelCol={{ span: 24 }}
                        name='cmpp_port'>
                        <Input placeholder='请输入端口号' maxLength={30} />
                      </Form.Item>
                    </Col>
                  </>
                )}

                {/* HTTP接入类型的表单项 */}
                {['1'].includes(access_type) && (
                  <Col span={24}>
                    <Form.Item label='http接口地址' name='http_url'>
                      <Input placeholder='请输入http接口地址' maxLength={30} />
                    </Form.Item>
                  </Col>
                )}
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

        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item label='是否开启补发' name='resend'>
              <Radio.Group options={isOpenTypeOptions} />
            </Form.Item>
          </Col>
        </Row>
        <ProFormDependency name={['resend']}>
          {({ resend }) => {
            return (
              <Row justify='space-between' gutter={30}>
                <Col span={resend == '1' ? 12 : 0}>
                  <Form.Item
                    hidden={resend != '1'}
                    label='补发超时限制(s)'
                    labelCol={{ span: 24 }}
                    shouldUpdate
                    name='resend_timer'>
                    <Input placeholder='请输入时间' />
                  </Form.Item>
                </Col>
                {size == 'small' ? (
                  <Col span={resend == '1' ? 24 : 0}>
                    <Form.Item
                      label='补发通道组'
                      name='resend_id'
                      validateTrigger='onSubmit'>
                      <Select
                        showSearch
                        placeholder='请选择通道组'
                        optionFilterProp='children'
                        options={props.allChannelData.slice(1)}
                        fieldNames={{ label: 'name', value: 'id' }}
                        onChange={onChange1}
                        onSearch={onSearch}
                        filterOption={(input, option) =>
                          (option?.name ?? '')
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      />
                    </Form.Item>
                  </Col>
                ) : (
                  <Col span={resend == '1' ? 12 : 0}>
                    <Form.Item
                      label='补发通道组'
                      name='resend_id'
                      validateTrigger='onSubmit'>
                      <Select
                        showSearch
                        placeholder='请选择通道组'
                        optionFilterProp='children'
                        options={props.allChannelData.slice(1)}
                        fieldNames={{ label: 'name', value: 'id' }}
                        onChange={onChange1}
                        onSearch={onSearch}
                        filterOption={(input, option) =>
                          (option?.name ?? '')
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      />
                    </Form.Item>
                  </Col>
                )}

                <Col span={resend == '1' ? 12 : 0}>
                  <Form.Item label='补发超时限制' name='resend_timer' hidden>
                    <Input placeholder='' />
                  </Form.Item>
                  <Form.Item label='补发通道组' name='resend_id' hidden>
                    <Input placeholder='' />
                  </Form.Item>
                </Col>
              </Row>
            )
          }}
        </ProFormDependency>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
