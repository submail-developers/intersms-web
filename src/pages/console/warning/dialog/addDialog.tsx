import { useState, useImperativeHandle, forwardRef, useEffect } from 'react'
import { Modal, Form, Input, App, Row, Col, Select, Radio } from 'antd'
import {
  saveAlarmConfigList,
  getAllChannelId,
  GetRegioncodeByCountry,
} from '@/api'
import { API } from 'apis'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
import type { RadioChangeEvent } from 'antd'
import { waringTypeOptions } from '@/utils/options'
import { ProFormDependency } from '@ant-design/pro-components'
import './addDialog.scss'

interface Props {
  // onSearch: () => void
}
interface InitOpen {
  isAdd: boolean
  record?: API.GetalArmConfigListItems
}

const Dialog = (props: Props, ref: any) => {
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

  const handleOk = async () => {
    try {
      const params = await form.validateFields()
      // const res = await saveAlarmConfigList(params)
      console.log(params, '?????')
      // if (res) {
      //   message.success('保存成功！')
      // }
      // setIsModalOpen(false)
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

  const onSearch = (value: string) => {
    console.log('search:', value)
  }
  const selTab = (value: string) => {
    console.log('selTab:', value)
  }

  return (
    <Modal
      title={isAdd ? '新增报警设置' : '编辑报警设置'}
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
        initialValues={{ status: '1', access_type: '1' }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item label='报警类型' name='access_type'>
              <Select
                showSearch
                // bordered={false}
                placeholder='请选择'
                optionFilterProp='children'
                onChange={onChange1}
                onSearch={onSearch}
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={waringTypeOptions}
              />
            </Form.Item>
          </Col>
          <ProFormDependency name={['access_type']}>
            {({ access_type }) => {
              return (
                <>
                  <Col span={12}>
                    <Form.Item
                      hidden={access_type != '1'}
                      name='type'
                      label='账号报警'>
                      <Input placeholder='请输入账号' maxLength={30} />
                    </Form.Item>
                    <Form.Item
                      hidden={access_type != '2'}
                      label='通道报警'
                      name='type'
                      validateTrigger='onSubmit'>
                      <Select
                        showSearch
                        placeholder='请选择通道'
                        optionFilterProp='children'
                        options={allChannelData}
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
                    {/* <Form.Item
                      label='国家报警'
                      name='type'
                      hidden={access_type != '4'}>
                      <Input placeholder='请输入国家地区' maxLength={30} />
                    </Form.Item> */}
                    <Form.Item
                      hidden={access_type != '4'}
                      label='国家/地区名称'
                      name='type'
                      validateTrigger='onSubmit'>
                      <Select
                        showSearch
                        placeholder='请选择'
                        optionFilterProp='children'
                        // onChange={seleCountry}
                        // onSearch={onSearch}
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
                </>
              )
            }}
          </ProFormDependency>
        </Row>
        <Row>
          <Col span={24}>
            <div className='group-title'>报警条件</div>
          </Col>
        </Row>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item
              label='报警时间范围'
              name='time'
              validateTrigger='onSubmit'>
              <Input placeholder='请输入报警时间范围' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='报警最小条数' name='min_length'>
              <Input placeholder='请输入最小条数' />
            </Form.Item>
          </Col>
        </Row>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item label='失败率' name='fail' validateTrigger='onSubmit'>
              <Input placeholder='请输入失败率' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='报警开关' name='status'>
              <Radio.Group
                options={[
                  { label: '打开', value: '1' },
                  { label: '关闭', value: '2' },
                ]}
                onChange={onChange}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
