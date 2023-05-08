import { useState, useEffect } from 'react';
import { NavLink, RouteObject, useMatches, useLocation } from 'react-router-dom';
import { routerList } from '@/routes';
import { useAppSelector } from '@/store/hook';
import { menuCloseStatus } from '@/store/reducers/menu';
import './sideMenu.scss';

// 二级导航
export default function SideMenu() {
  const location = useLocation()
  const matchList = useMatches()
  const currentMatchBaseRouteObj = matchList.find(match => !match.id.includes('-'))

  let [menuList, setMenuList] = useState<Array<RouteObject>>([])
  useEffect(() => {
    routerList.map(item => {
      if (currentMatchBaseRouteObj && item.path == currentMatchBaseRouteObj.pathname) {
        setMenuList(item?.children || [])
      }
    })
  }, [location.pathname, currentMatchBaseRouteObj?.pathname])

  // menu状态
  const close = useAppSelector(menuCloseStatus)

  return (
    <div data-class='sidemenu' className={`fx-col fx-shrink ${close ? 'close': ''}`}>
      {
        menuList.map((menu, index) => (
          <dl className='col' key={index}>
            {
              menu.handle.alias&&<dt className='fn12'>{menu.handle.alias}</dt>
            }
            {
              menu.children && menu.children.map(ditem => (
                <dd className='fn14' key={ditem.path}>
                  <NavLink to={`${menu.path}/${ditem.path}`}>{ditem.handle.alias}</NavLink>
                </dd>
              ))
            }
          </dl>
        ))
      }
    </div>
  );
};
