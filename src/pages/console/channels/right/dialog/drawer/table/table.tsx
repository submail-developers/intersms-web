import React, {
  useEffect,
  useImperativeHandle,
  useState,
  forwardRef,
} from 'react'
import { Col, Input, Switch, Form } from 'antd'
import { groupBy } from '@/utils'
import './table.scss'
import {
  updateChannelCountryNetworkPrice,
  updateChannelCountryNetworkStatus,
} from '@/api'
import { API } from 'apis'

interface Props {
  tableData: API.ChannelCountryConfigItem[][]
  search: () => void
}

interface TdProps {
  itm: API.ChannelCountryConfigItem
  indexs: [number, number]
}

interface EnbledProps {
  enabled: '0' | '1'
  id: string
}

const Table = (props: Props, ref: any) => {
  useImperativeHandle(ref, () => {
    return {
      cancel,
    }
  })
  let len = 0 // 控制tr的背景色
  const [form] = Form.useForm()
  const [editIndex, seteditIndex] = useState<[number, number]>([-1, -1])
  // 取消
  const cancel = () => {
    seteditIndex([-1, -1])
  }

  const Enbled = (enbledProps: EnbledProps) => {
    const [loading, setLoading] = useState(false)
    const checkEnbled = async () => {
      setLoading(true)
      await updateChannelCountryNetworkStatus({
        id: enbledProps.id,
        enabled: enbledProps.enabled == '0' ? '1' : '0',
      })
      await props.search()
      setLoading(false)
    }
    return (
      <Switch
        checked={enbledProps.enabled == '1'}
        onChange={checkEnbled}
        loading={loading}
        size='small'
      />
    )
  }

  // 编辑价格组件
  const EditTd = (editProps: TdProps) => {
    // 编辑保存
    const save = async () => {
      let value = await form.validateFields()
      await updateChannelCountryNetworkPrice({ ...value, id: editProps.itm.id })
      await props.search()
      cancel()
    }
    return (
      <>
        <div className='td'>
          <Form.Item name='price_tra'>
            <Input type='number' />
          </Form.Item>
        </div>
        <div className='td'>
          <Form.Item name='price_mke'>
            <Input type='number' />
          </Form.Item>
        </div>
        <div className='td'>
          <Enbled id={editProps.itm.id} enabled={editProps.itm.enabled} />
        </div>
        <div className='td fx action-wrap'>
          <div className='btn color' onClick={save}>
            保存
          </div>

          <div className='btn color' onClick={cancel}>
            取消
          </div>
        </div>
      </>
    )
  }

  const DefaultTd = (defprops: TdProps) => {
    const edit = () => {
      seteditIndex(defprops.indexs)
      form.setFieldsValue({
        price_tra: defprops.itm.price_tra,
        price_mke: defprops.itm.price_mke,
      })
    }
    return (
      <>
        <div className='td'>{defprops.itm.price_tra}</div>
        <div className='td'>{defprops.itm.price_mke}</div>
        <div className='td'>
          <Enbled id={defprops.itm.id} enabled={defprops.itm.enabled} />
        </div>
        <div className='td fx action-wrap'>
          <div className='btn color' onClick={edit}>
            编辑
          </div>
        </div>
      </>
    )
  }

  return (
    <Form component={false} form={form}>
      <div class-data='my-table'>
        <div className='thead fn14'>
          <div className='th name'>国家名称</div>
          <div className='th'>国家代码</div>
          <div className='th net-type'>运营商网络类型</div>
          <div className='th'>行业价格</div>
          <div className='th'>营销价格</div>
          <div className='th'>状态</div>
          <div className='th'>操作</div>
        </div>
        {props.tableData.map((item, index) => {
          return (
            <div className='tbody' key={index}>
              {item.map((itm, indx) => {
                let trClassName = ''
                if (len % 2 != 0) {
                  trClassName = 'bg-gray'
                }
                len += 1
                return (
                  <div className={`tr ${trClassName}`} key={itm.id}>
                    <div className='td name g-ellipsis'>
                      {indx == 0 ? itm.country_cn : ''}
                    </div>
                    <div className='td'>{indx == 0 ? itm.region_code : ''}</div>
                    <div className='td '>{itm.network}</div>
                    {editIndex[0] == index && editIndex[1] == indx ? (
                      <EditTd itm={itm} indexs={[index, indx]} />
                    ) : (
                      <DefaultTd itm={itm} indexs={[index, indx]} />
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
        {props.tableData.length == 0 && (
          <div className='null-table'>暂无数据</div>
        )}
      </div>
    </Form>
  )
}
export default forwardRef(Table)
