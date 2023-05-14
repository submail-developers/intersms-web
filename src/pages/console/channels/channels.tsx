import MenuTitle from '@/components/menuTitle/menuTitle'
import LeftTab from './left'
import RightTab from './right'
import { useSize } from '@/hooks'
import './channels.scss'

// 通道组管理
export default function AccountInfo() {
  const size = useSize()
  return (
    <div data-class='channels'>
      <MenuTitle title='通道组管理'></MenuTitle>
      <div className={size == 'small' ? '' : 'fx info-wrap'}>
        <LeftTab />
        <RightTab />
      </div>
    </div>
  )
}
