import { useState, useImperativeHandle, forwardRef, useRef } from 'react'
import { Modal, Form, Input, App, Upload, Button } from 'antd'

import { useAppSelector } from '@/store/hook'
import { blackState } from '@/store/reducers/black'
import { uploadBlackMobileList } from '@/api'
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
  const copyFileList = useRef(null)
  const props: UploadProps = {
    accept: '.txt, .xlsx, .xls, .csv, .vcf',
    onRemove: (file) => {
      const arr = fileList.filter((item) => item != file)
      setFileList(arr)
      copyFileList.current = arr
    },
    beforeUpload: (file) => {
      // const isConform =
      //   file.type === 'text/plain' ||
      //   file.type === 'text/csv' ||
      //   file.type === 'text/vcard' ||
      //   file.type === 'text/directory' ||
      //   file.type ===
      //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      //   file.type === 'application/vnd.ms-excel'
      // if (!isConform) {
      //   message.error(`${file.name} 不符合上传文件的格式`)
      //   return isConform || Upload.LIST_IGNORE
      // }
      let list = [...fileList, file]
      setFileList(list)
      copyFileList.current = list
      return false // 返回false-手动上传文件
    },

    fileList,
  }

  // 上传
  const handleOk = async () => {
    const params = await form.validateFields()
    if (fileList.length == 0 && !Boolean(params.mobile)) {
      message.warning('请输入手机号码或上传文件')
      return
    }
    // 上传输入的手机号
    message.loading({
      content: '',
      duration: 0,
    })
    if (Boolean(params.mobile)) {
      uploadBlackMobileList({
        ...params,
        list_id: blackStore.activeBlack?.id,
      })
    }
    if (fileList.length > 0) {
      await uploadFileEvent(0)
    }
  }

  // 上传文件
  const uploadFileEvent = async (index: number) => {
    const uid = fileList[index].uid
    try {
      await uploadBlackMobileList({
        file: fileList[index],
        list_id: blackStore.activeBlack?.id,
        mobile: '',
      })
      copyFileList.current = copyFileList.current.filter(
        (item) => item.uid != uid,
      )
    } catch (error) {
      // message.error('存在上传失败的文件')
    }

    if (index == fileList.length - 1) {
      // 全部上传成功
      if (copyFileList.current.length == 0) {
        message.destroy()
        message.success('保存成功！')
        setIsModalOpen(false)
      } else {
        // 存在上传失败的文件
        message.error('存在上传失败的文件，请检查文件')
      }
      setFileList(copyFileList.current)
      onSearch()
    } else {
      await uploadFileEvent(index + 1) // 递归上传
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
                <br />
                超过十万条手机号建议使用CSV或TXT格式
              </p>
            </Upload>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
