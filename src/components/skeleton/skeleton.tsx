import { Spin } from 'antd'
import './skeleton.scss'
// 懒加载的站位组件
export default () => {
  return (
    <div data-class='skeleton'>
      <Spin />
    </div>
  )
}
