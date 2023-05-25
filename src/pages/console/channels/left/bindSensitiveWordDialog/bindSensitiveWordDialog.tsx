import { useState, useImperativeHandle, forwardRef } from 'react'
import { Modal, Form, Input, App, Row, Col, Select, Radio } from 'antd'
import { getOpenSensitiveWordList, channelGroupBindSensitiveWord } from '@/api'
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
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const [wordList, setWordList] = useState<API.GetSensitiveWordListItems[]>([])
  const [channelsItem, setchannelsItem] =
    useState<API.GetChannelGroupListItem>()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const open = (record: API.GetChannelGroupListItem) => {
    setchannelsItem(record)
    form.resetFields()
    let initVlaues
    if (record.sens_word_list.length > 0) {
      initVlaues = { ...record.sens_word_list[0] }
    } else {
      initVlaues = initialValues
    }
    form.setFieldsValue(initVlaues)
    setIsModalOpen(true)
    initWord()
  }
  const initWord = async () => {
    const res = await getOpenSensitiveWordList({ id: '', page: '1' })
    setWordList(res.data)
  }

  const handleOk = async () => {
    try {
      if (channelsItem == undefined) return
      let formValues = await form.getFieldsValue()
      await channelGroupBindSensitiveWord({
        group_id: channelsItem?.id,
        sens_id: formValues.sens_id,
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
      title='敏感词绑定'
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
            <Form.Item label='敏感词绑定' name='bind'>
              <Radio.Group options={bindTypeOptions}></Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row justify='space-between' gutter={30}>
          <Col span={24}>
            <Form.Item label='选择敏感词条目' name='sens_id'>
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
            <Form.Item label='' name='keywords' validateTrigger='onSubmit'>
              <Input.TextArea disabled autoSize={{ minRows: 2, maxRows: 6 }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
