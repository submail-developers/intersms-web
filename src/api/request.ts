import axios from 'axios'
import { message } from '@/components/antd/staticFn/staticFn'
import type {
  InternalAxiosRequestConfig,
  AxiosInstance,
  AxiosResponse,
} from 'axios'

const request: AxiosInstance = axios.create({
  timeout: 60 * 1000,
  baseURL: import.meta.env.VITE_API_URL as string,
})
// 前置拦截
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
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
    if ([200, 201].includes(res.status) && res.data.status === 'success') {
      return res.data
    } else {
      message.destroy()
      message.error({
        content: res.data.message,
        onClose: () => {
          if (res.data.message == '登录超时') {
            window.location.hash = '/login'
          }
        },
      })
      return Promise.reject(res.data)
    }
  },
  (error) => {
    message.destroy()
    message.error({
      content: error.message,
      onClose: () => {
        if (error.message == '登录超时') {
          window.location.hash = '/login'
        }
      },
    })
    return Promise.reject(error)
  },
)

export default request
