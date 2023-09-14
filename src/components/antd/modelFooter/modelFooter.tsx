import { useEffect } from 'react'
import './modelFooter.scss'

interface Props {
  onOk: () => void
  onCancel: () => void
  disabledEnter?: boolean // 是否禁止enter键触发 确认事件
  textareaDisabledEnter?: boolean // 当为textarea是否禁止enter键 触发 确认事件
}

// 自定义弹框地步按钮
export default (props: Props) => {
  useEffect(() => {
    if (!props.disabledEnter) {
      window.addEventListener('keydown', onKeyDown) // 添加enter键盘事件
    }
    return () => {
      if (!props.disabledEnter) {
        window.removeEventListener('keydown', onKeyDown) // 销毁
      }
    }
  }, [props.disabledEnter])
  // 键盘事件
  const onKeyDown = (e) => {
    switch (e.keyCode) {
      case 13:
        if (e.target.type != 'textarea' && !props.textareaDisabledEnter) {
          props.onOk()
        }
        break
    }
  }
  return (
    <div data-class='model-footer-wrap'>
      <div className='footer-btn cancel' onClick={props.onCancel}>
        取消
      </div>
      <div className='footer-btn confirm' onClick={props.onOk}>
        确定
      </div>
    </div>
  )
}
