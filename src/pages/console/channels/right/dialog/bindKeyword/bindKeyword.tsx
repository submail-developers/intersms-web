import { useState, useImperativeHandle, forwardRef } from 'react'
import { Modal, Form, Input, App, Row, Col, Select, Radio } from 'antd'
import { getKeywordEnabledList, channelGroupUpdateKeyword } from '@/api'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
import { API } from 'apis'
import { bindTypeOptions } from '@/utils/options'

interface Props {
  onSearch: (flag?: boolean) => void
}

// 新增时初始化的值
const initialValues = {
  bind: '1',
}

const Dialog = (props: Props, ref: any) => {
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const [wordList, setWordList] = useState<API.GetKeywordEnabledItems[]>([])
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [channelItem, setchannelItem] =
    useState<API.GetChannelGroupRelatedDataItem>()

  const open = (record: API.GetChannelGroupRelatedDataItem) => {
    setchannelItem(record)
    initWord()
    form.resetFields()
    let initVlaues
    if (record.keyroute_list.length > 0) {
      const { keyroute_id, keyroute_keywords } = record.keyroute_list[0]
      initVlaues = {
        keywords_route_id: keyroute_id,
        keywords: keyroute_keywords,
      }
    } else {
      initVlaues = initialValues
    }
    form.setFieldsValue(initVlaues)
    setIsModalOpen(true)
  }
  const initWord = async () => {
    const res = await getKeywordEnabledList()
    console.log(res)
    setWordList(res.data)
  }

  const handleOk = async () => {
    try {
      if (channelItem == undefined) return
      let formValues = await form.getFieldsValue()
      console.log(formValues)
      await channelGroupUpdateKeyword({
        group_id: channelItem.group_id,
        channel_id: channelItem.channel_id,
        keywords_route_id: formValues.keywords_route_id,
        // isbind: formValues.isbind
      })
      message.success('保存成功！')
      props.onSearch(true)
      setIsModalOpen(false)
    } catch (error) {}
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const onChange = async (value: string, option: any) => {
    let formvalues = await form.getFieldsValue()
    form.setFieldsValue({ ...formvalues, keywords: option.keywords })
  }

  return (
    <Modal
      title='关键词绑定'
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
        <Row justify='space-between' gutter={30}>
          <Col span={24}>
            <Form.Item label='关键词绑定' name='bind'>
              <Radio.Group options={bindTypeOptions}></Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row justify='space-between' gutter={30}>
          <Col span={24}>
            <Form.Item label='选择关键词条目' name='keywords_route_id'>
              <Select
                fieldNames={{ label: 'name', value: 'id' }}
                showSearch
                placeholder='请选择'
                optionFilterProp='children'
                onChange={onChange}
                filterOption={(input, option) =>
                  (option?.name ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={wordList}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify='space-between' gutter={30}>
          <Col span={24}>
            <Form.Item label='' name='keywords'>
              <Input.TextArea disabled autoSize={{ minRows: 2, maxRows: 6 }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
