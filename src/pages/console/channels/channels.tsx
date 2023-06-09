import MenuTitle from '@/components/menuTitle/menuTitle'
import LeftTab from './left'
import RightTab from './right'
import { usePoint } from '@/hooks'
import './channels.scss'

// 通道组管理
export default function AccountInfo() {
  const point = usePoint('xl')
  return (
    <div data-class='channels'>
      <MenuTitle title='通道组管理'></MenuTitle>
      <div className={!point ? '' : 'fx info-wrap'}>
        <LeftTab />
        <RightTab />
      </div>
    </div>
  )
}
