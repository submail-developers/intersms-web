import { Suspense, LazyExoticComponent } from 'react'

// 路由懒加载
const LazyImportComponent = (props: {
  lazyChildren: LazyExoticComponent<() => JSX.Element>
}) => {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <props.lazyChildren />
    </Suspense>
  )
}

export default LazyImportComponent
