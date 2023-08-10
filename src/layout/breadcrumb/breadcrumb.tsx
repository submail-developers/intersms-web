import './breadcrumb.scss'
import { useLoaderData } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { changeClose, menuCloseStatus } from '@/store/reducers/menu'
import React, { useState, useEffect } from 'react'
/**
 * 面包屑
 */

export default function BreadCrumb() {
  const status = useAppSelector(menuCloseStatus)
  const dispatch = useAppDispatch()
  const loaderData = useLoaderData() as { name: string }
  const [height, setHeight] = useState(0)
  const resizeUpdate = (e) => {
    // 通过事件对象获取浏览器窗口的宽度
    let w = e.target.innerWidth
    setHeight(w)
    if (w < 568) {
      changeClose()
    }
  }
  useEffect(() => {
    // 页面刚加载完成后获取浏览器窗口的大小
    let w = window.innerWidth
    setHeight(w)

    // 页面变化时获取浏览器窗口的大小
    window.addEventListener('resize', resizeUpdate)

    return () => {
      // 组件销毁时移除监听事件
      window.removeEventListener('resize', resizeUpdate)
    }
  }, [])

  // const matches = useMatches()
  // // 获取一级菜单的name
  // let crumbs = matches
  //   .filter((match) =>
  //     // @ts-ignore
  //     Boolean(match.handle && match.handle?.crumb && !match.id.includes('-')),
  //   )
  //   // @ts-ignore
  //   .map((match) => match.handle.crumb(match.data))
  // console.log(matches, 'matches')
  // console.log(crumbs, 'crumbs')
  // console.log(loaderData, 'loaderData')

  return (
    <div data-class='breadcrumb-wrap'>
      <div className=' fx-y-center breadcrumb'>
        <div
          className='prefix-btn fx-center-center'
          onClick={() => dispatch(changeClose())}>
          <i
            className={`iconfont fn14 icon-${
              status ? 'shouhui' : 'shouhui1'
            }`}></i>
        </div>
        <div className='crumb fn18'>{loaderData.name}</div>
        <div>浏览器的宽度为：{height}</div>
      </div>
    </div>
  )
}
