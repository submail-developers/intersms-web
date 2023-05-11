import { Spin } from 'antd'
import { useAppSelector } from '@/store/hook'
import { loadingStatus } from '@/store/reducers/loading'

import './loading.scss'

// 自定义loading组件，配合redux使用。项目目前使用的是默认的message.loading
export default function Loading() {
  const show = useAppSelector(loadingStatus)
  return (
    <>
      {show && (
        <div data-class='loading'>
          <Spin />
        </div>
      )}
    </>
  )
}
