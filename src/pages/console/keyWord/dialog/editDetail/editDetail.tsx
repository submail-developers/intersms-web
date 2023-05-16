import { useState, useImperativeHandle, forwardRef } from 'react'
import { Modal, Input, App, Row, Col, Checkbox, Select } from 'antd'
import { addAccount } from '@/api'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
import type { CheckboxValueType } from 'antd/es/checkbox/Group'
import type { RadioChangeEvent } from 'antd'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import CheckGroup from './checkGroup'
import './editDetail.scss'

interface Props {
  // onSearch: () => void
}

export interface Option {
  label: string
  value: string
  disabled?: boolean
}

interface CheckedObj {
  A: CheckboxValueType[]
  B: CheckboxValueType[]
  C: CheckboxValueType[]
}
interface ListItem {
  label: 'A' | 'B' | 'C'
  children: Option[]
}
const CheckboxGroup = Checkbox.Group

// 编辑详情
const Dialog = (props: Props, ref: any) => {
  const { message } = App.useApp()
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const open = () => {
    setIsModalOpen(true)
  }

  const handleOk = async () => {}

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const [checkedObj, setcheckedObj] = useState<CheckedObj>({
    A: [],
    B: [],
    C: [],
  })

  const list: ListItem[] = [
    {
      label: 'A',
      children: [
        {
          value: '中国a',
          label: '中国a',
        },
        {
          value: '中国1a',
          label: '中国1a',
        },
        {
          value: '中国2a',
          label: '中国2a',
        },
        {
          value: '中国3a',
          label: '中国3a',
        },
        {
          value: '中国4a',
          label: '中国4a',
        },
        {
          value: '中国5a',
          label: '中国5a',
        },
        {
          value: '中国6a',
          label: '中国6a',
        },
        {
          value: '中国7a',
          label: '中国7a',
        },
        {
          value: '中国8a',
          label: '中国8a',
        },
        {
          value: '中国9a',
          label: '中国9a',
        },
        {
          value: '中国12a',
          label: '中国12a',
        },
      ],
    },
    {
      label: 'B',
      children: [
        {
          value: '中国b',
          label: '中国b',
        },
        {
          value: '中国b1',
          label: '中国b1',
        },
        {
          value: '中国b2',
          label: '中国b2',
        },
        {
          value: '中国b3',
          label: '中国b3',
        },
        {
          value: '中国b4',
          label: '中国b4',
        },
        {
          value: '中国b5',
          label: '中国b5',
        },
        {
          value: '中国b6',
          label: '中国b6',
        },
        {
          value: '中国b7',
          label: '中国b7',
        },
      ],
    },
    {
      label: 'C',
      children: [
        {
          value: '中国c',
          label: '中国c',
        },
        {
          value: '中国c1',
          label: '中国c1',
        },
        {
          value: '中国c2',
          label: '中国c2',
        },
        {
          value: '中国c3',
          label: '中国c3',
        },
        {
          value: '中国c4',
          label: '中国c4',
        },
        {
          value: '中国c5',
          label: '中国c5',
        },
        {
          value: '中国c6',
          label: '中国c6',
        },
        {
          value: '中国c7',
          label: '中国c7',
        },
        {
          value: '中国c8',
          label: '中国c8',
        },
      ],
    },
  ]

  const onChange = (
    checkedValue: CheckboxValueType[],
    label: 'A' | 'B' | 'C',
  ) => {
    setcheckedObj({ ...checkedObj, [label]: checkedValue })
  }

  const checkAll = () => {}

  return (
    <Modal
      title={<div style={{ textAlign: 'center' }}>支持290个国家和地区</div>}
      width={640}
      closable={false}
      wrapClassName='editChannelDetail'
      footer={<ModelFooter onOk={handleOk} onCancel={handleCancel} />}
      open={isModalOpen}>
      <div className='input-wrap'>
        <Input
          bordered={false}
          placeholder='请输入国家名称'
          maxLength={20}
          allowClear
          suffix={
            <i
              onClick={() => {}}
              className='icon iconfont icon-sousuo fn16'
              style={{ color: '#888', cursor: 'pointer' }}></i>
          }
          onChange={() => {}}
          onPressEnter={() => {}}
          style={{
            height: '38px',
            borderBottom: '1px solid #E7E7E6',
            borderRadius: 0,
          }}
        />
      </div>
      <div className='check-all-wrap fn16 fx-between-center'>
        <div>全部国家</div>
        <div className='color checkall' onClick={checkAll}>
          全选
        </div>
      </div>
      <div className='check-group'>
        {list.map((item) => (
          <div className='dl' key={item.label}>
            <div className='dt'>{item.label}</div>
            <div className='dd'>
              <CheckGroup
                label={item.label}
                options={item.children}
                checkedList={checkedObj[item.label]}
                onChange={onChange}
              />
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )
}
export default forwardRef(Dialog)
