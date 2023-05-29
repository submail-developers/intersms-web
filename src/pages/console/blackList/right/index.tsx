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
import type { PaginationProps } from 'antd'

interface DataType extends API.GetBlackDetailListItems {}
interface FormValues {
  list_id: string
  keyword: string
}
type Props = {
  activeBlack: API.GetBlackDetailListItems | null
}

export default function Right() {
  const addDialogRef: MutableRefObject<any> = useRef(null)
  const [selectedList, setselectedList] = useState<CheckboxValueType[]>([])

  const [tableData, settableData] = useState<DataType[]>([])
  const [indeterminate, setIndeterminate] = useState(false) //控制半选状态
  const [checkAll, setCheckAll] = useState(false) //控制全选状态
  const CheckboxGroup = Checkbox.Group

  const blackStore = useAppSelector(blackState)
  const [form] = Form.useForm()
  // 初始化form的值
  const initFormValues: FormValues = {
    list_id: '',
    keyword: '',
  }
  const search = async () => {
    const values = await form.getFieldsValue()
    formatSearchValue(values)
  }
  const formatSearchValue = (params: FormValues) => {
    const { list_id, keyword } = params
    const searchParams = {
      list_id: blackStore.activeBlack?.id || '',
      keyword,
    }
    searchEvent(searchParams)
  }
  const searchEvent = async (params: API.GetBlackDetailListParams) => {
    try {
      const res = await getBlackItemsList(params)
      settableData(res.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if (blackStore.activeBlack) {
      formatSearchValue(initFormValues)
    }
  }, [blackStore.activeBlack])

  // const search = async () => {
  //   const res = await getBlackItemsList({
  //     list_id: blackStore.activeBlack?.id || '',
  //     keyword: '',
  //   })
  //   settableData(Array.isArray(res.data) ? res.data : Object.values(res.data))
  // }

  const size = useSize()
  // 展示新增弹框
  const showDialog = () => {
    addDialogRef.current.open()
  }
  const observerBle = {
    xs: 24,
    sm: 24,
    md: 12,
    lg: 12,
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
  const showTotal: PaginationProps['showTotal'] = (total) =>
    `当前展示1-100/共${total}个`
  const { message } = App.useApp()

  let isChecked: any = []
  const onChange = (checkedValues: CheckboxValueType[]) => {
    isChecked = checkedValues
    setselectedList(checkedValues)
    if (checkedValues.length > 0) {
      if (checkedValues.length == tableData.length) {
        setIndeterminate(false)
        setCheckAll(true)
      } else {
        setIndeterminate(true)
        setCheckAll(false)
      }
    } else {
      setIndeterminate(false)
      setCheckAll(false)
    }
  }
  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckAll(e.target.checked)
    // setIndeterminate(false)

    if (e.target.checked) {
      let ids: string[] = []
      tableData.forEach((item) => ids.push(item.id))
      setselectedList(ids)
    } else {
      setselectedList([])
    }
    // console.log(e)
    // settableData(e.target.checked ? tableData : [])
    setIndeterminate(false)
  }
  // 批量删除事件
  const deleteEvent = async () => {
    console.log(selectedList)
    if (selectedList.length === 0) {
      message.warning('请勾选要删除的黑名单！')
      return
    }
    const id = selectedList.join(',')
    await deleteBlackMobileList({ id })
    await search()
    setCheckAll(false)
    setIndeterminate(false)
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
              <Form.Item label='' name='keyword' style={{ marginBottom: 10 }}>
                <Input
                  size={size}
                  placeholder='手机号'
                  maxLength={20}
                  style={{ width: 162 }}></Input>
              </Form.Item>
              <Form.Item style={{ marginBottom: 10 }}>
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
                    style={{ width: 110, marginLeft: 0 }}>
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
              size='small'
              total={1000}
              showSizeChanger
              showQuickJumper
              pageSizeOptions={[100, 200, 300]}
              showTotal={showTotal}
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
                {/* <div
                  className='delete-btn'
                  onClick={() => singleDeleteEvent(item.id)}>
                  <i className='icon iconfont icon-shanchu fn12'></i>
                </div> */}
              </div>
            </Col>
          ))}
        </Row>
      </CheckboxGroup>
      <AddDialog ref={addDialogRef} onSearch={search} />
    </section>
  )
}
