import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    component: () => import('@/components/pictureStream/PictureStream'),
  },
  {
    path: '/forum',
    component: () => import('@/components/forum'),
  },
  {
    path: '/album',
    component: () => import('@/components/album'),
  },
  {
    path: '/share',
    component: () => import('@/components/share'),
  },
  {
    path: '/detail/:pid',
    component: () => import('@/components/pictureDetail/index')
  },
  {
    path: '/user/:uid',
    component: () => import('@/components/userHome/index')
  },
  {
    path: '/albumDetail/:aid',
    component: () => import('@/components/albumDetail')
  },
  {
    path: '/searchResult/user',
    component: () => import('@/components/searchResult/userResult')
  },
  {
    path: '/searchResult/album',
    component: () => import('@/components/searchResult/albumResult')
  },
  {
    path: '/searchResult/picture',
    component: () => import('@/components/searchResult/pictureResult')
  },
  {
    path: '/about',
    component: () => import('@/components/about')
  }
]

const router = new VueRouter({
  routes,
  base: '/',
  mode: 'history'
})

export default router