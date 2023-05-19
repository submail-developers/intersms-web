import { useState, useImperativeHandle, forwardRef, useEffect } from 'react'
import { Modal, Form, Input, App, Row, Col, Select } from 'antd'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
import styled from 'styled-components'
import { GetRegioncodeByCountry, saveNetWorkList } from '@/api'
import { API } from 'apis'
interface Props {
  onSearch: () => void
}

const GroupTitle = styled.div`
  font-size: 16px;
  color: #b2b2b2;
  margin-bottom: 10px;
`

const Dialog = (props: Props, ref: any) => {
  useEffect(() => {
    countryName()
  }, [])
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

  const [isAdd, setisAdd] = useState<boolean>(true)
  const [form] = Form.useForm()
  const { message } = App.useApp()
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const open = (initValues: any) => {
    const { isAdd } = initValues
    setisAdd(isAdd)
    form.resetFields()

    form.setFieldsValue(initValues.record)
    setIsModalOpen(true)
  }

  let area: string
  let region_code: string
  let country_cn: string
  const seleCountry = (value: string, option: any) => {
    country_cn = option.label
    area = option.area
    region_code = option.value
  }
  const handleOk = async () => {
    try {
      const params = await form.validateFields()
      let newParams = { country_cn, area, region_code, ...params }
      const res = await saveNetWorkList(newParams)
      if (res) {
        message.success('保存成功！')
      }
      setIsModalOpen(false)
      props.onSearch()
    } catch (error) {}
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const onFinish = () => {}
  const onFinishFailed = () => {}

  const onSearch = (value: string) => {
    console.log('search:', value)
  }

  return (
    <Modal
      title={isAdd ? '新增网络信息' : '编辑网络信息'}
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
        onFinish={onFinish}
        initialValues={{ price1: '0.9' }}
        onFinishFailed={onFinishFailed}
        autoComplete='off'>
        <Row>
          <Col span={24}>
            <Form.Item label='id' name='id' hidden>
              <Input placeholder='id' maxLength={30} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item label='网络名称' name='name'>
              <Input disabled={!isAdd} placeholder='请输入网络名称' />
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
                // bordered={false}
                placeholder='请选择'
                optionFilterProp='children'
                onChange={seleCountry}
                onSearch={onSearch}
                fieldNames={{ label: 'label', value: 'value' }}
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={CountryNameData}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <GroupTitle>国家价格配置</GroupTitle>
          </Col>
        </Row>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item
              label='成本价格'
              name='cost_price'
              validateTrigger='onSubmit'>
              <Input placeholder='请输入成本价格' suffix='元' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='建议零售价格'
              name='sug_price'
              validateTrigger='onSubmit'>
              <Input placeholder='请输入建议零售价格' suffix='元' />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
