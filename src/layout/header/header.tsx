import React, { useState, useEffect, Children } from 'react'
import logo from '@/assets/img/logo.svg'
import './header.scss'
import { logout, updateConfig } from '@/api'
import { useSize } from '@/hooks'
import { useNavigate } from 'react-router-dom'
import { App, Popconfirm, Drawer, Button, Space } from 'antd'
import type { DrawerProps } from 'antd'
import { UnorderedListOutlined } from '@ant-design/icons'
import { routerList } from '@/routes'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { NavLink, RouteObject, useMatches, useLocation } from 'react-router-dom'
import { closeIt, openIt, menuCloseStatus } from '@/store/reducers/menu'
import MobileMenu from '../mobileMenu/mobileMenu'

export default function Header() {
  const nav = useNavigate()
  const size = useSize()
  const { message } = App.useApp()
  const [open, setOpen] = useState(false)
  const [sizeSide, setSizeSide] = useState<DrawerProps['size']>()
  const [childrenDrawer, setChildrenDrawer] = useState(false)
  const [type, setType] = useState('user') //tab的type值
  const [showMobileMenu, setshowMobileMenu] = useState(false)
  const location = useLocation()
  const matchList = useMatches()
  const currentMatchBaseRouteObj = matchList.find(
    (match) => !match.id.includes('-'),
  )
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
  // 多层抽屉

  const showDefaultDrawer = () => {
    setshowMobileMenu(true)
  }

  const showLargeDrawer = () => {
    setSizeSide('large')
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }
  const showChildrenDrawer = () => {
    setChildrenDrawer(true)
  }

  const onChildrenDrawerClose = () => {
    setChildrenDrawer(false)
  }

  const handleSideBar = (path) => {
    const sideBarData = routerList.find((item) => item.path == path)

    if (sideBarData) {
      setMenuList(sideBarData.children)
      console.log(menuList)
    }
  }

  return (
    <>
      <div
        data-class='header-container'
        className={`fx-between-center fx-shrink ${size}`}>
        <img
          src={logo}
          alt=''
          className='logo'
          onClick={() => nav('/console')}
        />
        <div className='right fn16 fx-y-center'>
          <Popconfirm
            placement='bottom'
            title='警告'
            description='确定同步全局配置吗？'
            onConfirm={synchronousCon}
            okText='确定'
            cancelText='取消'>
            <div
              className='btn delete logout-wrap tongbu2x-con'
              style={{ display: 'flex', alignItems: 'center' }}>
              <i
                className='icon iconfont icon-a-tongbu2x fn16'
                style={{ color: '#ff4d4f' }}></i>
              <span className='fn14' style={{ color: '#ff4d4f' }}>
                同步全局配置
              </span>
            </div>
          </Popconfirm>
          &nbsp;&nbsp;
          {size == 'small' ? (
            <>
              <Space>
                <Button type='primary' onClick={showDefaultDrawer}>
                  <UnorderedListOutlined
                    rev={undefined}
                    style={{ color: '#fff', fontSize: '18px' }}
                  />
                </Button>
              </Space>
              <MobileMenu
                show={showMobileMenu}
                onClose={() => setshowMobileMenu(false)}
              />
            </>
          ) : (
            <div className='logout-wrap tuichu-con' onClick={logoutEvent}>
              <i className='icon iconfont icon-tuichu fn16'></i>
              <span className='fn14 tuichu'>
                {size == 'middle' ? '退出登录' : ''}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
