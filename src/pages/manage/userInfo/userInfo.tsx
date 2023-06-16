import MenuTitle from '@/components/menuTitle/menuTitle'
import Info from './info/info'
import Log from './log/log'
import './userInfo.scss'
export default function Fn() {
  return (
    <div data-class='userInfo'>
      <MenuTitle title='账号信息管理'></MenuTitle>
      <Info />
      <Log />
    </div>
  )
}
