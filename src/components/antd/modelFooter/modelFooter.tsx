import './modelFooter.scss'

interface Props {
  onOk: () => void
  onCancel: () => void
}

// 自定义弹框地步按钮
export default (props: Props) => {
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
