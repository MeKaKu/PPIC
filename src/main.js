import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VuePageStack from 'vue-page-stack';
import router from './router'
import i18n from "@/vuei18n/i18n";
import store from "./store";
import '@/assets/less/reset.less';
import '@/assets/less/public.less';
import '@/assets/icon/iconfont.css';
import api from './network/api';
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VuePageStack,{router, keyName: 'PPIC'})
Vue.prototype.$api = api
router.beforeEach((to,from,next)=>{
  //console.log(from.path.split('/'))
  if(from.path.split('/')[1]==='albumDetail'){
    //console.log(from)
    //console.log(to)
    store.commit('setIsDelete',false)
  }
  next()
})
new Vue({
  router,
  i18n,
  store,
  render: h => h(App),
}).$mount('#app')
