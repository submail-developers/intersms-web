import { Outlet } from 'react-router-dom'
import Header from './header/header'
import SideBar from './sideBar/sideBar'
import SideMenu from './sideMenu/sideMenu'
import Breadcrumb from './breadcrumb/breadcrumb'
import { useAppSelector } from '@/store/hook'
import { menuCloseStatus } from '@/store/reducers/menu'
import { useState, useEffect, createContext } from 'react'
import { getHandlerList } from '@/api'
import { API } from 'apis'
import './index.scss'
interface DataType extends API.GetHandlerListItem {}
export const CountContext = createContext(null)

export default function Layout() {
  const close = useAppSelector(menuCloseStatus)
  const [faliTaskCount, setFaliTaskCount] = useState(null)
  // 获取失败任务处理列表 未处理数量
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

  return (
    <div data-class='page-container' className='fx-col'>
      <CountContext.Provider value={faliTaskCount}>
        <Header></Header>

        <div className='layout fx'>
          <SideBar></SideBar>
          <div className='content fx-auto fx-col'>
            <Breadcrumb></Breadcrumb>
            <div className='wrap fx-auto fx'>
              <SideMenu></SideMenu>
              <div className={`content-page ${close ? 'close' : ''}`}>
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </CountContext.Provider>
    </div>
  )
}
