import axios from '../index';


export default {
  //登录
  login: (data) => {
    return axios({
      url: `/User/Login`,
      method: 'post',
      params: {
        name: data.username,
        pwd: data.password,
      }
    });
  },
  //注册
  register: (data) => {
    return axios({
      url: '/User/Register',
      method: 'post',
      params: data,
    });
  },
  //检查用户名是否已经被注册惹,userName
  checkUser: (name) => {
    return axios({
      url: '/User/CheckUser',
      method: 'get',
      params: {
        name,
      }
    })
  },
  //手机号验证，phone
  checkPhone: (phone) => {
    return axios({
      url: '/User/CheckPhone',
      method: 'post',
      params: {
        phone,
      }
    })
  },

  //验证码验证
  verificationCode: () => {

  },

  //根据用户名，获取用户信息
  getUserInfoByName(name){
    return axios({
      url: '/User/GetUserInfoByName',
      method: 'get',
      params: {
        name,
      }
    })
  },

  //根据用户uid获取用户
  getUserByUid(uid){
    return axios({
      url: '/User/GetUserByUid',
      method: 'get',
      params: {
        uid,
      }
    })
  },

  //自定义修改用户信息（头像，性别，简介）
  updateUserInfo(uid,sex,tip){
    return axios({
      url: '/User/UpdateUserInfo',
      method: 'post',
      params: {
        uid,
        sex,
        tip,
      }
    })
  },

  //根据用户名模糊匹配
  getUserByKeyword(keyword,startIndex,number){
    return axios({
      url: '/User/GetUserByKeyword',
      method: 'get',
      params: {
        keyword,
        startIndex,
        number,
      }
    })
  },

  //获取注册验证码
  getRegisterCheckCode(phone){
    return axios({
      url: '/User/GetRegisterCheckCode',
      method: 'get',
      params: {
        phone,
      }
    })
  },

  //获取修改密码的验证码
  getChangePwdCheckCode(phone){
    return axios({
      url: '/User/GetChangePwdCheckCode',
      method: 'get',
      params: {
        phone,
      }
    })
  },

  //根据手机号修改密码
  changePwdByPhone(phone){
    return axios({
      url: '/User/ChangePwdByPhone',
      method: 'post',
      params: {
        phone,
      }
    })
  }

}