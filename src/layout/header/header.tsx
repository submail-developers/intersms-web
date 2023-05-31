import { NavLink } from 'react-router-dom'
import logo from '@/assets/img/logo.svg'
import './header.scss'
import { logout } from '@/api'
import { useSize } from '@/hooks'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const nav = useNavigate()
  const size = useSize()
  const logoutEvent = async () => {
    await logout()
    nav('/')
  }
  return (
    <div
      data-class='header-container'
      className={`fx-between-center fx-shrink ${size}`}>
      <img src={logo} alt='' className='logo' onClick={() => nav('/console')} />
      <div className='right fn16 fx-y-center'>
        <div className='text'>欢迎使用赛邮国际短信网关 1.0</div>
        <div className='logout-wrap' onClick={logoutEvent}>
          <i className='icon iconfont icon-tuichu fn16'></i>
          <span className='fn14'>退出登录</span>
        </div>
      </div>
    </div>
  )
}
