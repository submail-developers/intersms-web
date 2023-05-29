import { NavLink } from 'react-router-dom'
import logo from '@/assets/img/logo.png'
import './header.scss'
import { useSize } from '@/hooks'

export default function Header() {
  const size = useSize()
  return (
    <div
      data-class='header-container'
      className={`fx-between-center fx-shrink ${size}`}>
      <NavLink to={'/'}>
        <img src={logo} alt='' className='logo' />
      </NavLink>
      <div className='right fn16 fx-y-center'>
        <div className='text'>欢迎使用赛邮国际短信网关 1.0</div>
        <div className='logout-wrap'>
          <i className='icon iconfont icon-tuichu fn16'></i>
          <span className='fn14'>退出登录</span>
        </div>
      </div>
    </div>
  )
}
