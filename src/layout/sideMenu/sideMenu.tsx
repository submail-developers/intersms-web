import { useState, useEffect } from 'react'
import { NavLink, RouteObject, useMatches, useLocation } from 'react-router-dom'
import { routerList } from '@/routes'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { getHandlerList } from '@/api'
import { API } from 'apis'
import './sideMenu.scss'
import { useSize } from '@/hooks'
import { closeIt, openIt, menuCloseStatus } from '@/store/reducers/menu'
interface DataType extends API.GetHandlerListItem {}
// 二级导航
export default function SideMenu() {
  const location = useLocation()
  const matchList = useMatches()
  const [faliTaskCount, setFaliTaskCount] = useState(null)
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

  useEffect(() => {
    let intervalId = null
    const getFailTask = async () => {
      try {
        const params = {
          mail: '',
          page: '',
          limit: '50',
        }
        const res = await getHandlerList(params)

        let list: DataType[] = res.data.data.map((item, index) => {
          let obj = { ...item, index: `${index}` }
          return obj
        })
        let counts = list.filter((list) => list.flg == '1').length
        setFaliTaskCount(counts)
      } catch (error) {}
    }
    getFailTask()
    intervalId = setInterval(getFailTask, 5000) // 每5秒调用一次
    return () => {
      clearInterval(intervalId) // 清除定时器
    }
  }, [])
  // 获取失败任务处理列表

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
                      <span className='fail-badge'>{faliTaskCount}</span>
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
