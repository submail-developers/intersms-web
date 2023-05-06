import ReactDOM from 'react-dom/client';
import App from './App'
// 重置默认样式
import 'normalize.css'
// 全局样式
import './style/index.scss'
// antd
import token from '@/style/antdToken'

// 设置默认风格样式及antd使用中文格式
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import 'dayjs/locale/zh-cn';
// 处理日期组件的中英文问题
import dayjs from 'dayjs';
dayjs.locale('zh-cn')

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ConfigProvider
    theme={{
      token: token
    }}
    locale={zhCN}
  >
    <App />
  </ConfigProvider>
);
