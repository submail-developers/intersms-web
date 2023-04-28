import { Outlet } from 'react-router-dom'; 
import Header from './header/header'
import SideBar from './sideBar/sideBar'
import SideMenu from './sideMenu/sideMenu'
import Breadcrumb from './breadcrumb/breadcrumb';
import PageTitle from './pageTitle/pageTitle';
import './index.scss'

export default () => {
  return (
    <div data-class='page-container' className='fx-col'>
      <Header></Header>
      <div className='layout fx'>
        <SideBar></SideBar>
        <div className='content fx-auto fx-col'>
          <Breadcrumb></Breadcrumb>
          <div className='wrap fx-auto fx'>
            <SideMenu></SideMenu>
            <div className='content-page'>
              <PageTitle />
              <div className='outlet-content'>
                <Outlet/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}