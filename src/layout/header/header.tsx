import { NavLink } from 'react-router-dom';
import logo from '@/assets/img/logo.png'
import './header.scss'
import { useSize } from '@/hooks';

export default () => {
  const size = useSize()
  return (
    <div data-class='header-container' className={`fx-start-center fx-shrink ${size}`}>
      <NavLink to={'/'}>
        <img src={logo} alt="" className="logo" />
      </NavLink>
      <div className="text">欢迎使用赛邮国际短信网关 1.0</div>
    </div>
  );
};
