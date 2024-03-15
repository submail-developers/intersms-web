import React, {
  useState,
  useImperativeHandle,
  MutableRefObject,
  forwardRef,
  useRef,
  useEffect,
  useContext,
} from 'react'
import { TableColumnsType, Popconfirm } from 'antd'
import { Form, Input, ConfigProvider, Button, Drawer, App, Table } from 'antd'
import { useSize, usePoint } from '@/hooks'

import { getAlarmNotifier } from '@/api'
import { API } from 'apis'
import './drawer.scss'

interface Props {
  // onSearch: () => void
}
interface DataType extends API.GetAlarmNotifierItems {}
export type DrawerContentRectType = {
  x: number
  y: number
}
const EditableContext = React.createContext(null)
const EditableRow = (props) => {
  //编辑表格行
  let [form] = Form.useForm() //定义表单对象
  return (
    <Form form={form} component={false}>
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
  //编辑表格单元格
  let inputRef = useRef(null)
  const [editing, setEditing] = useState(false) //定义编辑状态
  const form = useContext(EditableContext)

  useEffect(() => {
    //监听编辑状态值的变化
    if (editing) {
      //如果开启编辑状态
      inputRef.current.focus() //input输入框聚焦
    }
  }, [editing])

  function toggleEdit() {
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
        ]}>
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div onClick={toggleEdit}>{children}</div>
    )
  }
  return <td {...restProps}>{childNode}</td>
}
const Dialog = (props: Props, ref: any) => {
  const size = useSize()
  const point = usePoint('xl')
  const [form] = Form.useForm()
  const [tableData, setTableData] = useState<API.GetAlarmNotifierItems[]>([])
  const [loading, setloading] = useState(false)

  const tableref: MutableRefObject<any> = useRef(null)
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const [show, setShow] = useState(false)

  const drawerref: MutableRefObject<HTMLDivElement> = useRef(null)

  // 因为内部table组件使用了虚拟表格，必须要配置scroll={{x: number, y: number}}，drawer的宽和高用的vh vw，所以需要获取drawer组件的内容区宽高
  const [drawerContentRect, setdrawerContentRect] =
    useState<DrawerContentRectType>({
      x: 2000,
      y: 400,
    })
  useEffect(() => {
    // 获取drawer组件的内容区宽高
    const observer = new ResizeObserver(([entry]) => {
      setdrawerContentRect({
        x: Math.floor(entry.contentRect.width),
        y: Math.floor(entry.contentRect.height) - 50, // 去掉表头高度 50
      })
    })
    if (show) {
      observer.observe(drawerref?.current)
    } else {
      if (drawerref?.current) observer.unobserve(drawerref?.current)
    }
    return () => {
      if (drawerref?.current) observer.unobserve(drawerref?.current)
    }
  }, [show])

  const open = async (id: string, name: string) => {
    setShow(true)
    search()
  }
  const showTableLoading = () => {
    setloading(true)
  }

  useEffect(() => {}, [])

  const search = async (ifsetloading = false) => {
    try {
      ifsetloading && setloading(true)
      const res = await getAlarmNotifier('')
      setTableData(res.data)
    } catch (error) {
      setloading(false)
    }
  }

  const close = () => {
    setShow(false)
  }

  useEffect(() => {}, [])

  const handleSave = async (row) => {
    //这个方法可以获取到行编辑之后的数据
    let findEditIndex = tableData.findIndex((item) => {
      console.log(item, '?????????')
      //找到编辑行的索引
      return item.id === row.id
    })
    let findEditObj = tableData.find((item) => {
      //找到编辑行的数据对象
      return item.id === row.id
    })

    const new_row = { ...findEditObj, ...row }

    tableData.splice(findEditIndex, 1, new_row) //将最新的数据更新到表格数据中
    setTableData([...tableData]) //设置表格数据
    let { id, price, comment } = new_row
    // if (
    // new_row.price != findEditObj.price ||
    // new_row.comment != findEditObj.comment
    // ) {
    // try {
    // const res = await saveChaneNetwork({
    //   id,
    //   type: '1',
    //   price:
    //     new_row.network_list.length > 0
    //       ? new_row.network_list[0].network_price
    //       : price,
    //   comment,
    //   network_name: '',
    //   network_price: '',
    // })
    // if (res) {
    //   // message.success('保存成功！')
    // }
    // search()
    // } catch (error) {}
    // }
  }

  let tableColumns = [
    {
      title: '手机号码',
      className: 'paddingL10',
      fixed: true,
      editable: true,
      width: point ? 130 : 110,
      render(_, record) {
        return <div className={`td-content fw500`}>{record.mob}</div>
      },
    },
    {
      title: '姓名',
      width: 80,
      editable: true,
      className: 'paddingL30',
      render(_, record) {
        return <div className={`td-content`}>{record.name}</div>
      },
    },

    {
      title: '操作',
      width: 120,

      render(_, record) {
        return (
          <Button type='link' style={{ padding: '0' }}>
            <Popconfirm
              placement='left'
              title='警告'
              description='确定删除该条报警人员吗？'
              // onConfirm={() => singleDeleteEvent(record.mob)}
              okText='确定'
              cancelText='取消'>
              删除
            </Popconfirm>
          </Button>
        )
      },
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
            dataIndex: item.title,
            title: item.title,
            handleSave: handleSave,
          }
        },
      }
    } else {
      return item
    }
  })

  // 新增报警人员
  const handleAdd = () => {
    const newData: DataType = {
      mob: '请输入手机号',
      name: '请输入姓名',
    }
    setTableData([...tableData, newData])
  }

  return (
    <Drawer
      title=''
      placement='right'
      onClose={close}
      closable={false}
      open={show}
      rootClassName='drawer channel-drawer'
      width={point ? '70vw' : '90vw'}>
      <div className='drawer-container' onClick={close}>
        <div
          className='drawer-content'
          onClick={(e) => e.stopPropagation()}
          ref={drawerref}
          style={{ height: size == 'middle' ? '70vh' : '90vh' }}>
          <header
            className={`drawer-header ${
              size == 'middle' ? 'fx-between-center' : 'xl'
            }`}>
            <div className={`${size == 'middle' ? 'fx-y-center' : 'xl'}`}>
              <div
                className='switch-all'
                style={{ marginLeft: point ? 10 : 0 }}>
                <div className='fx-y-center'>报警人员设置</div>
              </div>
            </div>
            <ConfigProvider
              theme={{
                token: {
                  controlHeight: point ? 40 : 32,
                  fontSize: point ? 14 : 12,
                },
              }}>
              <Form
                name='basic'
                form={form}
                layout='inline'
                wrapperCol={{ span: 24 }}
                autoComplete='off'>
                <Form.Item>
                  <ConfigProvider
                    theme={{
                      token: {
                        colorPrimary: '#ff4d4f',
                        colorPrimaryHover: '#ff4d4f',
                      },
                    }}>
                    <div className='btn-group'>
                      <div className='btn' onClick={() => handleAdd()}>
                        <i className='icon iconfont icon-bianji'></i>
                        <span>新增</span>
                      </div>
                    </div>
                  </ConfigProvider>
                </Form.Item>
              </Form>
            </ConfigProvider>
            <div className='close-btn fx-center-center' onClick={close}>
              <div className='icon iconfont icon-shouhui'></div>
            </div>
          </header>
          <div
            className='drawer-table-wrap'
            style={{ marginTop: point ? '' : 20 }}>
            <Table
              className='drawer-table'
              columns={tableColumns}
              dataSource={tableData}
              pagination={false}
              rowKey={'id'}
              loading={loading}
              components={{
                body: {
                  row: EditableRow,
                  cell: EditableCell,
                },
              }}
            />
          </div>
        </div>
      </div>
    </Drawer>
  )
}
export default forwardRef(Dialog)
