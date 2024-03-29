import { useState, useEffect, useContext } from 'react'
import { NavLink, RouteObject, useMatches, useLocation } from 'react-router-dom'
import { routerList } from '@/routes'
import { useAppDispatch, useAppSelector } from '@/store/hook'

import './sideMenu.scss'
import { useSize } from '@/hooks'
import { closeIt, openIt, menuCloseStatus } from '@/store/reducers/menu'
import { CountContext } from '../index'
// 二级导航
export default function SideMenu() {
  const location = useLocation()
  const matchList = useMatches()
  const currentMatchBaseRouteObj = matchList.find(
    (match) => !match.id.includes('-'),
  )
  const size = useSize()
  const dispatch = useAppDispatch()

  let [menuList, setMenuList] = useState<Array<RouteObject>>([])
  useEffect(() => {
    if (size == 'small') {
      dispatch(closeIt())
    } else {
      dispatch(openIt())
    }
    routerList.map((item) => {
      if (
        currentMatchBaseRouteObj &&
        item.path == currentMatchBaseRouteObj.pathname
      ) {
        setMenuList(item?.children || [])
      }
    })
  }, [location.pathname, currentMatchBaseRouteObj?.pathname])

  // menu状态
  const close = useAppSelector(menuCloseStatus)
  const context = useContext(CountContext)
  return (
    <div
      data-class='sidemenu'
      className={`fx-col fx-shrink ${close ? 'close' : ''}`}>
      {menuList.map((menu, index) => (
        <dl className='col' key={index}>
          {menu.handle.alias && <dt className='fn12'>{menu.handle.alias}</dt>}
          {menu.children &&
            menu.children.map((ditem) => (
              <dd className='fn14' key={ditem.path}>
                <NavLink to={`${menu.path}/${ditem.path}`}>
                  {/* {ditem.handle.alias} */}
                  {menu.path == 'customer' && ditem.path == 'failTask' ? (
                    <>
                      {ditem.handle.alias}
                      {context > '0' ? (
                        <span className='fail-badge'>{context}</span>
                      ) : (
                        ''
                      )}
                    </>
                  ) : (
                    <>{ditem.handle.alias}</>
                  )}
                </NavLink>
              </dd>
            ))}
        </dl>
      ))}
    </div>
  )
}
