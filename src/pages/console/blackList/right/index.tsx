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
type Props = {
  activeBlack: API.GetBlackDetailListItems | null
}

export default function Right() {
  const addDialogRef: MutableRefObject<any> = useRef(null)
  const [tableData, settableData] = useState<DataType[]>([])
  const blackStore = useAppSelector(blackState)
  const [form] = Form.useForm()

  useEffect(() => {
    if (blackStore.activeBlack) {
      search()
    }
  }, [blackStore.activeBlack])

  const search = async () => {
    const res = await getBlackItemsList({
      list_id: blackStore.activeBlack?.id || '',
    })
    settableData(Array.isArray(res.data) ? res.data : Object.values(res.data))
  }

  const onChange = (checkedValues: CheckboxValueType[]) => {
    console.log('checked = ', checkedValues)
  }
  const onFinish = (values: any) => {}

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

  const CheckboxGroup = Checkbox.Group
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
                description='确定删除选中的客户吗？'
                // onConfirm={deleteEvent}
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
              onFinish={onFinish}
              autoComplete='off'>
              <Form.Item label='' name='name' style={{ marginBottom: 10 }}>
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
            <div className='list-title'>黑名单表-钓鱼</div>
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
      <Checkbox.Group
        style={{ width: '100%', marginTop: '10px' }}
        onChange={onChange}>
        <Row wrap gutter={observerGutter} style={{ width: '100%' }}>
          {tableData.map((item) => (
            <Col key={item.id} {...observerBle}>
              <div className='checkbox-item fx-between-center'>
                <Checkbox value={item.id}>{item.mobile}</Checkbox>
                <div className='delete-btn'>
                  <i className='icon iconfont icon-shanchu fn12'></i>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Checkbox.Group>
      <AddDialog ref={addDialogRef} onSearch={search} />
    </section>
  )
}
