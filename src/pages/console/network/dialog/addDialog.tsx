import { useState, useImperativeHandle, forwardRef, useRef } from 'react'
import { Modal, Form, Input, App, Row, Col, Select } from 'antd'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
import styled from 'styled-components'
import { GetRegioncodeByCountry, saveNetWorkList } from '@/api'
import { API } from 'apis'
interface Props {
  onSearch: () => void
}

const GroupTitle = styled.div`
  font-size: 15px;
  color: #b2b2b2;
  margin-bottom: 10px;
`

interface InitOpen {
  record?: API.GetNetWorkListItems
}

const Dialog = (props: Props, ref: any) => {
  const [CountryNameData, setCountryNameData] = useState<API.CountryItem[]>([])
  const [record, setrecord] = useState<API.GetNetWorkListItems | null>(null)
  const countryInfo = useRef(null) // 切换地区的信息
  const countryAllList = useRef(null) // 临时存储筛选后的所有地区
  const countryName = async () => {
    if (CountryNameData.length > 1) return
    if (countryAllList.current) {
      setCountryNameData(countryAllList.current)
      return
    }
    const res = await GetRegioncodeByCountry({
      country_cn: '',
      keyword: '',
    })
    let arr: API.CountryItem[] = []
    res.data.forEach((item: any) => {
      arr = [...arr, ...item.children]
    })
    countryAllList.current = arr
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

  const open = (initValues: InitOpen) => {
    const { record } = initValues
    setisAdd(!Boolean(record))
    form.resetFields()
    form.setFieldsValue(initValues.record)
    setIsModalOpen(true)
    if (!Boolean(record)) {
      countryName()
    } else {
      if (record) {
        setCountryNameData([
          {
            label: record.country_cn,
            value: record.region_code,
            area: record.area,
          },
        ])
        setrecord(record)
      }
    }
  }
  const seleCountry = (value: string, option: API.CountryItem) => {
    countryInfo.current = {
      area: option.area,
      country_cn: option.label,
      region_code: option.value,
    }
  }
  const handleOk = async () => {
    try {
      const params = await form.validateFields()
      let newParams = isAdd
        ? { ...params, ...countryInfo.current }
        : { ...record, ...params }
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
        initialValues={{ price1: '0.9' }}
        autoComplete='off'>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item label='网络名称' name='name'>
              <Input disabled={!isAdd} placeholder='请输入网络名称' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='国家/地区名称'
              name='country_cn'
              validateTrigger='onSubmit'>
              <Select
                showSearch
                disabled={!isAdd}
                placeholder='请选择'
                optionFilterProp='children'
                onChange={seleCountry}
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
        <Row>
          <Col span={24}>
            <GroupTitle>国家/地区价格配置</GroupTitle>
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
