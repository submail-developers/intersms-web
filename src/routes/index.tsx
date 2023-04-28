import { RouteObject, createBrowserRouter, redirect, Navigate } from "react-router-dom";
import Login from '@/pages/login/login';
import Layout from '@/layout';
import Error from '@/pages/error';
import SendList from '@/pages/console/sendList/sendList';
import AccountInfo from '@/pages/console/accountInfo/accountInfo';
import Channel from '@/pages/console/channel/channel';
import Channels from '@/pages/console/channels/channels';
import Country from '@/pages/console/country/country';
import Network from '@/pages/console/network/network';
import NumberChannelsRoute from '@/pages/console/numberAttribution/numberAttribution';
import Warning from '@/pages/console/warning/warning';
import NumberAttribution from '@/pages/console/numberAttribution/numberAttribution';
import SensitiveWord from '@/pages/console/sensitiveWord/sensitiveWord';
import CodeList from '@/pages/console/codeList/codeList';
import BlackList from '@/pages/console/blackList/blackList';
import Manage from '@/pages/manage/manage';
import Test from '@/pages/test';

/**
 * handle中拿到的参数
 * @param name string 路由名称
 * @example https://reactrouter.com/en/6.10.0/hooks/use-matches
*/
export interface RouteExtParams {
  name?: string // 面包屑展示的名字
  alias?: string // 侧边栏的名称
  icon?: string // 侧边栏的icon
}

const loaderFn = (props?:RouteExtParams, cb?: () => void) => {
  return () => {
    cb&&cb()
    return props
  }
}

const handleFn = (params?: RouteExtParams) => {
  return {
    crumb: (data:RouteExtParams) => { // 获取loader上的数据
      return data.name
    },
    ...params
  }
}

export const baseRouterList: RouteObject[] = [
  {
    path: '/',
    loader: () => {
      throw redirect('/login') // 重定向到登陆页面
    }
  }, {
    path: '/login',
    element: <Login />,
    errorElement: <Error />
  }, {
    path: '/console',
    element: <Navigate to='/console/customer/sendlist' />
  }, {
    path: '/data',
    element: <Navigate to='/data/manage/index' />
  }, {
    path: '/manage',
    element: <Navigate to='/manage/center/index' />
  }
]

export const routerList:RouteObject[] = [
  {
    path: '/console',
    element: <Layout />,
    loader: loaderFn({name: '客户管理'}),
    handle: handleFn({alias: '客户', icon: 'icon-kehuguanli'}),
    children: [
      {
        path: 'customer',
        handle: handleFn({alias: ''}),
        children: [
          {
            path: 'sendlist',
            element: <SendList />,
            errorElement: <Error />,
            loader: loaderFn({name: '发送列表'}),
            handle: handleFn({alias: '发送列表'}),
          }, {
            path: 'accountinfo',
            element: <AccountInfo />,
            errorElement: <Error />,
            loader: loaderFn({name: '客户信息'}),
            handle: handleFn({alias: '客户信息'}),
          },
        ]
      },
      {
        path: 'channel',
        handle: handleFn({alias: '通道配置'}),
        children: [
          {
            path: 'index',
            element: <Channel />,
            errorElement: <Error />,
            handle: handleFn({alias: '通道管理'}),
          }, {
            path: 'group',
            element: <Channels />,
            errorElement: <Error />,
            handle: handleFn({alias: '通道组管理'}),
          }, 
        ]
      },
      {
        path: 'config',
        handle: handleFn({alias: '基础配置'}),
        children: [
          {
            path: 'country',
            element: <Country />,
            errorElement: <Error />,
            loader: loaderFn({name: '国家信息配置'}),
            handle: handleFn({alias: '国家信息配置'}),
          }, {
            path: 'network',
            element: <Network />,
            errorElement: <Error />,
            loader: loaderFn({name: '网络信息配置'}),
            handle: handleFn({alias: '网络信息配置'}),
          }, {
            path: 'numberchannelsroute',
            element: <NumberChannelsRoute />,
            errorElement: <Error />,
            loader: loaderFn({name: '号码通道路由'}),
            handle: handleFn({alias: '号码通道路由'}),
          }, {
            path: 'warning',
            element: <Warning />,
            errorElement: <Error />,
            loader: loaderFn({name: '报警设置'}),
            handle: handleFn({alias: '报警设置'}),
          }, {
            path: 'numberattribution',
            element: <NumberAttribution />,
            errorElement: <Error />,
            loader: loaderFn({name: '号码归属查询'}),
            handle: handleFn({alias: '号码归属查询'}),
          }, {
            path: 'sensitiveword',
            element: <SensitiveWord />,
            errorElement: <Error />,
            loader: loaderFn({name: '敏感词管理'}),
            handle: handleFn({alias: '敏感词管理'}),
          }, {
            path: 'codelist',
            element: <CodeList />,
            errorElement: <Error />,
            loader: loaderFn({name: '状态码对照表'}),
            handle: handleFn({alias: '状态码对照表'}),
          },
        ]
      },
      {
        path: 'black',
        handle: handleFn({alias: '黑名单管理'}),
        children: [
          {
            path: 'index',
            element: <BlackList />,
            errorElement: <Error />,
            loader: loaderFn({name: '黑名单'}),
            handle: handleFn({alias: '黑名单'}),
          }
        ]
      }
    ]
  },
  {
    path: '/data',
    element: <Layout />,
    loader: loaderFn({name: '数据管理'}),
    handle: handleFn({alias: '数据', icon: 'icon-tongji1'}),
    children: [
      {
        path: 'manage',
        handle: handleFn({alias: '数据管理'}),
        children: [
          {
            path: 'index',
            element: <Test />,
            errorElement: <Error />,
            loader: loaderFn({name: '数据管理'}),
            handle: handleFn({alias: '数据管理'}),
          }
        ]
      }
    ]
  },
  {
    path: '/manage',
    element: <Layout />,
    loader: loaderFn({name: '管理中心'}),
    handle: handleFn({alias: '管理', icon: 'icon-wode'}),
    children: [
      {
        path: 'center',
        handle: handleFn({alias: '管理中心'}),
        children: [
          {
            path: 'index',
            element: <Test />,
            errorElement: <Error />,
            loader: loaderFn({name: '管理'}),
            handle: handleFn({alias: '管理中心'}),
          }
        ]
      },
    ]
  }
]

const router = createBrowserRouter([...baseRouterList, ...routerList])

export default router