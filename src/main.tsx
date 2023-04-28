import ReactDOM from 'react-dom/client';
import App from './App'
// 重置默认样式
import 'normalize.css'
// 全局样式
import './style/index.scss'
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <BrowserRouter>
    <App />
  // </BrowserRouter>
);
