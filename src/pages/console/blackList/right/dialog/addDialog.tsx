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
// import { UploadOutlined } from '@ant-design/icons'
// import type { UploadProps } from 'antd'
import { useAppSelector } from '@/store/hook'
import { blackState } from '@/store/reducers/black'
import { addBlackMobileList, uploadBlackMobileList } from '@/api'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
import { UploadOutlined } from '@ant-design/icons'
// import type { RadioValueType } from 'antd/es/radio/Group'
import type { RadioChangeEvent } from 'antd'
interface Props {
  onSearch: () => void
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

  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [uploading, setUploading] = useState(false)
  const handleUpload = () => {
    const formData = new FormData()
    fileList.forEach((file) => {
      formData.append('files[]', file as RcFile)
    })
    setUploading(true)
    // You can use any AJAX library you like
    fetch('apiscustomer/save_mobile_block_items', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then(() => {
        setFileList([])
        message.success('upload successfully.')
      })
      .catch(() => {
        message.error('upload failed.')
      })
      .finally(() => {
        setUploading(false)
      })
  }
  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file])

      return false
    },
    fileList,
  }

  let list_id: any
  list_id = blackStore.activeBlack?.id || ''
  const handleOk = async () => {
    try {
      console.log(fileList[0], 'fileList')
      let file: any
      // fileList.map((item) => (file = item.name))
      const params = await form.validateFields()
      params.list_id = list_id
      params.file = fileList[0]

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
            style={{ fontSize: '16px', color: '#282b31' }}
          />
        </Form.Item>
        <Form.Item label='从文件导入'>
          {/* <Upload {...props}>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload> */}
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
          <Button
            type='primary'
            onClick={handleUpload}
            disabled={fileList.length === 0}
            loading={uploading}
            style={{ marginTop: 16 }}>
            {uploading ? 'Uploading' : 'Start Upload'}
          </Button>
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
