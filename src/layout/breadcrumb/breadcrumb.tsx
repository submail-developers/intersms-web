import './breadcrumb.scss'
import { useMatches } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { changeClose, menuCloseStatus } from '@/store/reducers/menu';

/**
 * 面包屑
*/
export default () => {
  const status = useAppSelector(menuCloseStatus)
  const dispatch = useAppDispatch();

  const matches = useMatches()
  // 获取一级菜单的name
  let crumbs = matches
    // @ts-ignore
    .filter((match) => Boolean(match.handle&&match.handle?.crumb&&!match.id.includes('-')))
    // @ts-ignore
    .map((match) => match.handle.crumb(match.data));

  return (
    <div data-class='breadcrumb' className='fx-y-center'>
      <div className='prefix-btn fx-center-center' onClick={() => dispatch(changeClose())}>
        <i className={
          `iconfont fn18 icon-${status?'shouhui':'shouhui1'}`
        }></i>
      </div>
      <div className='crumb fn18'>
        {
          crumbs.map(item => item)
        }
      </div>
    </div>
  )
}
