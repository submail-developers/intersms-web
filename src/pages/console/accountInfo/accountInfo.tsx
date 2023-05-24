import { MutableRefObject, useRef } from 'react'
import MenuTitle from '@/components/menuTitle/menuTitle'
import LeftTab from './left'
import RightTab from './right'
import { useSize } from '@/hooks'
import './accountInfo.scss'

// 客户信息
export default function AccountInfo() {
  const leftRef: MutableRefObject<any> = useRef(null)
  const size = useSize()
  // 刷新左侧数据
  const forceUpdateLeft = () => {
    leftRef.current?.forceSearch()
  }
  return (
    <div data-class='accountinfo'>
      <MenuTitle title='客户信息'></MenuTitle>
      <div className={size == 'small' ? '' : 'fx info-wrap'}>
        <LeftTab ref={leftRef} />
        <RightTab forceUpdateLeft={forceUpdateLeft} />
      </div>
    </div>
  )
}
