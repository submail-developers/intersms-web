import {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useRef,
} from 'react'
import { Modal, Form, Input, App, Row, Col, Select, Radio } from 'antd'
import { statePushHandler, sendAgainHandler } from '@/api'
import { API } from 'apis'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
import type { RadioChangeEvent } from 'antd'
import { useSize } from '@/hooks'
import { ProFormDependency } from '@ant-design/pro-components'
import './addDialog.scss'

interface Props {
  allCountry: API.CountryItem[]
  channelsList
  appidList
  account
  onSearch: () => void
}

interface InitOpen {
  isAdd: boolean
  record?: API.GetalArmConfigListItems
}

const Dialog = (props: Props, ref: any) => {
  const size = useSize()
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const [isAdd, setisAdd] = useState<boolean>(true)
  const [record, setrecord] = useState<API.GetalArmConfigListItems | null>(null)
  const [typeSend, setTypeSend] = useState('0')
  const [regionCode, setRegionCode] = useState('0')
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const open = (sendType) => {
    // const { isAdd, record } = initValues
    setisAdd(isAdd)
    form.resetFields()
    form.setFieldValue('type', sendType)
    setTypeSend(sendType)
    setIsModalOpen(true)
    if (isAdd) {
    } else {
      if (record) {
        let arr: API.GetRegioncodeByCountryItems[] = [
          {
            label: record.country_cn,
            value: record.region_code,
          },
        ]
        setrecord(record)
      }
    }
  }

  let sender: string
  const seleAccount = (value: string, option: any) => {
    sender = option.account
  }

  const seleCountry = (value: string, option: API.CountryItem) => {
    setRegionCode(option.value)
  }

  const handleOk = async () => {
    try {
      const params = await form.validateFields()
      if (typeSend == '0') {
        // 状态推送
        let newParams = {
          account: props.account,
          appid: params.appid,
          task_name: params.task_name,
          sms_type: params.sms_type,
          region_code: regionCode,
        }
        const res = await statePushHandler(newParams)
        if (res) {
          message.success('推送成功')
        }
        setIsModalOpen(false)
      } else {
        // 二次发送
        let newParams = {
          account: props.account,
          appid: params.appid,
          task_name: params.task_name,
          sms_type: params.sms_type,
          sms_tag: params.sms_tag,
          group_id: params.group_id,
          region_code: regionCode,
        }
        const res = await sendAgainHandler(newParams)
        if (res) {
          message.success('推送成功')
        }
        setIsModalOpen(false)
      }
    } catch (error) {}
  }

  useEffect(() => {}, [])

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

  const selTab = (value: string) => {
    console.log('selTab:', value)
  }

  const smsTag = [
    { sms_tag: '0', value: '空通道路由数据 ' },
    { sms_tag: '1', value: '未找到队列数据 ' },
  ]
  const smsType = [
    { sms_type: '1', value: '行业短信' },
    { sms_type: '2', value: '营销短信' },
  ]

  return (
    <Modal
      title={typeSend == '0' ? '状态推送' : '二次发送'}
      width={640}
      closable={false}
      onCancel={handleCancel}
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
        initialValues={{
          status: '1',
          appid: '0',
          sms_tag: '0',
          country_cn: '全部国家',
          region_code: '0',
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'>
        {/* <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item label='处理方式' name='type' validateTrigger='onSubmit'>
              <Radio.Group options={failTaskOptions} />
            </Form.Item>
          </Col>
        </Row> */}

        <ProFormDependency name={['type']}>
          {({ type }) => {
            return (
              <Row justify='space-between' gutter={30}>
                <Col span={12}>
                  <Form.Item
                    label='任务名称'
                    name='task_name'
                    hidden={type != '0'}>
                    <Input placeholder='请输入任务名称' />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label='国家名称'
                    name='country_cn'
                    hidden={type != '0'}>
                    <Select
                      showSearch
                      placeholder='请选择国家'
                      optionFilterProp='children'
                      onChange={seleCountry}
                      fieldNames={{ label: 'label', value: 'value' }}
                      filterOption={(input, option) =>
                        (option?.label + option.value ?? '')
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={props.allCountry}></Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label='任务名称'
                    name='task_name'
                    hidden={type != '1'}>
                    <Input placeholder='请输入任务名称' />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label='国家名称'
                    name='country_cn'
                    hidden={type != '1'}>
                    <Select
                      showSearch
                      placeholder='请选择国家'
                      optionFilterProp='children'
                      onChange={seleCountry}
                      fieldNames={{ label: 'label', value: 'value' }}
                      filterOption={(input, option) =>
                        (option?.label + option.value ?? '')
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={props.allCountry}></Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label='SMS_TAG'
                    name='sms_tag'
                    hidden={type != '1'}>
                    <Select
                      showSearch
                      placeholder='请选择sms_tag'
                      options={smsTag}
                      fieldNames={{ label: 'value', value: 'sms_tag' }}
                      optionFilterProp='value'
                      filterOption={(input, option) =>
                        (option?.value ?? '')
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }></Select>
                  </Form.Item>
                </Col>
                <Col span={size == 'small' ? 24 : 12}>
                  <Form.Item
                    label='通道组'
                    name='group_id'
                    hidden={type != '1'}>
                    <Select
                      showSearch
                      placeholder='请选择通道组'
                      options={props.channelsList}
                      fieldNames={{ label: 'name', value: 'id' }}
                      optionFilterProp='name'
                      filterOption={(input, option) =>
                        (option?.name ?? '')
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }></Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label='APPID' name='appid'>
                    <Select
                      showSearch
                      placeholder='请选择APPID'
                      options={props.appidList}
                      fieldNames={{ label: 'app', value: 'id' }}
                      optionFilterProp='name'
                      filterOption={(input, option) =>
                        (option?.name ?? '')
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }></Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label='短信类型' name='sms_type'>
                    <Select
                      showSearch
                      placeholder='请选择短信类型'
                      options={smsType}
                      fieldNames={{ label: 'value', value: 'sms_type' }}
                      optionFilterProp='value'
                      filterOption={(input, option) =>
                        (option?.value ?? '')
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }></Select>
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
