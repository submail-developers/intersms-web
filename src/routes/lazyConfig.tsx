import { Suspense, LazyExoticComponent } from 'react'
import Skeleton from '@/components/skeleton/skeleton'
// 路由懒加载
const LazyImportComponent = (props: {
  lazyChildren: LazyExoticComponent<() => JSX.Element>
}) => {
  return (
    <Suspense fallback={<Skeleton />}>
      <props.lazyChildren />
    </Suspense>
  )
}

export default LazyImportComponent
