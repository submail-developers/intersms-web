import { useState, useImperativeHandle, forwardRef, useEffect } from 'react'
import { Modal, Form, Input, App, Row, Col, Select, Radio } from 'antd'
import {
  saveAlarmConfigList,
  getAllChannelId,
  getAccountList,
  GetRegioncodeByCountry,
} from '@/api'
import { API } from 'apis'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
import type { RadioChangeEvent } from 'antd'
import { waringTypeOptions, waringTimeOptions } from '@/utils/options'
import { ProFormDependency } from '@ant-design/pro-components'

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
      countryName()
      associatedAccount()
    } else {
      if (record) {
        let arr: API.GetRegioncodeByCountryItems[] = [
          {
            label: record.country_cn,
            value: record.region_code,
          },
        ]
        setCountryNameData(arr)
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
      const res = await saveAlarmConfigList(newParams)
      if (res) {
        message.success('保存成功！')
      }
      setIsModalOpen(false)
      onSearch()
    } catch (error) {}
  }

  useEffect(() => {
    allGroupId()
  }, [])
  // 通道名称
  const allGroupId = async () => {
    const res = await getAllChannelId('')
    setallChannelData(res.data)
  }
  const [allChannelData, setallChannelData] = useState<
    API.GetAllChannelIdParamsItems[]
  >([])

  // 国家名称
  const [CountryNameData, setCountryNameData] = useState<
    API.GetRegioncodeByCountryItems[]
  >([])
  const countryName = async () => {
    const res = await GetRegioncodeByCountry({
      country_cn: '',
      keyword: '',
    })
    let arr: any = []
    res.data.map((item: any) => {
      arr = [...arr, ...item.children]
    })
    setCountryNameData(arr)
  }

  // 关联账号列表
  const [associatedAccountData, setAssociatedAccountData] = useState<
    API.AccountListItem[]
  >([])
  const associatedAccount = async () => {
    const res = await getAccountList({
      keyword: '',
    })
    setAssociatedAccountData(res.data)
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

  const selTab = (value: string) => {
    console.log('selTab:', value)
  }

  return (
    <Modal
      title={isAdd ? '新增网络' : '编辑网络'}
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
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item
              label='网络名称'
              name='name'
              validateTrigger='onSubmit'
              rules={[{ message: '请输入' }]}>
              <Input placeholder='请输入网络名称' maxLength={30} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='成本价'
              name='name'
              validateTrigger='onSubmit'
              rules={[{ message: '请输入' }]}>
              <Input placeholder='请输入成本价' maxLength={30} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
