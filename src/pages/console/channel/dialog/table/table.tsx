import { useState } from 'react'
import { Col, Button, Popconfirm, Form } from 'antd'
import './table.scss'
export default () => {
  const [form] = Form.useForm()
  form.setFieldsValue({ price1: '0.05000', price2: '0.05000' })
  const [editId, setEditId] = useState('1')
  const save = async () => {
    let value = await form.validateFields()
    console.log(value)
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
          <div className='th'>操作</div>
        </div>
        <div className='tbody active'>
          <div className='tr'>
            <div className='td name'>中国</div>
            <div className='td'>CN</div>
            <div className='td '>中国移动</div>
            <div className='td'>
              <Form.Item name='price1'>
                <input type='text' />
              </Form.Item>
            </div>
            <div className='td'>
              <Form.Item name='price2'>
                <input type='text' />
              </Form.Item>
            </div>
            <div className='td'>
              {editId == '1' ? (
                <>
                  <Button type='link' style={{ paddingLeft: 0 }} onClick={save}>
                    保存
                  </Button>

                  <Button type='link'>取消</Button>
                </>
              ) : (
                <>
                  <Button type='link' style={{ paddingLeft: 0 }}>
                    编辑
                  </Button>

                  <Popconfirm
                    placement='bottom'
                    title='警告'
                    description='确定删除该通道吗？'
                    // onConfirm={deleteEvent}
                    okText='确定'
                    cancelText='取消'>
                    <Button type='link'>删除</Button>
                  </Popconfirm>
                </>
              )}
            </div>
          </div>
          <div className='tr'>
            <div className='td name'></div>
            <div className='td'></div>
            <div className='td'>中国移动</div>
            <div className='td'>0.05000</div>
            <div className='td'>0.05000</div>
            <div className='td'>
              {editId == '2' ? (
                <>
                  <Button type='link' style={{ paddingLeft: 0 }} onClick={save}>
                    保存
                  </Button>

                  <Button type='link'>取消</Button>
                </>
              ) : (
                <>
                  <Button type='link' style={{ paddingLeft: 0 }}>
                    编辑
                  </Button>

                  <Popconfirm
                    placement='bottom'
                    title='警告'
                    description='确定删除该通道吗？'
                    // onConfirm={deleteEvent}
                    okText='确定'
                    cancelText='取消'>
                    <Button type='link'>删除</Button>
                  </Popconfirm>
                </>
              )}
            </div>
          </div>
          <div className='tr'>
            <div className='td name'></div>
            <div className='td'></div>
            <div className='td'>中国移动</div>
            <div className='td'>0.05000</div>
            <div className='td'>0.05000</div>
            <div className='td'>
              <div className='action-btn'>编辑</div>
              <Popconfirm
                placement='bottom'
                title='警告'
                description='确定删除选中的客户吗？'
                // onConfirm={deleteEvent}
                okText='确定'
                cancelText='取消'>
                <div className='action-btn'>删除</div>
              </Popconfirm>
            </div>
          </div>
          <div className='tr'>
            <div className='td name'></div>
            <div className='td'></div>
            <div className='td'>中国移动</div>
            <div className='td'>0.05000</div>
            <div className='td'>0.05000</div>
            <div className='td'>
              <div className='action-btn'>编辑</div>
              <Popconfirm
                placement='bottom'
                title='警告'
                description='确定删除选中的客户吗？'
                // onConfirm={deleteEvent}
                okText='确定'
                cancelText='取消'>
                <div className='action-btn'>删除</div>
              </Popconfirm>
            </div>
          </div>
        </div>
        <div className='tbody'>
          <div className='tr'>
            <div className='td name'>中国</div>
            <div className='td'>CN</div>
            <div className='td'>中国移动</div>
            <div className='td'>0.05000</div>
            <div className='td'>0.05000</div>
            <div className='td'>
              <div className='action-btn'>编辑</div>
              <Popconfirm
                placement='bottom'
                title='警告'
                description='确定删除选中的客户吗？'
                // onConfirm={deleteEvent}
                okText='确定'
                cancelText='取消'>
                <div className='action-btn'>删除</div>
              </Popconfirm>
            </div>
          </div>
          <div className='tr'>
            <div className='td name'></div>
            <div className='td'></div>
            <div className='td'>中国移动</div>
            <div className='td'>0.05000</div>
            <div className='td'>0.05000</div>
            <div className='td'>
              <div className='action-btn'>编辑</div>
              <Popconfirm
                placement='bottom'
                title='警告'
                description='确定删除选中的客户吗？'
                // onConfirm={deleteEvent}
                okText='确定'
                cancelText='取消'>
                <div className='action-btn'>删除</div>
              </Popconfirm>
            </div>
          </div>
          <div className='tr'>
            <div className='td name'></div>
            <div className='td'></div>
            <div className='td'>中国移动</div>
            <div className='td'>0.05000</div>
            <div className='td'>0.05000</div>
            <div className='td'>
              <div className='action-btn'>编辑</div>
              <Popconfirm
                placement='bottom'
                title='警告'
                description='确定删除选中的客户吗？'
                // onConfirm={deleteEvent}
                okText='确定'
                cancelText='取消'>
                <div className='action-btn'>删除</div>
              </Popconfirm>
            </div>
          </div>
          <div className='tr'>
            <div className='td name'></div>
            <div className='td'></div>
            <div className='td'>中国移动</div>
            <div className='td'>0.05000</div>
            <div className='td'>0.05000</div>
            <div className='td'>
              <div className='action-btn'>编辑</div>
              <Popconfirm
                placement='bottom'
                title='警告'
                description='确定删除选中的客户吗？'
                // onConfirm={deleteEvent}
                okText='确定'
                cancelText='取消'>
                <div className='action-btn'>删除</div>
              </Popconfirm>
            </div>
          </div>
        </div>
      </div>
    </Form>
  )
}
