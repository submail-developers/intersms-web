import { useState, useImperativeHandle, forwardRef, useEffect } from 'react'
import { Modal, Form, Input, App, Row, Col, Select, Radio } from 'antd'
import { saveAlarmNotifierList, getAccountList } from '@/api'
import { API } from 'apis'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
import type { RadioChangeEvent } from 'antd'
import { waringTypeOptions, waringTimeOptions } from '@/utils/options'
import { ProFormDependency } from '@ant-design/pro-components'
import './addDialog.scss'

interface Props {
  onSearch: () => void
}
interface InitOpen {
  isAdd: boolean
  record?: API.GetalArmConfigListItems
}

const Dialog = ({ onSearch }: Props, ref: any) => {
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const [isAdd, setisAdd] = useState<boolean>(true)
  const [record, setrecord] = useState<API.GetalArmConfigListItems | null>(null)
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const open = (initValues: InitOpen) => {
    const { isAdd, record } = initValues
    setisAdd(isAdd)
    form.resetFields()
    form.setFieldsValue(initValues.record)
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

  let area: string
  let region_code: string
  let country_cn: string
  const seleCountry = (value: string, option: any) => {
    country_cn = option.label
    area = option.area
    region_code = option.value
  }

  let sender: string
  const seleAccount = (value: string, option: any) => {
    sender = option.account
  }
  const handleOk = async () => {
    try {
      const params = await form.validateFields()
      let newParams
      if (isAdd) {
        newParams = { country_cn, area, region_code, ...params }
      } else {
        if (record) newParams = { ...record, ...params }
      }
      const res = await saveAlarmNotifierList(newParams)
      if (res) {
        message.success('保存成功！')
      }
      setIsModalOpen(false)
      onSearch()
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

  return (
    <Modal
      title={isAdd ? '新增报警人员设置' : '编辑报警设置'}
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
        initialValues={{ status: '1', type: '1' }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'>
        <Row justify='space-between' gutter={30}>
          <>
            <Col span={12}>
              <Form.Item label='手机号码' name='mob'>
                <Input placeholder='请输入手机号码' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='姓名' name='name'>
                <Input placeholder='请输入姓名' />
              </Form.Item>
            </Col>
          </>
        </Row>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
