import { useState, useImperativeHandle, forwardRef } from 'react'
import { Modal, Form, Input, App, Row, Col, Select, Divider } from 'antd'
import {
  GetRegioncodeByCountry,
  getAccountList,
  saveMobileRouteList,
} from '@/api'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
import type { RadioChangeEvent } from 'antd'
import { useSize } from '@/hooks'
import { API } from 'apis'

import './addDialog.scss'

interface Props {
  allChannelData: API.GetAllChannelIdParamsItems[]
  messageList: any
  onSearch: () => void
}
interface InitOpen {
  isAdd: boolean
  record?: API.GetMobileRouteListItems
}
const Dialog = (props: Props, ref: any) => {
  const [CountryNameData, setCountryNameData] = useState<
    API.GetRegioncodeByCountryItems[]
  >([])
  const [associatedAccountData, setAssociatedAccountData] = useState<
    API.AccountListItem[]
  >([])
  const [record, setrecord] = useState<API.GetMobileRouteListItems | null>(null)
  const { Option } = Select
  const size = useSize()
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const [isAdd, setisAdd] = useState<boolean>(true)
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
  // 国家名称
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
  const associatedAccount = async () => {
    const res = await getAccountList({
      keyword: '',
    })
    // setAssociatedAccountData(res.data)
    setAssociatedAccountData([
      {
        sender: '全平台',
        id: '0',
        account: '0',
        region_code: '0',
        channel_id: '0',
        network: '0',
        name: '',
        info_path: '',
        mke_flg: '0',
        test_flg: '0',
      },
      ...res.data,
    ])
  }

  let region_code: string
  let country_cn: string
  const seleCountry = (value: string, option: any) => {
    country_cn = option.label
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
        newParams = { sender, country_cn, region_code, ...params }
      } else {
        if (record) newParams = { ...record, ...params }
      }
      const res = await saveMobileRouteList(newParams)
      if (res) {
        message.success('保存成功！')
      }
      setIsModalOpen(false)
      props.onSearch()
    } catch (error) {}
    // try {
    //   const params = await form.validateFields()

    //   const res = await saveMobileRouteList(params)
    //   if (res) {
    //     message.success('保存成功！')
    //   }
    //   setIsModalOpen(false)
    //   props.onSearch()
    // } catch (error) {}
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
  const smsType = [
    // { label: '短信类型', value: 'all' },
    { label: '行业短信', value: '1' },
    { label: '营销短信', value: '2' },
  ]

  const onChange1 = (value: string) => {
    console.log(`selected ${value}`)
  }

  const onSearch = (value: string) => {
    console.log('search:', value)
  }

  return (
    <Modal
      title={isAdd ? '新增号码通道路由' : '编辑号码通道路由'}
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
        initialValues={{
          trade_group: '1',
          sale_group: '2',
          message_type: '行业/验证码',
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item label='手机号码' name='mobile'>
              <Input disabled={!isAdd} placeholder='请输入手机号码' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='短信类型' name='type'>
              <Select
                disabled={!isAdd}
                showSearch
                placeholder='请选择短信类型'
                optionFilterProp='children'
                // options={props.messageList}
                options={smsType}
                onChange={onChange1}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item
              label='关联账号'
              // name='account'
              name={sender == '0' ? '全平台' : 'account'}
              validateTrigger='onSubmit'>
              <Select
                showSearch
                disabled={!isAdd}
                placeholder='请选择'
                optionFilterProp='children'
                onChange={seleAccount}
                onSearch={onSearch}
                fieldNames={{ label: 'sender', value: 'account' }}
                filterOption={(input, option) =>
                  (option?.sender ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={associatedAccountData}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='国家/地区名称'
              name={isAdd ? '' : 'country_cn'}
              validateTrigger='onSubmit'>
              <Select
                showSearch
                disabled={!isAdd}
                placeholder='请选择'
                optionFilterProp='children'
                onChange={seleCountry}
                onSearch={onSearch}
                fieldNames={{ label: 'label', value: 'value' }}
                filterOption={(input, option) =>
                  (option?.label + option.value ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={CountryNameData}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item label='通道' name='channel' validateTrigger='onSubmit'>
              <Select
                showSearch
                // bordered={false}
                placeholder='请选择通道'
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
          <Col span={12}>
            <Form.Item label='发送名' name='name'>
              <Input placeholder='请输入发送名' />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
