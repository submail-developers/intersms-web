import { useState, useImperativeHandle, forwardRef } from 'react'
import { Modal, Form, Input, App, Row, Col, Radio, Select } from 'antd'
import { updateAccountError, getAppid } from '@/api'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
import { useAppSelector } from '@/store/hook'
import { accountInfoState } from '@/store/reducers/accountInfo'
import { ProFormDependency } from '@ant-design/pro-components'
import { API } from 'apis'
import { channelsTypeOptions2 } from '@/utils/options'

interface Props {
  allCountry: API.CountryItem[]
  onUpdateTable: () => void
}

interface FormType extends API.UpdateAccountErrorParams {}

// 新增时初始化的值
const initialValues: FormType = {
  id: '',
  sender: '',
  appid: '0',
  sms_type: '1',
  response_time: '',
  delivrd: '',
  undeliv: '',
  expired: '',
  accepted: '',
  unknown: '',
  rejected: '',
  spname: '',
}
const Dialog = (props: Props, ref: any) => {
  const accountInfoStore = useAppSelector(accountInfoState)
  const { message } = App.useApp()
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAdd, setisAdd] = useState(false)
  const [appidList, setappidList] = useState<API.GetAppidItem[]>([])

  const open = (record: API.UpdateAccountErrorParams = initialValues) => {
    form.resetFields()
    if (record) {
      // 编辑
      setisAdd(false)
      const _initValues: FormType = {
        ...initialValues,
        ...record,
      }
      form.setFieldsValue(_initValues)
    } else {
      setisAdd(true)
      form.setFieldsValue(initialValues)
    }
    setIsModalOpen(true)
    getAppidList()
  }

  const getAppidList = async () => {
    const res = await getAppid({
      sender: accountInfoStore.activeAccount?.account || '',
    })
    let list = [...res.data]
    list.unshift({
      id: '0',
      app: '全部',
    })
    setappidList(list)
  }
  const handleOk = async () => {
    try {
      const formvalues = await form.getFieldsValue()
      let params = {
        ...formvalues,
        sender: accountInfoStore.activeAccount?.account,
      }
      await updateAccountError(params)
      message.success('保存成功！')
      props.onUpdateTable()
      setIsModalOpen(false)
    } catch (error) {}
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <Modal
      data-class='dialog'
      title={`${isAdd ? '新增' : '编辑'}失败处理配置`}
      width={640}
      closable={false}
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
        <Form.Item label='id' name='id' hidden>
          <Input />
        </Form.Item>
        <Form.Item labelCol={{ span: 24 }} label='国家/地区名称' name='name'>
          <Select
            showSearch
            placeholder='请选择'
            fieldNames={{ value: 'label' }}
            optionFilterProp='children'
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={props.allCountry}
          />
        </Form.Item>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item label='APPID' name='appid' labelCol={{ span: 24 }}>
              <Select
                showSearch
                placeholder='请选择'
                optionFilterProp='children'
                fieldNames={{ label: 'app', value: 'id' }}
                filterOption={(input, option) =>
                  (option?.app ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={appidList}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              label='通道组类型'
              name='sms_type'>
              <Radio.Group options={channelsTypeOptions2} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              label='response_time'
              name='response_time'>
              <Input placeholder='' maxLength={30} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item labelCol={{ span: 24 }} label='delivrd' name='delivrd'>
              <Input placeholder='' maxLength={30} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item labelCol={{ span: 24 }} label='undeliv' name='undeliv'>
              <Input placeholder='' maxLength={30} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item labelCol={{ span: 24 }} label='expired' name='expired'>
              <Input placeholder='' maxLength={30} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item labelCol={{ span: 24 }} label='accepted' name='accepted'>
              <Input placeholder='' maxLength={30} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item labelCol={{ span: 24 }} label='unknown' name='unknown'>
              <Input placeholder='' maxLength={30} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item labelCol={{ span: 24 }} label='rejected' name='rejected'>
              <Input placeholder='' maxLength={30} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item labelCol={{ span: 24 }} label='spname' name='spname'>
              <Input placeholder='' maxLength={30} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
