import axios from 'axios';
import router from './route/router.js';
import store from '../store/index';
import { axiosInstance } from './api/http.js';
import { MessageBox } from 'element-ui';
import { Loading } from '@/plugins/loading/loading.js';
import { getQuery, sign } from 'tools';

// 进行中的请求列表
let pendingReq = [];

/**----------------------路由拦截器---------------------- */
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = 'OWH-' + to.meta.title;
  }
  const defaultPerm = ['shop', 'home', 'platform', 'accountSet'];
  const levelThreeRouters = [
    'paramsset',
    'trackingcodevalue',
    'trackingcode',
    'trackingevent',
    'conversionrecord',
    'accessrecord',
    'shopparamsconfig',
    'shopdetails',
    'staffdetails',
    'bookingservice',
    'invoiceparams',
    'invoiceindex',
  ];
  const token = localStorage.getItem('token');
  switch (to.name) {
    case 'shopmanage':
      next({ name: 'shopparamsconfig' });
      break;
    case 'trackmanage':
      next({ name: 'paramset' });
      break;
    case 'invoicemanage':
      next({ name: 'invoiceindex' });
      break;
    default:
      next();
      break;
  }
  // if (to.name === 'shopmanage') {
  //   // 直接指向shopmanage会报错
  //   next({ name: 'shopparamsconfig' });
  // }
  // if (to.name === 'trackmanage') {
  //   // 直接指向trackmanage会报错
  //   next({ name: 'paramset' });
  // }
  // if (to.name === 'invoicemanage') {
  //   // 直接指向shopmanage会报错
  //   next({ name: 'invoicedetail' });
  // }
  // if (to.name === 'systemlog') {
  //   // 带查询参数直接跳转---系统日志详情页---缓存路径参数
  //   const queryParameter = getUrlQuery();
  //   if (Object.values(queryParameter).length > 0) {
  //     //  获取平台名字和对应的id
  //     const { website_name, id } = queryParameter;
  //     //  缓存选择的平台
  //     window.localStorage.setItem(
  //       'plat',
  //       JSON.stringify({ website_name, id: parseInt(id) })
  //     );
  //     window.sessionStorage.setItem(
  //       'queryParameter',
  //       JSON.stringify(queryParameter)
  //     );

  //     window.sessionStorage.setItem('directRouteName', to.name);
  //   }
  // }
  if (to.meta.Authorization) {
    if (token) {
      let permissionRoutes = store.getters.filterRoute || [];
      // 防止每次路由跳转都dispatch
      if (permissionRoutes && permissionRoutes.length === 0) {
        store
          .dispatch('getRoute', { type: 2, page_size: 999 })
          .then((permRoute) => {
            const userAllRoutes = defaultPerm.concat(permRoute);
            if (
              userAllRoutes.includes(to.name) ||
              levelThreeRouters.includes(to.name) ||
              to.name === 'login'
            ) {
              next();
            } else {
              // 无权限--跳转404
              next({ name: '404' });
            }
          });
      }
      next();
    } else {
      // 未登录--直接跳转登录页
      if (to.name === 'login') {
        next();
      } else if (to.name === 'systemlog') {
        next({ path: '/login', query: { redirect: to.fullPath } });
      } else {
        next({ name: 'login' });
      }
    }
  } else {
    next();
  }
});

/**----------------------请求拦截器---------------------- */

const CancelToken = axios.CancelToken;
// 请求拦截
axiosInstance.interceptors.request.use((config) => {
  config.rejectUnauthorized = false;
  // 获取参数签名
  const query = getQuery(config.url);
  if (Object.keys(query).length) {
    config.url += `&request_sign=${sign(query)}`;
  }

  // 打开loading
  if (config.api.showLoading) {
    config.loading = Loading();
    config.loading.showLoading();
  }

  let cancelReq = null;
  config.cancelToken = new CancelToken((c) => {
    cancelReq = c;
  });
  // 存储进进行列表
  pendingReq.push({
    cancelReq,
    config,
  });

  // 需要携带token的接口
  if (config.api.Authorization) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    } else {
      // 未获取到token，取消请求
      cancelReq({ msg: '未获取token', config });
      pendingReq.splice(
        pendingReq.findIndex((item) => item.config.url === config.url),
        1
      );
    }
  }

  // 设置Content-Type
  if (config.api.contentType) {
    if (config.api.contentType === 'multipart/form-data') {
      console.log("contentType:'multipart/form-data'",config.data);
    } else {
      config.data = true;
    }
    config.headers['Content-Type'] = config.api.contentType;
  }

  // blob流转文件
  if (config.api.responseType) {
    config.responseType = config.api.responseType;
  }
  return config;
});

// 响应拦截
axiosInstance.interceptors.response.use(
  (res) => {
    // 请求成功处理

    // 将进行列表中对应请求删除
    pendingReq.splice(
      pendingReq.findIndex((item) => item.config.url === res.config.url),
      1
    );
    // 关闭loading
    if (res.config.loading) {
      res.config.loading.closeLoading();
    }

    let result;
    const data = res.data;

    // 下载文件
    if (res.config.responseType) {
      return res.data;
    }

    switch (data.code) {
      case 0:
        result = data.data;
        break;
      case 200008:
        // 账户被禁用
        result = Promise.reject(data);
        localStorage.clear();
        router.replace({
          name: 'login',
        });
        break;
      case 100030:
        // token失效
        localStorage.clear();
        if (router.currentRoute.name !== 'login') {
          MessageBox({
            message: '登录已过期，请重新登陆',
            title: '',
            confirmButtonText: '重新登录',
            center: true,
          })
            .then(() => {
              MessageBox.close(); //弹窗关闭

              router.replace({
                name: 'login',
              });
            })
            .catch(() => {
              //  MessageBox.close()
            });
        } else {
          MessageBox.close(); //弹窗关闭
        }

        result = Promise.reject(data);
        break;

      default:
        result = Promise.reject(data);
    }

    return result;
  },
  (err) => {
    // console.log('axios请求错误:', err)
    // 请求失败处理
    const { response, message } = err;
    const config = message.config || response.config;

    // 将进行列表中对应请求删除
    pendingReq.splice(
      pendingReq.findIndex((item) => item.config.url === config.url),
      1
    );

    // 关闭loading
    if (config.loading) {
      config.loading.closeLoading();
    }
    console.error('请求异常:', { response, message });
    return Promise.reject({ response, message });
  }
);
