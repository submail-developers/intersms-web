import { useState, useImperativeHandle, forwardRef } from 'react'
import {
  Modal,
  Form,
  Input,
  App,
  Row,
  Col,
  Radio,
  Select,
  Button,
  Upload,
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { useAppSelector } from '@/store/hook'
import { blackState } from '@/store/reducers/black'
import { addBlackMobileList } from '@/api'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
// import type { RadioValueType } from 'antd/es/radio/Group'
import type { RadioChangeEvent } from 'antd'
interface Props {
  onSearch: () => void
}

const props: UploadProps = {
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  onChange({ file, fileList }) {
    if (file.status !== 'uploading') {
      console.log(file, fileList)
    }
  },
  defaultFileList: [
    // {
    //   uid: '1',
    //   name: 'xxx.png',
    //   status: 'uploading',
    //   url: 'http://www.baidu.com/xxx.png',
    //   percent: 33,
    // },
    // {
    //   uid: '2',
    //   name: 'yyy.png',
    //   status: 'done',
    //   url: 'http://www.baidu.com/yyy.png',
    // },
    // {
    //   uid: '3',
    //   name: 'zzz.png',
    //   status: 'error',
    //   response: 'Server Error 500', // custom error message to show
    //   url: 'http://www.baidu.com/zzz.png',
    // },
  ],
}

const Dialog = ({ onSearch }: Props, ref: any) => {
  const [form] = Form.useForm()
  const blackStore = useAppSelector(blackState)
  const { message } = App.useApp()
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const open = () => {
    form.resetFields()
    setIsModalOpen(true)
  }
  let list_id: any
  list_id = blackStore.activeBlack?.id || ''
  const handleOk = async () => {
    try {
      const params = await form.validateFields()
      params.list_id = list_id

      const res = await addBlackMobileList(params)
      if (res) {
        message.success('保存成功！')
      }
      onSearch()
      setIsModalOpen(false)
    } catch (error) {}
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
    { label: '行业短信', value: '1' },
    { label: '营销短信', value: '2' },
  ]
  const { TextArea } = Input
  return (
    <Modal
      data-class='dialog'
      title='新增黑名单'
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
        initialValues={{ type: ['1'] }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'>
        <Row>
          <Col span={24}>
            <Form.Item label='list_id' name='list_id' hidden>
              <Input placeholder='list_id' maxLength={30} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label={
            <div>
              黑名单手机号
              <span
                className='color-gray'
                style={{ fontSize: '12px', paddingLeft: '20px' }}>
                多个联系人号码导入时，请每行输入一个手机号码
              </span>
            </div>
          }
          labelCol={{ span: 24 }}
          name='mobile'>
          <TextArea
            rows={6}
            className='color-words'
            style={{ fontSize: '16px' }}
          />
        </Form.Item>
        <Form.Item label='从文件导入'>
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
        {/* <Form.Item
          label='黑名单手机号'
          name='mobile'
          validateTrigger='onSubmit'
          rules={
            [
              // { message: '请输入' },
              // {
              //   type: 'number',
              //   message: '请输入正确的手机号!',
              // },
            ]
          }>
          <Input placeholder='请输入手机号' maxLength={30} />
        </Form.Item> */}
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
