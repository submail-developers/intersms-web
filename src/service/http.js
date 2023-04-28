import axios from 'axios';
import apis from './api.js';

const apiEnv = process.env.API_ENV;
const baseURL = {
  //开发环境
  dev: 'https://owh-dev-api.mybaiqiu.com',
  // staging环境
  staging: 'https://owh2-staging.mybaiqiu.com',
  // 生产环境
  BQ: 'https://owh-pro.ibaiqiu.com',
  // uat环境
  uat: 'https://owh2-uat.mybaiqiu.com',
  // theory环境
  theory: 'http://owh2-hk-api.theory.com',
  // theory_staging环境
  theory_staging: 'https://dev-owh2-api.mybaiqiu.com',
  // jimmychoo发版环境
  jc: 'https://owh-api.jimmychoo.cn',
  // jimmychoo-staging
  jc_staging: 'https://jc-owh-api-test.mybaiqiu.com',
  // testing
  testing: 'https://owh-api-test.jimmychoo.cn',
  // 新-开发环境
  jc_dev: 'https://jc-owh-api-dev.mybaiqiu.com',
  // jc_test
  jc_test: 'https://jc-owh-api-test.mybaiqiu.com',
  // jc_dev
  jc_uat: 'https://owh-api-test.jimmychoo.cn',
};

const axiosInstance = axios.create({
  baseURL: baseURL[apiEnv],
});
class HTTP {
  constructor(apis) {
    Object.keys(apis).forEach((key) => {
      const method = apis[key].method;
      switch (method) {
        case 'get':
          this[key] = ({ params = {} } = {}) =>
            axiosInstance.get(apis[key].url(params), {
              api: apis[key],
              app: this.app,
            });
          break;

        case 'post':
          this[key] = ({ params = {}, data = {} } = {}) =>
            axiosInstance.post(apis[key].url(params), data, {
              api: apis[key],
              app: this.app,
            });
          break;

        case 'put':
          this[key] = ({ params = {}, data = {} } = {}) =>
            axiosInstance.put(apis[key].url(params), data, {
              api: apis[key],
              app: this.app,
            });
          break;

        case 'delete':
          this[key] = ({ params = {} } = {}) =>
            axiosInstance.delete(apis[key].url(params), {
              api: apis[key],
              app: this.app,
            });
          break;
      }
    });
  }

  install(Vue) {
    Vue.prototype.$http = this;
  }
}

const http = new HTTP(apis);

export { axiosInstance };

export default http;
