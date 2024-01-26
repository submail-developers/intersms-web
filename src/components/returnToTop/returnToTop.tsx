import { useState, useEffect } from 'react'
import { createThrottle } from '@/utils/helpers'
import { UpOutlined } from '@ant-design/icons'
import './returnToTop.scss'

const BackToTop = () => {
  // 图标的显隐状态
  const [show, switchShow] = useState(false)

  useEffect(() => {
    const listener = createThrottle(() => {
      const shouldShow = window.scrollY > 300
      if (shouldShow !== show) {
        switchShow(shouldShow)
      }
    }, 500) as EventListener // 事件监听器
    document.addEventListener('scroll', listener)
    // 组件销毁时，取消监听
    return () => document.removeEventListener('scroll', listener)
  }, [show])

  return show ? (
    <div className='go-top' onClick={() => window.scrollTo(0, 0)}>
      <UpOutlined
        rev={undefined}
        style={{ fontSize: '24px', marginTop: '4px' }}
      />
      <div>顶部</div>
    </div>
  ) : null
}

export default BackToTop
