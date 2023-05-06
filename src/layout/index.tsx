import { Outlet } from 'react-router-dom'; 
import Header from './header/header'
import SideBar from './sideBar/sideBar'
import SideMenu from './sideMenu/sideMenu'
import Breadcrumb from './breadcrumb/breadcrumb';
import { useAppSelector } from '@/store/hook';
import { menuCloseStatus } from '@/store/reducers/menu';
import './index.scss';

export default () => {
  const close = useAppSelector(menuCloseStatus)
  return (
    <div data-class='page-container' className='fx-col'>
      <Header></Header>
      <div className='layout fx'>
        <SideBar></SideBar>
        <div className='content fx-auto fx-col'>
          <Breadcrumb></Breadcrumb>
          <div className='wrap fx-auto fx'>
            <SideMenu></SideMenu>
            <div className={`content-page ${close ? 'close': ''}`}>
              <Outlet/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}