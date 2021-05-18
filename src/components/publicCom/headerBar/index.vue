<template>
  <div id="HeaderBar">
    <el-row
        align="middle"
        justify="space-around"
        style="width:100%;"
        type="flex"
    >
      <!-- 网站图标 -->
      <el-col>
        <a href="/">
          <img
              alt
              src="@/assets/img/ppic.png" style="width: 64px;height: 64px">
        </a>
      </el-col>
      <!-- 搜索框 -->
      <el-col>
        <search />
      </el-col>
      <!-- 登录注册/用户信息 -->
      <el-col>
        <login />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import search from '@/components/publicCom/headerBar/search';
import login from '@/components/publicCom/headerBar/login/index';

export default {
  name: 'HeaderBar',
  components: {
    search,
    login,
  },

}

</script>

<style scoped lang="less">
#HeaderBar {
  background-color: #fff;
  height: 100%;
  width: 100%;
  display: flex;
  overflow: hidden;
}

.user-tools {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  margin-bottom: 20px;

  .tool {
    height: 2rem;
    width: 2rem;
    border-radius: 2px;
    border: 1px solid #dcdfe6;
    text-align: center;
  }
}


</style>
