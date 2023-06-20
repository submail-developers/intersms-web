import { useState, useRef, MutableRefObject, useEffect } from 'react'
import { useAppSelector } from '@/store/hook'
import { blackState } from '@/store/reducers/black'

import {
  ConfigProvider,
  Button,
  Input,
  Checkbox,
  Popconfirm,
  Row,
  Col,
  Form,
  App,
  Pagination,
} from 'antd'
import { useSize } from '@/hooks'
import { getBlackItemsList, deleteBlackMobileList } from '@/api'
import AddDialog from './dialog/addDialog'
import { API } from 'apis'
import './index.scss'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import type { CheckboxValueType } from 'antd/es/checkbox/Group'

interface DataType extends API.GetBlackDetailListItems {}

const observerBle = {
  xs: 24,
  sm: 12,
  md: 8,
  lg: 6,
  xl: 8,
  xxl: 4,
}
const observerGutter = {
  xs: 6,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  xxl: 14,
}

export default function Right() {
  const size = useSize()
  const { message } = App.useApp()

  const addDialogRef: MutableRefObject<any> = useRef(null)
  const [selectedList, setselectedList] = useState<CheckboxValueType[]>([])
  const [total, setTotal] = useState(0)
  const [current, setCurrent] = useState(1)
  const [pageSize, setpageSize] = useState(100)
  const [tableData, settableData] = useState<DataType[]>([])
  const [indeterminate, setIndeterminate] = useState(false) //控制半选状态
  const [checkAll, setCheckAll] = useState(false) //控制全选状态
  const CheckboxGroup = Checkbox.Group
  const blackStore = useAppSelector(blackState)
  const [form] = Form.useForm()

  useEffect(() => {
    if (blackStore.activeBlack) {
      search()
    }
  }, [current, pageSize, blackStore.activeBlack])

  useEffect(() => {
    let hasChecked = false
    let checkedAll = true
    if (tableData.length === 0 || selectedList.length == 0) {
      setIndeterminate(false)
      setCheckAll(false)
      return
    }
    tableData.forEach((item) => {
      if (selectedList.includes(item.id)) {
        hasChecked = true
      } else {
        checkedAll = false
      }
    })
    setIndeterminate(!checkedAll && hasChecked)
    setCheckAll(checkedAll)
  }, [tableData, selectedList])

  const search = async () => {
    setselectedList([])
    const values = await form.getFieldsValue()
    const { keyword } = values
    searchEvent({
      list_id: blackStore.activeBlack?.id || '',
      keyword,
      limit: pageSize,
      page: current,
    })
  }
  const searchEvent = async (params: API.GetBlackDetailListParams) => {
    try {
      const res = await getBlackItemsList(params)
      settableData(res.data)
      setTotal(res.total)
      // 处理数量边界问题
      let _lastCurrent = Math.ceil(res.total / pageSize)
      if (_lastCurrent != 0 && _lastCurrent < current) {
        setCurrent(_lastCurrent)
      }
    } catch (error) {
      console.log(error)
    }
  }
  // 点击分页
  const changePage = async (page: number, pageSize: number) => {
    setCurrent(page)
    setpageSize(pageSize)
  }

  // 展示新增弹框
  const showDialog = () => {
    addDialogRef.current.open()
  }

  const onChange = (checkedValues: CheckboxValueType[]) => {
    setselectedList(checkedValues)
  }
  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckAll(e.target.checked)
    if (e.target.checked) {
      let _select = []
      tableData.forEach((item) => {
        _select.push(item.id)
      })
      setselectedList(_select)
    } else {
      setselectedList([])
    }
  }
  // 批量删除事件
  const deleteEvent = async () => {
    if (selectedList.length === 0) {
      message.warning('请勾选要删除的黑名单！')
      return
    }
    const id = [...new Set(selectedList)].join(',')
    await deleteBlackMobileList({ id })
    await search()
  }
  // 单独删除
  const singleDeleteEvent = async (id: any) => {
    await deleteBlackMobileList({ id })
    await search()
  }

  return (
    <section
      data-class='account-right'
      className='right-wrap fx-auto fx-shrink'
      style={{ minWidth: `${size === 'small' ? '100%' : ''}` }}>
      <div className='fx-col'>
        <Row justify={'space-between'}>
          <Col>
            <div className='btn-group'>
              <div className='btn' onClick={showDialog}>
                <i className='icon iconfont icon-xinzeng'></i>
                <span>新增</span>
              </div>
              <Popconfirm
                placement='bottom'
                title='警告'
                description='确定删除选中的黑名单吗？'
                onConfirm={deleteEvent}
                okText='确定'
                cancelText='取消'>
                <div className='btn delete'>
                  <i className='icon iconfont icon-shanchu'></i>
                  <span>删除</span>
                </div>
              </Popconfirm>
            </div>
          </Col>
          <Col>
            <Form
              name='basic'
              form={form}
              initialValues={{}}
              layout='inline'
              wrapperCol={{ span: 24 }}
              autoComplete='off'>
              <Form.Item
                label=''
                name='keyword'
                style={{
                  marginBottom: size == 'small' ? 0 : 10,
                }}>
                <Input
                  size={size}
                  placeholder='手机号'
                  maxLength={20}
                  style={{ width: 162 }}></Input>
              </Form.Item>
              <Form.Item
                style={{
                  marginBottom: size == 'small' ? 0 : 10,
                }}>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: '#ff4d4f',
                      colorPrimaryHover: '#ff4d4f',
                    },
                  }}>
                  <Button
                    type='primary'
                    size={size}
                    htmlType='submit'
                    onClick={search}
                    style={{ width: 90, marginLeft: 0 }}>
                    搜索
                  </Button>
                </ConfigProvider>
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <Row justify={'space-between'} align={'bottom'} wrap gutter={[10, 10]}>
          <Col>
            <div className='list-title'>
              {' '}
              <Checkbox
                indeterminate={indeterminate}
                onChange={onCheckAllChange}
                checked={checkAll}>
                黑名单
              </Checkbox>
            </div>
          </Col>
          <Col>
            <Pagination
              style={{ paddingRight: '16px' }}
              size='small'
              total={total}
              current={current}
              defaultPageSize={pageSize}
              showSizeChanger
              showQuickJumper
              pageSizeOptions={[100, 200, 300]}
              onChange={changePage}
              showTotal={(total, range) =>
                total > 1
                  ? `当前展示${range[0]}-${range[1]}条 / 共 ${total} 条`
                  : `共${total}条`
              }
            />
          </Col>
        </Row>
      </div>

      <CheckboxGroup
        style={{ width: '100%', marginTop: '10px' }}
        value={selectedList}
        onChange={onChange}>
        <Row wrap gutter={observerGutter} style={{ width: '100%' }}>
          {tableData.map((item) => (
            <Col key={item.id} {...observerBle}>
              <div className='checkbox-item fx-between-center'>
                <Checkbox value={item.id}>{item.mobile}</Checkbox>
                <Popconfirm
                  placement='left'
                  title='警告'
                  description='确定删除该条黑名单吗？'
                  onConfirm={() => singleDeleteEvent(item.id)}
                  okText='确定'
                  cancelText='取消'>
                  <i className='icon iconfont icon-shanchu fn12'></i>
                </Popconfirm>
              </div>
            </Col>
          ))}
        </Row>
      </CheckboxGroup>
      <AddDialog ref={addDialogRef} onSearch={search} />
    </section>
  )
}
