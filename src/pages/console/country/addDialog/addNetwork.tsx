import {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useRef,
} from 'react'
import { Modal, Form, Input, App, Row, Col, Select, Radio } from 'antd'
import {
  saveAlarmConfigList,
  getAccountList,
  GetRegioncodeByCountry,
  addNetwork,
  saveChaneNetwork,
} from '@/api'
import { API } from 'apis'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
import type { RadioChangeEvent } from 'antd'

interface Props {
  onSearch: () => void
}
interface InitOpen {
  isAdd: boolean
  record?: API.GetSingleCountryInfoItems
}

const Dialog = ({ onSearch }: Props, ref: any) => {
  const recordCopyRef = useRef(null)
  const recordEditCopyRef = useRef(null)
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const [isAdd, setisAdd] = useState<boolean>(true)
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

  let country_cn: string
  let region_code: string
  let channel_id: string
  let channel_name: string

  let id: string
  let type = 2
  let price = ''
  let comment = ''

  const open = (initValues: InitOpen) => {
    const { isAdd, record } = initValues
    country_cn = record.country_cn
    region_code = record.region_code
    channel_id = record.channel_id
    channel_name = record.channel_name
    id = record.id

    setisAdd(isAdd)
    form.resetFields()
    form.setFieldsValue(initValues.record)
    recordCopyRef.current = {
      country_cn,
      region_code,
      channel_id,
      channel_name,
    }
    recordEditCopyRef.current = {
      id,
      type,
      price,
      comment,
    }
    setIsModalOpen(true)
    if (isAdd) {
      countryName()
      associatedAccount()
    } else {
      // if (record) {
      //   let arr: API.GetSingleCountryInfoItems[] = [
      //     {
      //       label: record.country_cn,
      //       value: record.region_code,
      //     },
      //   ]
      //   setCountryNameData(arr)
      //   setrecord(record)
      // }
    }
  }

  const handleOk = async () => {
    if (isAdd) {
      try {
        const params = await form.validateFields()
        const res = await addNetwork({
          ...params,
          ...recordCopyRef.current,
        })
        if (res) {
          message.success('保存成功！')
        }
        setIsModalOpen(false)
        onSearch()
      } catch (error) {}
    } else {
      try {
        const params = await form.validateFields()
        const res = await saveChaneNetwork({
          ...params,
          ...recordEditCopyRef.current,
        })
        if (res) {
          message.success('保存成功！')
        }
        setIsModalOpen(false)
        onSearch()
      } catch (error) {}
    }
  }

  useEffect(() => {}, [])

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
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item
              label='网络名称'
              name='network_name'
              validateTrigger='onSubmit'
              rules={[{ message: '请输入' }]}>
              <Input placeholder='请输入网络名称' maxLength={30} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='成本价'
              name='network_price'
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
