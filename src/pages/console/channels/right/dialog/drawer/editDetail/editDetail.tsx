import { useState, useImperativeHandle, forwardRef, useEffect } from 'react'
import { Modal, Input, App, Row, Col, Checkbox, Select } from 'antd'
import { getAllNetCountry, updateChannelCountryNetwork } from '@/api'
import ModelFooter from '@/components/antd/modelFooter/modelFooter'
import type { CheckboxValueType } from 'antd/es/checkbox/Group'
import CheckGroup from './checkGroup'

import './editDetail.scss'

interface Props {
  channelId: string
  search: () => void
}

export interface Option {
  label: string
  value: string
  disabled?: boolean
}

interface CheckedObj {
  [propName: string]: CheckboxValueType[]
  // [Prop in keyof Letter] : CheckboxValueType[]
}
interface ListItem {
  letter: string
  children: Option[]
}
const CheckboxGroup = Checkbox.Group

// 编辑详情
const Dialog = (props: Props, ref: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCheckedAll, setisCheckedAll] = useState(false)
  const [checkedCountry, setcheckedCountry] = useState<string[]>([])
  const [checkedObj, setcheckedObj] = useState<CheckedObj>({})
  const [searchKey, setSearchKey] = useState<string>('')

  const { message } = App.useApp()
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const [list, setlist] = useState<ListItem[]>([])

  const open = async (_checkedCountry: string[] = []) => {
    setIsModalOpen(true)
    setcheckedCountry(_checkedCountry)
    initData(_checkedCountry)
  }

  // 初始化内容
  const initData = async (_checkedCountry: string[]) => {
    const res = await getAllNetCountry()
    setlist(res.data)
    // 重新初始化checkedObj
    let _checkedObj: CheckedObj = {}
    res.data.forEach((item) => {
      _checkedObj[item.letter] = []
      item.children.forEach((itm) => {
        if (_checkedCountry.includes(itm.value)) {
          _checkedObj[item.letter].push(itm.value)
        }
      })
    })
    setcheckedObj(_checkedObj)
  }

  // 搜索国家
  const searchCountry = () => {}

  const handleOk = async () => {
    let _checked = Object.values(checkedObj).flat()
    const res = await updateChannelCountryNetwork({
      channel: props.channelId,
      region_code_list: _checked.join(','),
    })
    props.search()
    message.success('保存成功')
    setIsModalOpen(false)
    // console.log(res)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const onChange = (checkedValue: CheckboxValueType[], label: string) => {
    setcheckedObj({ ...checkedObj, [label]: checkedValue })
  }

  const checkAll = () => {
    let checkAllobj: CheckedObj = {}
    if (isCheckedAll) {
      list.forEach((item) => {
        checkAllobj[item.letter] = []
      })
      setcheckedObj(checkAllobj)
    } else {
      list.forEach((item) => {
        checkAllobj[item.letter] = []
        item.children.forEach((itm) => {
          checkAllobj[item.letter]?.push(itm.value)
        })
      })
      setcheckedObj(checkAllobj)
    }
  }

  useEffect(() => {
    let allLength = 0,
      checkedLength = 0
    list.forEach((item) => {
      allLength += item.children.length
      checkedLength += checkedObj[item.letter]!.length
    })

    setisCheckedAll(allLength === checkedLength)
  }, [checkedObj, list])

  return (
    <Modal
      title={<div style={{ textAlign: 'center' }}>支持290个国家和地区</div>}
      width={640}
      closable={false}
      onCancel={() => setIsModalOpen(false)}
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
              onClick={searchCountry}
              className='icon iconfont icon-sousuo fn16'
              style={{ color: '#888', cursor: 'pointer' }}></i>
          }
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          onPressEnter={searchCountry}
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
          {isCheckedAll ? '取消全选' : '全选'}
        </div>
      </div>
      <div className='check-group'>
        {list.map((item) => (
          <div className='dl' key={item.letter}>
            <div className='dt'>{item.letter}</div>
            <div className='dd'>
              <CheckGroup
                label={item.letter}
                options={item.children}
                checkedList={checkedObj[item.letter] || []}
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
