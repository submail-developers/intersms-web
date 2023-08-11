import { useState, useImperativeHandle, forwardRef, useRef } from 'react'
import { Modal, Form, Input, App, Row, Col, Radio, Select } from 'antd'
import { allUpdateChannelsNetworkWeight, getChannelList } from '@/api'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
import { API } from 'apis'
import { useAppSelector } from '@/store/hook'
import { channelsState } from '@/store/reducers/channels'
import { allChannelsNum } from '@/utils/options'

interface DataType extends API.GroupChannelItem {}

interface Props {
  onSearch: () => void
  // disableList: DataType[]
  channelId: string
}

const Dialog = (props: Props, ref: any) => {
  const channlesStore = useAppSelector(channelsState)
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const weightType = useRef(null)
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [channelList, setchannelList] = useState<API.ChannelItem[]>([])

  const open = (initFomeValue: number) => {
    form.resetFields()
    setIsModalOpen(true)
    weightType.current = initFomeValue
    // getChannels()
  }

  const handleOk = async () => {
    console.log(weightType.current)
    return
    try {
      let formValues = await form.validateFields()
      let params: API.allUpdateChannelsNetworkParams = {
        ...formValues,
        type: weightType.current,
        weight: formValues.weight,
        group_id: channlesStore.activeChannels?.id || '',
        channel_id: props.channelId,
      }
      await allUpdateChannelsNetworkWeight(params)
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
      title='批量设置权限'
      width={640}
      closable={false}
      wrapClassName='modal-reset'
      footer={<ModelFooter onOk={handleOk} onCancel={handleCancel} />}
      open={isModalOpen}>
      <Form
        name='form1'
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        layout='vertical'>
        <Form.Item label='' name='weight'>
          <Select
            showSearch
            placeholder='请选择'
            optionFilterProp='children'
            // onChange={onChange1}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={allChannelsNum}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
