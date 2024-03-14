import React, {
  useEffect,
  useState,
  MutableRefObject,
  useRef,
  useContext,
} from 'react'
import {
  Button,
  Select,
  Form,
  Input,
  ConfigProvider,
  Table,
  Row,
  Col,
  Popconfirm,
  App,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import MenuTitle from '@/components/menuTitle/menuTitle'
import BackToTop from '@/components/returnToTop/returnToTop'
import { useSize } from '@/hooks'
import {
  getSingleCountryInfo,
  deleteSingleNetWork,
  saveChaneNetwork,
  channelGroupBindSensitiveWord,
} from '@/api'
import { API } from 'apis'
import { Link, useSearchParams } from 'react-router-dom'

import AddDialog from './addDialog/addNetwork'
import EditChanlDialog from './addDialog/editNewChanl'

import './country.scss'

interface DataType extends API.GetSingleCountryInfoItems {}
interface FormValues {
  region_code: string
}

const EditableContext = React.createContext(null)
const EditableRow = (props) => {
  //编辑表格行
  let [form] = Form.useForm() //定义表单对象
  return (
    <Form form={form} component={false} autoComplete='off'>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const { message } = App.useApp()
  //编辑表格单元格
  let inputRef = useRef(null)
  const [editing, setEditing] = useState(false) //定义编辑状态
  const [disabled, setdisabled] = useState(false)
  const form = useContext(EditableContext)

  useEffect(() => {
    //监听编辑状态值的变化
    if (editing) {
      //如果开启编辑状态
      inputRef.current.focus() //input输入框聚焦
    }
  }, [editing])

  useEffect(() => {
    if (dataIndex == 'price' && record.network_list.length > 0) {
      setdisabled(true)
    }
  }, [])

  function toggleEdit() {
    if (disabled) {
      message.error('该价格区间禁止操作')
      return
    }
    //切换编辑状态
    setEditing(!editing)
    form.setFieldsValue({
      //将表格中的值赋值到表单中
      // name:Easdf
      [dataIndex]: record[dataIndex],
    })
  }

  async function save() {
    //保存事件
    try {
      const values = await form.validateFields() //获取表单中的数据
      toggleEdit() //切换编辑状态
      handleSave({ ...record, ...values }) //调用保存方法
    } catch (errInfo) {
      console.log('保存失败:', errInfo)
    }
  }

  let childNode = children
  if (editable) {
    //如果开启了表格编辑属性
    // 是否开启了编辑状态 (开启:显示输入框 关闭:显示div)

    childNode = editing ? (
      <Form.Item
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title}是必填的.`,
          },
        ]}
        style={{ marginBottom: '0' }}>
        <Input
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
          disabled={
            dataIndex == 'price' && record.network_list.length > 0
              ? true
              : false
          }
        />
      </Form.Item>
    ) : (
      <div onClick={toggleEdit}>{children}</div>
    )
  }
  return <td {...restProps}>{childNode}</td>
}

// 国家信息配置
export default function Channel() {
  const { message } = App.useApp()
  const [tableData, settableData] = useState<API.GetSingleCountryInfoItems[]>(
    [],
  )
  // 被点击的客户(不是被checkbox选中的客户)
  const [activeIndex, setactiveIndex] = useState<number>()
  const [loading, setloading] = useState(false)
  const dialogRef: MutableRefObject<any> = useRef(null)
  const editChanleDialogRef: MutableRefObject<any> = useRef(null)
  const [params] = useSearchParams()
  const region_code = params.get('region_code')
  const country_cn = params.get('country_cn')
  const onRow = (record: DataType, index?: number) => {
    return {
      onClick: () => {
        setactiveIndex(index)
      },
    }
  }

  const { Option } = Select
  const size = useSize()
  const [form] = Form.useForm()

  const search = async () => {
    const values = await form.getFieldsValue()
    formatSearchValue(values)
  }
  const formatSearchValue = (params: FormValues) => {
    const searchParams = {
      region_code: region_code,
      ...params,
    }
    searchEvent(searchParams)
  }
  const searchEvent = async (params: API.GetSingleCountryInfoParams) => {
    try {
      setloading(true)
      const res = await getSingleCountryInfo(params)
      settableData(res.data)
      setloading(false)
    } catch (error) {
      setloading(false)
    }
  }
  // 新增/编辑网络
  const updateNetwork = (isAdd: boolean = true, record?: DataType) => {
    dialogRef.current.open({ isAdd, record })
  }
  // 编辑关联通道
  const editChannle = (isAdd: boolean = true, record?: DataType) => {
    editChanleDialogRef.current.open({ isAdd, record })
  }
  // 删除网络
  const deleteEvent = async (id: string) => {
    try {
      await deleteSingleNetWork({ id })
      message.success('删除成功')
      search()
    } catch (error) {}
  }

  const handleSave = async (row) => {
    //这个方法可以获取到行编辑之后的数据
    let findEditIndex = tableData.findIndex((item) => {
      //找到编辑行的索引
      return item.id === row.id
    })
    let findEditObj = tableData.find((item) => {
      //找到编辑行的数据对象
      return item.id === row.id
    })

    const new_row = { ...findEditObj, ...row }

    tableData.splice(findEditIndex, 1, new_row) //将最新的数据更新到表格数据中
    settableData([...tableData]) //设置表格数据
    let { id, price, comment } = new_row
    if (
      new_row.price != findEditObj.price ||
      new_row.comment != findEditObj.comment
    ) {
      try {
        const res = await saveChaneNetwork({
          id,
          type: '1',
          price:
            new_row.network_list.length > 0
              ? new_row.network_list[0].network_price
              : price,
          comment,
          network_name: '',
          network_price: '',
        })
        if (res) {
          message.success('保存成功！')
        }
        search()
      } catch (error) {}
    }
  }

  useEffect(() => {
    search()
  }, [])

  //父表格
  let tableColumns = [
    {
      title: (
        <span style={{ paddingLeft: size == 'middle' ? '30px' : '0' }}>
          通道名称
        </span>
      ),
      dataIndex: 'channel_name',
      width: size == 'middle' ? 160 : 100,
      fixed: true,
      render: (_, record) => (
        <div style={{ paddingLeft: size == 'middle' ? '30px' : '0' }}>
          <div
            className='g-ellipsis'
            title={record.channel_name}
            style={{ width: size == 'middle' ? 160 : 100 }}>
            {record.channel_name}
          </div>
        </div>
      ),
    },
    {
      title: '管理员',
      dataIndex: 'operator',
      width: 80,
    },
    {
      title: '区间成本价',
      dataIndex: 'price',
      editable: true,
      width: 140,
      render: (_, record) => <span>{record.price}</span>,
    },
    {
      title: '备注',
      dataIndex: 'comment',
      width: 190,
      editable: true,
      ellipsis: true,
    },
    {
      title: '修改时间',
      width: 200,
      className: 'paddingL20',
      render: (_, record) => <div>{record.datetime}</div>,
    },

    {
      title: '操作',
      width: 180,
      render: (_, record) => (
        <div>
          <Button
            onClick={() => editChannle(false, record)}
            type='link'
            style={{ paddingLeft: 0 }}>
            编辑
          </Button>
          <Button type='link' onClick={() => updateNetwork(true, record)}>
            新增网络
          </Button>
        </div>
      ),
    },
  ]

  tableColumns = tableColumns.map((item) => {
    //遍历表格头数组
    if (item.editable) {
      //如果表格头列开启了编辑属性
      return {
        ...item,
        onCell: (record) => {
          return {
            record: record,
            editable: item.editable,
            dataIndex: item.dataIndex,
            title: item.title,
            handleSave: handleSave,
          }
        },
      }
    } else {
      return item
    }
  })

  // 子表格
  const expandedRowRender = (record) => {
    const columnsChild: ColumnsType<DataType> = [
      {
        title: '网络名称',
        dataIndex: 'network_name',
      },
      { title: '成本价格', dataIndex: 'network_price', key: 'network_price' },
      {
        title: '操作',
        render: (_, record) => (
          <div>
            <Button
              type='link'
              style={{ paddingLeft: 0 }}
              onClick={() => updateNetwork(false, record)}>
              编辑
            </Button>
            <Popconfirm
              placement='left'
              title='警告'
              description='确定删除该通道吗？'
              onConfirm={() => deleteEvent(record.id)}
              okText='确定'
              cancelText='取消'>
              <Button type='link'>删除</Button>
            </Popconfirm>
          </div>
        ),
      },
    ]

    return (
      <Table
        className='child-table'
        columns={columnsChild}
        dataSource={record.network_list}
        pagination={false}
        scroll={{ x: 'max-content' }}
        rowKey={'id'}
      />
    )
  }

  return (
    <div data-class='country'>
      <MenuTitle title={`${country_cn}- 关联通道`}></MenuTitle>
      <Row wrap align={'bottom'}>
        <Col>
          <ConfigProvider
            theme={{
              token: {
                controlHeight: 40,
              },
            }}>
            <Form
              name='basic'
              form={form}
              initialValues={{ channels_type: 'all' }}
              layout='inline'
              wrapperCol={{ span: 24 }}
              autoComplete='off'>
              <Form.Item
                label=''
                name='channel_name'
                style={{ marginBottom: size == 'small' ? 0 : 10 }}>
                <Input
                  size={size}
                  placeholder='通道名称'
                  maxLength={20}
                  style={{ width: 162 }}></Input>
              </Form.Item>
              <Form.Item style={{ marginBottom: size == 'small' ? 0 : 10 }}>
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
          </ConfigProvider>
        </Col>
      </Row>
      <ConfigProvider
        theme={{
          token: {
            colorBgContainer: 'transparent',
          },
        }}>
        <Table
          className='theme-cell2'
          columns={tableColumns}
          dataSource={tableData}
          expandable={{
            expandedRowRender,
            rowExpandable: (record) => Boolean(record.network_list.length),
          }}
          rowKey={'id'}
          onRow={onRow}
          rowClassName={(record, index) =>
            index == activeIndex ? 'active' : ''
          }
          components={{
            body: {
              row: EditableRow,
              cell: EditableCell,
            },
          }}
          sticky
          pagination={{
            position: ['bottomRight'],
            pageSize: 100,
            pageSizeOptions: [100, 200, 300],
          }}
          scroll={{ x: 'max-content' }}
          loading={loading}
        />
      </ConfigProvider>
      <AddDialog ref={dialogRef} onSearch={search} />
      <EditChanlDialog ref={editChanleDialogRef} onSearch={search} />
      <BackToTop />
    </div>
  )
}
