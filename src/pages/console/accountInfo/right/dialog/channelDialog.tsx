import { useState, useImperativeHandle, forwardRef, useEffect } from 'react'
import { Modal, Form, Input, App, Row, Col, Radio, Select } from 'antd'
import { updateAccountChannel, getChannelGroupList, getAppid } from '@/api'
import { useAppSelector } from '@/store/hook'
import { accountInfoState } from '@/store/reducers/accountInfo'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
import { API } from 'apis'
import { channelsTypeOptions2 } from '@/utils/options'
interface Props {
  allCountry: API.CountryItem[]
  onUpdateTable: () => void
}

interface FormType extends API.UpdateAccountChannelParams {}

// 新增时初始化的值
const initialValues: FormType = {
  id: '', // 客户ID
  sender: '', // 客户account
  appid: '0', // 0所有
  group_type: '1', // 通道类型   1行业通道  2营销通道
  signature: '', // 签名 需带【】
  country_cn: undefined, // 国家中文名称
  group_id: undefined, // 通道组id
}
function Dialog(props: Props, ref: any) {
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
  const [channelsList, setchannelsList] = useState<
    API.GetChannelGroupListItem[]
  >([])
  const [appidList, setappidList] = useState<API.GetAppidItem[]>([])

  const open = (record: API.UpdateAccountChannelParams = initialValues) => {
    form.resetFields()
    if (record.id != '') {
      // 编辑
      setisAdd(false)
      const _initValues: FormType = {
        ...initialValues,
        ...record,
      }
      // _initValues.signature = _initValues.signature.replace(/【|】/g, '')
      _initValues.signature = _initValues.signature

      form.setFieldsValue(_initValues)
    } else {
      setisAdd(true)
      form.setFieldsValue(initialValues)
    }
    setIsModalOpen(true)
    getChannelsList()
    getAppidList()
  }

  const getChannelsList = async () => {
    const res = await getChannelGroupList({})
    const enabledchannelsList = res.data.filter((item) => item.enabled == '1')
    setchannelsList(enabledchannelsList)
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
      let params: FormType = {
        ...formvalues,
        sender: accountInfoStore.activeAccount?.account,
      }
      params.signature = `${params.signature}`
      await updateAccountChannel(params)
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
      title={`${isAdd ? '新增' : '编辑'}国家通道配置`}
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
        <Form.Item label='国家/地区名称' name='country_cn'>
          <Select
            showSearch
            placeholder='请选择'
            fieldNames={{ value: 'label' }}
            optionFilterProp='children'
            filterOption={(input, option) =>
              (option?.label + option.value ?? '')
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            options={props.allCountry}
          />
        </Form.Item>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item label='通道组' name='group_id'>
              <Select
                showSearch
                // bordered={false}
                placeholder='请选择'
                optionFilterProp='children'
                fieldNames={{ label: 'name', value: 'id' }}
                filterOption={(input, option) =>
                  (option?.name ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={channelsList}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='通道组类型' name='group_type'>
              <Radio.Group options={channelsTypeOptions2} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item label='APPID' name='appid'>
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
            <Form.Item label='Sender' name='signature'>
              <Input placeholder='SUBMAIL' maxLength={30} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
