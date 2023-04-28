import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'normalize.css'
import './style/flex.scss'
// import 'antd/dist/antd.css';
import routers, { RouteObj, lazyConfig } from '@/routes';

const createReplace = (path: string) => <Navigate replace to={path} />

const getElement = (route: RouteObj) => {
  if (route.replacePath) {
    return createReplace(route.replacePath)
  // } else if (typeof route.elementPath == 'string') { // 懒加载组建
  //   return lazyConfig(() => route.elementPath)
  } else {
    return route?.elementPath
  }
}

const getRoute = (routList: RouteObj[]) => (
  <>
    {
      routList.map(item => (
        <Route
          key={item.path}
          path={item.path}
          element={getElement(item)}
          handle={item.handle}
        >
          {getRoute(item?.children || [])}
        </Route>
      ))
    }
  </>
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
  <BrowserRouter>
    <Routes>
      {getRoute(routers)}
    </Routes>
  </BrowserRouter>
  </React.StrictMode>
);
