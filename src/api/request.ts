import axios from 'axios'
import type {
  InternalAxiosRequestConfig,
  AxiosInstance,
  AxiosResponse,
} from 'axios'

const request: AxiosInstance = axios.create({
  timeout: 60 * 1000,
  // baseURL: 'http://zjhtest.submail.intersms.com/'
})
// 前置拦截
request.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!config.url?.includes('/pet')) {
    config.url = '/apis' + config.url
  }
  // config.headers['Cooik'] = '123'
  return config
})
// 后置拦截
request.interceptors.response.use((res: AxiosResponse) => {
  if ([200, 201].includes(res.status)) {
    return res.data
  } else {
    return Promise.reject(res.data)
  }
})

export default request
