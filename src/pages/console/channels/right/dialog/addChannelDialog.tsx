import { useState, useImperativeHandle, forwardRef } from 'react'
import { Modal, Form, Input, App, Row, Col, Radio, Select } from 'antd'
import { channelGroupAddChannel, getChannelList } from '@/api'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
import { API } from 'apis'
import { useAppSelector } from '@/store/hook'
import { channelsState } from '@/store/reducers/channels'
import { isOpenTypeOptions } from '@/utils/options'

interface DataType extends API.GroupChannelItem {}

interface Props {
  onSearch: () => void
  disableList: DataType[]
}

const Dialog = (props: Props, ref: any) => {
  const channlesStore = useAppSelector(channelsState)
  const [form] = Form.useForm()
  const { message } = App.useApp()
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [channelList, setchannelList] = useState<API.ChannelItem[]>([])

  const open = () => {
    form.resetFields()
    setIsModalOpen(true)
    getChannels()
  }

  // 获取通道列表
  const getChannels = async () => {
    const res = await getChannelList()
    let filterList = res.data.filter((item) => {
      return !props.disableList.some((itm) => itm.channel_id == item.id)
    })
    setchannelList(filterList)
  }

  const handleOk = async () => {
    try {
      let formValues = await form.validateFields()
      let params: API.ChannelGroupAddChannelParams = {
        ...formValues,
        group_id: channlesStore.activeChannels?.id || '',
      }
      await channelGroupAddChannel(params)
      setIsModalOpen(false)
      props.onSearch()
      message.success('保存成功！')
    } catch (error) {}
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <Modal
      data-class='dialog'
      title='新增通道'
      width={640}
      closable={false}
      onCancel={handleCancel}
      wrapClassName='modal-reset'
      footer={<ModelFooter onOk={handleOk} onCancel={handleCancel} />}
      open={isModalOpen}>
      <Form
        name='form1'
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        initialValues={{ resend: '0' }}
        layout='vertical'>
        <Form.Item label='通道名称' name='channel_id'>
          <Select
            showSearch
            placeholder='请选择'
            fieldNames={{ label: 'name', value: 'id' }}
            optionFilterProp='children'
            filterOption={(input, option) =>
              (option?.name ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={channelList}
          />
        </Form.Item>

        {/* <Form.Item label='配置补发' name='resend' validateTrigger='onSubmit'>
          <Radio.Group options={isOpenTypeOptions} />
        </Form.Item> */}
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
