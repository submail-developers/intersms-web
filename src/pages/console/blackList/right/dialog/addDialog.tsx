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
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'
import { UploadOutlined } from '@ant-design/icons'
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
    setFileList([])
    setIsModalOpen(true)
  }

  const [fileList, setFileList] = useState<UploadFile[]>([])
  const props: UploadProps = {
    onRemove: (file) => {
      const arr = fileList.filter((item) => item != file)
      setFileList(arr)
    },
    beforeUpload: (file) => {
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

  const handleOk = async () => {
    message.loading('')
    try {
      const params = await form.validateFields()
      let promiseList = [
        uploadBlackMobileList({
          ...params,
          list_id: blackStore.activeBlack?.id,
        }),
      ]
      fileList.forEach((item) =>
        promiseList.push(
          uploadBlackMobileList({
            file: item,
            list_id: blackStore.activeBlack?.id,
            mobile: '',
          }),
        ),
      )
      await Promise.all(promiseList)
      message.destroy()
      message.success('保存成功！')
      setIsModalOpen(false)
      onSearch()
    } catch (error) {
      message.destroy()
      message.error('存在上传失败的文件')
    }
  }

  // 点击取消
  const handleCancel = () => {
    setIsModalOpen(false)
  }

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
        autoComplete='off'>
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
            <Upload {...props}>
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
