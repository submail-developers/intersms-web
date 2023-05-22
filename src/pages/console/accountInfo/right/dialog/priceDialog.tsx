import { useState, useImperativeHandle, forwardRef } from 'react'
import { Modal, Form, Input, App, Row, Col, Radio, Select } from 'antd'
import { updateAccountPrice } from '@/api'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
import { useAppSelector } from '@/store/hook'
import { accountInfoState } from '@/store/reducers/accountInfo'
import { ProFormDependency } from '@ant-design/pro-components'
import { channelPriceTypeOptions } from '@/utils/options'
import { API } from 'apis'
interface Props {
  allCountry: API.CountryItem[]
  onUpdateTable: () => void
}

interface FormType extends API.UpdateAccountPriceParams {
  type: '1' | '2' // 通道类型   1行业通道  2营销通道
}

// 新增时初始化的值
const initialValues: FormType = {
  id: '',
  sender: '',
  price_tra: '',
  price_mke: '',
  country_cn: '',
  type: '1',
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

  const open = (record: API.UpdateAccountPriceParams = initialValues) => {
    form.resetFields()
    if (record) {
      // 编辑
      setisAdd(false)
      const _initValues: FormType = {
        ...initialValues,
        ...record,
        type: Number(record.price_mke) > 0 ? '2' : '1',
      }
      form.setFieldsValue(_initValues)
    } else {
      setisAdd(true)
      form.setFieldsValue(initialValues)
    }
    setIsModalOpen(true)
  }

  const handleOk = async () => {
    try {
      const formvalues = await form.getFieldsValue()
      let params = {
        ...formvalues,
        sender: accountInfoStore.activeAccount?.account,
      }
      // 因为table列表里没有类型字段，所以需要非该类型的值清空
      if (params.type == '1') {
        // 1行业通道
        params.price_mke = ''
      } else {
        // 2营销通道
        params.price_tra = ''
      }
      delete params.type
      await updateAccountPrice(params)
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
      title={`${isAdd ? '新增' : '编辑'}国家价格配置`}
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
        <Form.Item label='id' hidden name='id'>
          <Input />
        </Form.Item>
        <Form.Item label='国家/地区名称' name='country_cn'>
          <Select
            showSearch
            placeholder='请选择'
            optionFilterProp='children'
            fieldNames={{ value: 'label' }}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={props.allCountry}
          />
        </Form.Item>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item label='短信类型' name='type' validateTrigger='onSubmit'>
              <Radio.Group options={channelPriceTypeOptions} />
            </Form.Item>
          </Col>

          <ProFormDependency name={['type']}>
            {({ type }) => {
              return (
                <Col span={12}>
                  <Form.Item
                    hidden={type != '1'}
                    label='行业价格'
                    name='price_tra'
                    validateTrigger='onSubmit'
                    rules={[
                      { message: '请输入' },
                      {
                        type: 'number',
                        message: '请输入正确的数字!',
                      },
                    ]}>
                    <Input placeholder='请输入价格' maxLength={30} />
                  </Form.Item>
                  <Form.Item
                    hidden={type != '2'}
                    label='营销价格'
                    name='price_mke'
                    validateTrigger='onSubmit'
                    rules={[
                      { message: '请输入' },
                      {
                        type: 'number',
                        message: '请输入正确的数字!',
                      },
                    ]}>
                    <Input placeholder='请输入价格' maxLength={30} />
                  </Form.Item>
                </Col>
              )
            }}
          </ProFormDependency>
        </Row>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
