import logo from '@/assets/img/logo.svg'
import './header.scss'
import { logout, updateConfig } from '@/api'
import { useSize } from '@/hooks'
import { useNavigate } from 'react-router-dom'
import { App } from 'antd'
export default function Header() {
  const nav = useNavigate()
  const size = useSize()
  const { message } = App.useApp()
  const logoutEvent = async () => {
    await logout()
    nav('/')
  }
  const synchronousCon = async () => {
    // await updateConfig()
    const res = await updateConfig()
    console.log(res)
    if (res.status == 'success') {
      message.warning('同步成功！')
    } else {
      message.warning('同步失败！')
    }
  }
  return (
    <div
      data-class='header-container'
      className={`fx-between-center fx-shrink ${size}`}>
      <img src={logo} alt='' className='logo' onClick={() => nav('/console')} />
      <div className='right fn16 fx-y-center'>
        <div className='logout-wrap tongbu2x-con' onClick={synchronousCon}>
          <i
            className='icon iconfont icon-a-tongbu2x fn16'
            style={{ color: '#ff4d4f' }}></i>
          <span className='fn14' style={{ color: '#ff4d4f' }}>
            {size == 'middle' ? '同步配置' : ''}
          </span>
        </div>
        &nbsp;&nbsp;
        <div className='logout-wrap tuichu-con' onClick={logoutEvent}>
          <i className='icon iconfont icon-tuichu fn16'></i>
          <span className='fn14 tuichu'>
            {size == 'middle' ? '退出登录' : ''}
          </span>
        </div>
      </div>
    </div>
  )
}
