import {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
  useEffect,
} from 'react'
import {
  Modal,
  Input,
  App,
  Upload,
  Button,
  Form,
  Row,
  Col,
  Select,
  Radio,
} from 'antd'
import {
  GetRegioncodeByCountry,
  addSenderEvidence,
  getAccountList,
  updateSenderEvidence,
} from '@/api'
import type { RcFile } from 'antd/es/upload'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'
import type { RadioChangeEvent } from 'antd'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { senderManageOptions, yesOrNoOptions } from '@/utils/options'
import { useSize } from '@/hooks'
import { API } from 'apis'
import './addDialog.scss'
interface PropsList {
  allChannelData: API.GetAllChannelIdParamsItems[]
  messageList: any
  onSearch: () => void
}
interface InitOpen {
  isAdd: boolean
  record?: API.GetSenderEvidenceItems
}

// 新增时初始化的值
const initialValues = {
  sender_type: '1',
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

const Dialog = (props: PropsList, ref: any) => {
  const size = useSize()
  const [CountryNameData, setCountryNameData] = useState<
    API.GetRegioncodeByCountryItems[]
  >([])
  const countryInfo = useRef(null) // 切换地区的信息
  const [record, setrecord] = useState<API.GetSenderEvidenceItems | null>(null)
  const [isAdd, setisAdd] = useState<boolean>(true)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')

  const [form] = Form.useForm()
  const { message } = App.useApp()
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const open = (initValues: InitOpen) => {
    setFileList([])
    setbBusList([])
    setRegisterList([])
    const { isAdd, record } = initValues
    setisAdd(isAdd)
    form.resetFields()
    form.setFieldsValue(!!isAdd ? initialValues : initValues.record)
    setIsModalOpen(true)
    if (isAdd) {
      countryName()
      associatedAccount()
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
  const messageList = [
    { label: '申请中', value: '1' },
    { label: '申请失败', value: '0' },
    { label: '申请成功', value: '2' },
  ]

  // 国家名称
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
  // 关联账号列表
  const associatedAccount = async () => {
    const res = await getAccountList({
      keyword: '',
    })
  }
  const seleCountry = (value: string, option: any) => {
    countryInfo.current = {
      country_cn: option.label,
      region_code: option.value,
    }
  }
  const [fileList, setFileList] = useState<UploadFile[]>([]) // 营业执照
  const [busList, setbBusList] = useState<UploadFile[]>([]) // 营业执照复制
  const [registerList, setRegisterList] = useState<UploadFile[]>([]) // 注册资料

  // 上传营业执照一
  const fileListProps: UploadProps = {
    accept: '.jpg,jpeg,png',
    onRemove: (file) => {
      const arr = fileList.filter((item) => item != file)
      setFileList(arr)
    },
    beforeUpload: (file) => {
      let list = [...fileList, file]
      setbBusList(list)
      setFileList(list)
      return false // 返回false-手动上传文件
    },
    fileList,
  }

  // 上传注册资料
  const regprops: UploadProps = {
    accept: '.rar, .7z, .zip',
    onRemove: (file) => {
      const arr = registerList.filter((item) => item != file)
      setRegisterList(arr)
    },
    beforeUpload: (file) => {
      let list = [...registerList, file]
      setRegisterList(list)
      return false // 返回false-手动上传文件
    },

    fileList: registerList,
  }

  // 保存
  const handleOk = async () => {
    const params = await form.validateFields()
    let newParams = isAdd
      ? { ...params, ...countryInfo.current }
      : { ...record, ...params }

    try {
      if (isAdd) {
        await addSenderEvidence({
          ...newParams,
          business_license: busList[0],
          registration: registerList[0],
        })
        message.destroy()
        message.success('上传成功！')
        setIsModalOpen(false)
        props.onSearch()
      } else {
        await updateSenderEvidence({
          id: record.id,
          user_id: record.account,
          sender: params.sender,
          sender_type: params.sender_type,
          sender_status: params.sender_status,
          business_license: busList[0],
          registration: registerList[0],
        })
        message.destroy()
        message.success('更新成功！')
        setIsModalOpen(false)
        props.onSearch()
      }
    } catch (error) {}
  }

  const closePrew = () => setPreviewOpen(false)
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1),
    )
  }

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }

  const uploadButton = (
    <div>
      <PlusOutlined rev={undefined} />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  // 点击取消
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const onFinish = () => {}
  const onFinishFailed = () => {}

  const onChange = (e: RadioChangeEvent) => {
    // console.log('checked = ', e)
  }

  const onChange1 = (value: string) => {
    // console.log(`selected ${value}`)
  }
  const onSearch = () => {
    // console.log('search:', value)
  }

  const { TextArea } = Input
  return (
    <Modal
      data-class='dialog'
      title={isAdd ? '新增Sender信息' : '编辑Sender信息'}
      width={640}
      closable={false}
      onCancel={handleCancel}
      wrapClassName='modal-reset'
      footer={<ModelFooter onOk={handleOk} onCancel={handleCancel} />}
      open={isModalOpen}>
      <Form
        name='form'
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        layout='vertical'
        autoComplete='off'
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}>
        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item label='user_id' name='user_id' hidden>
              <Input />
            </Form.Item>
            <Form.Item label='账号' name='mail'>
              <Input disabled={!isAdd} placeholder='请输入账号' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='国家/地区名称'
              name={isAdd ? 'region_code' : 'country_cn'}
              validateTrigger='onSubmit'>
              <Select
                showSearch
                disabled={!isAdd}
                placeholder='请选择'
                optionFilterProp='children'
                onChange={seleCountry}
                onSearch={onSearch}
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
        <Row justify='space-between' gutter={30}>
          <Col span={size == 'small' ? 24 : 12}>
            <Form.Item
              label='通道'
              name='channel_id'
              validateTrigger='onSubmit'>
              <Select
                showSearch
                disabled={!isAdd}
                placeholder='请选择通道'
                optionFilterProp='children'
                options={props.allChannelData.slice(1)}
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
          </Col>
          <Col span={12}>
            <Form.Item label='Sender名' name='sender'>
              <Input placeholder='请输入Sender名' />
            </Form.Item>
          </Col>
        </Row>

        <Row justify='space-between' gutter={30}>
          <Col span={12}>
            <Form.Item label='Sender属性' name='sender_type'>
              <Radio.Group options={senderManageOptions} onChange={onChange} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='Sender状态' name='sender_status'>
              <Select
                showSearch
                placeholder='请选择Sender状态'
                optionFilterProp='children'
                options={messageList}
                onChange={onChange1}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row justify='space-between' gutter={30}>
          <Col span={24}>
            <Form.Item label='营业执照'>
              <Upload
                {...fileListProps}
                listType='picture-card'
                onPreview={handlePreview}
                onChange={handleChange}>
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
              <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={closePrew}>
                <img
                  alt='example'
                  style={{ width: '100%' }}
                  src={previewImage}
                />
              </Modal>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label='注册资料'>
          <Upload {...regprops}>
            <Button icon={<UploadOutlined rev={undefined} />}>选择文件</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
