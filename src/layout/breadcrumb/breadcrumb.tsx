import './breadcrumb.scss'
import { useLoaderData } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { changeClose, menuCloseStatus } from '@/store/reducers/menu'

/**
 * 面包屑
 */
export default function BreadCrumb() {
  const status = useAppSelector(menuCloseStatus)
  const dispatch = useAppDispatch()
  const loaderData = useLoaderData() as { name: string }

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
      </div>
    </div>
  )
}
