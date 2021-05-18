import axios from 'axios';
//import * as cookie from "core-js";
import cookie from 'js-cookie';
//import i18n from '@/vuei18n/i18n';
// 创建axios实例
const instance = axios.create({
  //baseURL: 'https://ppicture.xyz',//web服务器地址
  //baseURL: 'http://localhost:8878',//localhost
  baseURL: 'http://180.76.167.81:8878',//后端服务器地址（百度云）
  timeout: 20000,//20s
  validateStatus(status) {
    return status >= 200 && status < 600;
  },
});

//请求拦截器
instance.interceptors.request.use((config) => {
    //console.log('???',localStorage.getItem('user'));
    //console.log('config',config)
    //cookie.remove('jwt')
    if (cookie.get('jwt')) { //存在token
      //console.log(cookie.get('jwt'))
      config.headers.token = cookie.get('jwt'); //请求头写入token
    }
    else{
      localStorage.removeItem('user')
    }
    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  },
);
//响应拦截器
instance.interceptors.response.use((response) => {
    //console.log('response', response);
    if (response.data.token) {//接收到了token
      //console.log("token：",response.data.token)
      cookie.set('jwt', response.data.token, {expires: 14, });//14天后过期
    }
    if (response.status === 403 || response.status === 401) { //token 过期 或 无权访问
      if(cookie.get('jwt')){
        cookie.remove('jwt');
        localStorage.removeItem('user');
        alert("请重新登录");
      }
      // 登录过期
      cookie.remove('jwt');
      localStorage.removeItem('user');
      //const message = i18n.tc('filter.loginError');
      //alert("请重新登录");
      setTimeout(() => { window.location.href = '/'; }, 500);
    }
    return response;
  },
  (error) => {
    console.log(`err${error}`);
    return Promise.reject(error);
  },
);

export default instance;
