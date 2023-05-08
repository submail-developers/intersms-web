import { NavLink } from 'react-router-dom';
import { routerList } from '@/routes'
import './sideBar.scss';
import user from '@/assets/img/user.png';

// 一级导航
export default function SizeBar() {
  return (
    <dl data-components='sidebar' className="fx-col-start-center fx-shrink">
      <dt className="fx-center-center">
        <NavLink to='/console'>
          <img src={user} className="user" alt="" />
        </NavLink>
      </dt>
      {
        routerList.map(item => (
          <dd key={item.path}>
            <NavLink to={item.path||'/'} className="fx-col-center-center">
              <span className={item.handle.icon + ' iconfont fn22'}></span>
              <span>{item.handle.alias}</span>
            </NavLink>
          </dd>
        ))
      }
    </dl>
  );
};
