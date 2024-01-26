import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Drawer } from 'antd'
import { routerList } from '@/routes'
import { RouteObject, useMatches, useLocation } from 'react-router-dom'
import { logout } from '@/api'
import './mobileMenu.scss'

type Props = {
  show: boolean
  onClose: () => void
}
export default function MobileMenu(props: Props) {
  const [activeBar, setactiveBar] = useState('') // 左侧bar
  const nav = useNavigate()

  const location = useLocation()
  const matchList = useMatches()
  let [menuList, setMenuList] = useState<Array<RouteObject>>([])

  const onClose = () => {
    props.onClose()
  }

  // 点击sidebar
  const handleSideBar = (path) => {
    setactiveBar(path)
    const sideBarData = routerList.find((item) => item.path == path)
    if (sideBarData) {
      setMenuList(sideBarData.children)
    }
  }
  // 点击menu
  const handleMenu = (menu, ditem) => {
    props.onClose()
    nav(activeBar + '/' + menu.path + '/' + ditem.path)
  }

  useEffect(() => {
    const currentMatchBaseRouteObj = matchList.find(
      (match) => !match.id.includes('-'),
    )
    handleSideBar(currentMatchBaseRouteObj.pathname)
  }, [props.show])

  // 退出登录
  const logoutEvent = async () => {
    await logout()
    nav('/')
  }

  return (
    <Drawer
      title=''
      placement='left'
      onClose={onClose}
      open={props.show}
      className='mobile-menu-darwer'>
      <ul className='nav-bar'>
        {routerList.map((item) => (
          <dd
            key={item.path}
            onClick={() => handleSideBar(item.path)}
            className={`${item.path == activeBar ? 'active' : ''}`}>
            <div className='fx-col-center-center'>
              <span>{item.handle.aliasMob}</span>
            </div>
          </dd>
        ))}
        <div className='logout-wrap tuichu-con' onClick={logoutEvent}>
          <i className='icon iconfont icon-tuichu fn16'></i> &nbsp;
          <span className='fn14 tuichu'>退出登录</span>
        </div>
      </ul>

      <ul className='nav-item'>
        <div
          data-class='sidemenu'
          className={`fx-col fx-shrink`}
          style={{ background: 'none', overflow: 'hidden' }}>
          {menuList.map((menu, index) => (
            <dl className='col' key={index}>
              {menu.handle.alias && (
                <dt className='fn12'>{menu.handle.alias}</dt>
              )}
              {menu.children &&
                menu.children.map((ditem) => (
                  <dd
                    className={`fn14 ${
                      location.pathname ==
                      activeBar + '/' + menu.path + '/' + ditem.path
                        ? 'active'
                        : ''
                    }`}
                    key={ditem.path}
                    onClick={() => handleMenu(menu, ditem)}>
                    {ditem.handle.alias}
                  </dd>
                ))}
            </dl>
          ))}
        </div>
      </ul>
    </Drawer>
  )
}
