<template>
  <div id="app">
    <el-container class="page-container" style="overflow: hidden;">
      <!-- 左边栏开始 -->
      <el-aside style="background-color: rgb(238, 241, 246)" width="65px">
        <left-bar />
      </el-aside>
      <!-- 左边栏结束 -->
      <el-container style="overflow: hidden;">
        <!-- 标题栏开始 -->
        <el-header>
          <header-bar />
        </el-header>
        <!-- 标题栏结束 -->
        <!-- 主要页面开始 -->
        <el-main class="window-view">
<!--          <vue-page-stack>-->
            <router-view :key="key" style="max-height: calc(~'100vh - 60px');"
            />
<!--          </vue-page-stack>-->
        </el-main>
        <!-- 主要页面结束 -->
      </el-container>
    </el-container>
  </div>
</template>

<script>
import LeftBar from "./components/publicCom/LeftBar";
import HeaderBar from "./components/publicCom/headerBar";
import cookie from 'js-cookie'

export default {
  name: 'App',
  components: {
    LeftBar,
    HeaderBar,
  },
  computed: {
    key() {
      return this.$route.fullPath;
    }
  },
  created() {
    if(!cookie.get('jwt')){
      localStorage.removeItem('user')
    }
  }
}
</script>

<style lang="less">

#app {
  .page-container {
    /deep/ .el-main {
      padding: 0;
    }
  }
}
.window-view {
  height: calc(~"100vh - 60px");
  width: calc(~"100vw - 65px");
  overflow: auto;
  background: #fff;
}
</style>
