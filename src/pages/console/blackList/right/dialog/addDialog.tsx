import axios from 'axios'
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

import { useAppSelector } from '@/store/hook'
import { blackState } from '@/store/reducers/black'
import { addBlackMobileList, uploadBlackMobileList } from '@/api'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
import { UploadOutlined } from '@ant-design/icons'
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
      console.log(file.type)
      const isConform =
        file.type === 'text/plain' ||
        file.type === 'text/csv' ||
        file.type === 'text/directory' ||
        file.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel'
      if (!isConform) {
        message.error(`${file.name} 不符合上传文件的格式`)
        return isConform || Upload.LIST_IGNORE
      }
      setFileList([...fileList, file])

      return false
    },
    fileList,
  }

  let list_id: any
  list_id = blackStore.activeBlack?.id || ''
  const handleOk = async () => {
    try {
      const params = await form.validateFields()
      params.list_id = list_id
      fileList.map((item) => (params.file = item))

      const res = await uploadBlackMobileList(params)
      if (res) {
        message.success('保存成功！')
      }
      setIsModalOpen(false)
      onSearch()
    } catch (error) {}
  }

  // 点击取消
  const handleCancel = () => {
    setIsModalOpen(false)
    // deleFile()
  }

  const deleFile = (file) => {
    if (file.status === 'removed') {
      return true
    }
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
                多个联系人号码输入时，请用逗号隔开
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
          <div key={Math.random()}>
            <Upload {...props} onRemove={(file) => deleFile(file)}>
              <Button icon={<UploadOutlined />}>选择文件</Button>
              <p
                className='color-gray'
                style={{ fontSize: '12px', margin: '0px' }}>
                仅支持 TXT , CSV, VCF , excel 格式
              </p>
            </Upload>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
