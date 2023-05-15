import MenuTitle from '@/components/menuTitle/menuTitle'
import LeftTab from './left'
import RightTab from './right'
import { useSize } from '@/hooks'
import './blackList.scss'

// 黑名单
export default function BlackList() {
  const size = useSize()
  return (
    <div data-class='blackList'>
      <MenuTitle title='黑名单'></MenuTitle>
      <div className={size == 'small' ? '' : 'fx info-wrap'}>
        <LeftTab />
        <RightTab />
      </div>
    </div>
  )
}
