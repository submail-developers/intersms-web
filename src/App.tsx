import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import router from '@/routes'
import { store } from '@/store'
// 自定义loading组件，配合redux使用。项目目前使用的是默认的message.loading
// import Loading from '@/components/loading/loading'
import AntdStaticFn from '@/components/antd/staticFn/staticFn'

// antd
import token from '@/style/antdToken'

// 设置默认风格样式及antd使用中文格式
// 使用AntdApp包裹组件的原因https://ant.design/components/app-cn
import { ConfigProvider, App as AntdApp } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: token,
      }}
      locale={zhCN}>
      <AntdApp style={{ width: '100%', height: '100%' }}>
        <Provider store={store}>
          <RouterProvider router={router} />
          {/* <Loading></Loading> */}
        </Provider>
        {/* antd的静态方法。在路由拦截里可以使用message、notification、modal */}
        <AntdStaticFn />
      </AntdApp>
    </ConfigProvider>
  )
}
