import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import mutations from "@/store/mutations";
import actions from "@/store/actions";
import modules from "@/store/modules";
import getters from "@/store/getters";

const state = {
  user:  JSON.parse(localStorage.getItem('user')) || {}, //用户
  loginBoolean: false, //是否进行登录
  loginOrSign: true, //登录（1）还是注册（0）
  isLogined: !!localStorage.getItem('user'), //是否已经登录
  //serverAddress: 'http://localhost:8878', //服务器地址
  serverAddress: 'http://180.76.167.81:8878',//后端服务器地址
  pictureBaseUrl: 'https://ppic-1301960877.cos.ap-chengdu.myqcloud.com',//对象存储服务器地址
  isDelete: false,
  //likeStatus: null, //点赞状态
  //detail: null,//查看的图片详细信息
  //collectBoolean: false,
  //collectInfo: {},
  //phoneBoolean: false,
};

const store = new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
  modules
})

export default store