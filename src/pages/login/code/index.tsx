import { useState, useRef, useEffect, RefObject } from 'react'
import { Form, Input } from 'antd'
import type { InputRef } from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import './index.scss'

interface Props {
  step: number
  beforeStep: () => void
}

interface Refs {
  inputRef1: RefObject<InputRef>
  inputRef2: RefObject<InputRef>
  inputRef3: RefObject<InputRef>
  inputRef4: RefObject<InputRef>
  inputRef5: RefObject<InputRef>
  inputRef6: RefObject<InputRef>
}

type Z = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | ''
type C = 1 | 2 | 3 | 4 | 5 | 6

type CodeList = [Z, Z, Z, Z, Z, Z]

interface ItemProps {
  index: number
  cindex: number
  next: () => void
}
const nums = '0123456789'

function Code(props: Props) {
  const [loading, setLoaidng] = useState(false)
  const [form] = Form.useForm()
  const [cindex, setcindex] = useState<C>(1)
  const nav = useNavigate()
  const refs: Refs = {
    inputRef1: useRef<InputRef>(null),
    inputRef2: useRef<InputRef>(null),
    inputRef3: useRef<InputRef>(null),
    inputRef4: useRef<InputRef>(null),
    inputRef5: useRef<InputRef>(null),
    inputRef6: useRef<InputRef>(null),
  }
  const beforeStep = () => {
    props.beforeStep()
  }
  const submit = async () => {
    // const value = await form.validateFields()
    // console.log(redirect)
    return nav('/console')
  }

  const next = () => {
    if (cindex >= 6) {
      setcindex(6)
      refs.inputRef6.current?.focus()
    } else {
      refs[`inputRef${(cindex + 1) as C}`].current?.focus()
      setcindex((cindex + 1) as C)
    }
  }
  const before = () => {
    if (cindex <= 1) {
      setcindex(1)
    } else {
      refs[`inputRef${(cindex - 1) as C}`].current?.focus()
      setcindex((cindex - 1) as C)
    }
  }
  const oninput = async (e: any, inputRef: RefObject<InputRef>) => {
    let str = e.target.value
    if (str.length == 6) {
      let isNumber = true
      for (let i = 0; i < 6; i++) {
        if (!nums.includes(str[i])) {
          isNumber = false
        }
      }
      if (isNumber) {
        let timer = setTimeout(() => {
          form.setFieldsValue({
            numb1: str[0],
            numb2: str[1],
            numb3: str[2],
            numb4: str[3],
            numb5: str[4],
            numb6: str[5],
          })
          inputRef.current?.blur()
          setcindex(6)
          clearTimeout(timer)
        }, 0)
        return
      } else {
        let values = await form.getFieldsValue()
        form.setFieldsValue({
          ...values,
          [`numb${cindex}`]: '',
        })
        return
      }
    }
    if (str.length > 1) {
      let lastStr = str.substr(-1)
      if (!nums.includes(lastStr)) {
        lastStr = ''
      }
      let values = await form.getFieldsValue()
      form.setFieldsValue({
        ...values,
        [`numb${cindex}`]: lastStr,
      })
      inputRef.current?.blur()
      next()
    } else if (str.length == 1) {
      if (!nums.includes(str)) {
        let values = await form.getFieldsValue()
        form.setFieldsValue({
          ...values,
          [`numb${cindex}`]: '',
        })
        return
      }
      inputRef.current?.blur()
      next()
    }
  }
  const onFocus = (num: C) => {
    setcindex(num)
  }

  // 监听删除事件
  useEffect(() => {
    window.addEventListener('keydown', onKeyDown) // 添加全局事件
    return () => {
      window.removeEventListener('keydown', onKeyDown) // 销毁
    }
  }, [cindex, props.step])

  // 键盘事件
  const onKeyDown = async (e: any) => {
    switch (e.keyCode) {
      case 8:
        let currentInputValue = await form.getFieldValue(`numb${cindex}`)
        if (!currentInputValue) {
          before()
        }
        break
      case 13:
        //  handleLogin(event)
        break
    }
  }

  return (
    <div data-class='code' style={{ opacity: props.step == 1 ? '1' : '0' }}>
      <div>
        <div className='back' onClick={() => props.beforeStep()}>
          <LeftOutlined />
          返回
        </div>
        <div className='title'>输入手机号验证码</div>
        <div className='tips'>
          请输入至<span>+86 184******12 </span>的6位验证码
        </div>
        <div style={{ width: '100%', overflow: 'hidden' }}>
          <Form
            name='form'
            form={form}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 24 }}
            layout='inline'
            autoComplete='off'>
            <Form.Item label='' name='numb1'>
              <Input
                placeholder=''
                ref={refs.inputRef1}
                onInput={(e) => oninput(e, refs.inputRef1)}
                onFocus={() => onFocus(1)}
              />
            </Form.Item>
            <Form.Item label='' name='numb2'>
              <Input
                placeholder=''
                ref={refs.inputRef2}
                onInput={(e) => oninput(e, refs.inputRef2)}
                onFocus={() => onFocus(2)}
              />
            </Form.Item>
            <Form.Item label='' name='numb3'>
              <Input
                placeholder=''
                ref={refs.inputRef3}
                onInput={(e) => oninput(e, refs.inputRef3)}
                onFocus={() => onFocus(3)}
              />
            </Form.Item>
            <div className='line'></div>
            <Form.Item label='' name='numb4'>
              <Input
                placeholder=''
                ref={refs.inputRef4}
                onInput={(e) => oninput(e, refs.inputRef4)}
                onFocus={() => onFocus(4)}
              />
            </Form.Item>
            <Form.Item label='' name='numb5'>
              <Input
                placeholder=''
                ref={refs.inputRef5}
                onInput={(e) => oninput(e, refs.inputRef5)}
                onFocus={() => onFocus(5)}
              />
            </Form.Item>
            <Form.Item label='' name='numb6'>
              <Input
                placeholder=''
                ref={refs.inputRef6}
                onInput={(e) => oninput(e, refs.inputRef6)}
                onFocus={() => onFocus(6)}
              />
            </Form.Item>
          </Form>
        </div>
        <div className={`btn ${loading && 'loading'}`} onClick={submit}>
          安全验证
        </div>
      </div>
    </div>
  )
}
export default Code
