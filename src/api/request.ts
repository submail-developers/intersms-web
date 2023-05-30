import axios from 'axios'
import { message } from '@/components/antd/staticFn/staticFn'
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
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!config.url?.includes('/pet')) {
      config.url = '/apis/' + config.url
    }
    // config.headers['Cooik'] = '123'
    return config
  },
  (error) => {
    message.destroy()
    message.error(error.message)
    return Promise.reject(error)
  },
)
// 后置拦截
request.interceptors.response.use(
  (res: AxiosResponse) => {
    // message.destroy()
    if ([200, 201].includes(res.status) && res.data.status === 'success') {
      return res.data
    } else {
      message.destroy()
      message.error(res.data.message)
      return Promise.reject(res.data)
    }
  },
  (error) => {
    message.destroy()
    message.error(error.message)
    return Promise.reject(error)
  },
)

export default request
