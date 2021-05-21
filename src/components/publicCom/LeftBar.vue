<template>
  <div class="LeftBar">
    <el-menu
        ref="leftMenu"
        :collapse="isCollapse"
        :default-active="$route.path"
        class="el-menu-vertical-demo"
        @close="handleClose"
        @select="handleSelect">
      <el-menu-item disabled>
        <div class="my-icon">
          <img src="@/assets/img/icon.png" alt="" style="width: 100%;height: 100%;">
        </div>
      </el-menu-item>
      <el-menu-item
          v-for="item of navLsit"
          :key="item.name"
          :index="item.routePath"
          :disabled="item.routePath!=='/home' && disabled"
      >
        <i :class="[item.icon]" />
        <span slot="title">{{ item.name }}</span>
      </el-menu-item>
      <el-menu-item  key="关于" index="/about">
        <i class="el-icon-info" />
        <span slot="title">{{ this.$t('message.About') }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'LeftBar',
  components: {},
  data() {
    return {
      isCollapse: true,
      activeNav: '/home',
    };
  },
  computed: {
    disabled(){
      return !this.$store.getters.isLogined
    },
    navLsit() {
      return [
        {
          name: this.$t('message.Home'),
          icon: 'el-icon-s-home',
          routePath: '/home',
        },
        {
          name: '图搜',
          icon: 'el-icon-search',
          routePath: '/milvusSearch',
        },
        {
          name: this.$t('message.album'),
          icon: 'el-icon-picture',
          routePath: '/album',
        },
        {
          name: this.$t('message.Upload'),
          icon: 'el-icon-upload',
          routePath: '/share',
        },
      ];
    },
  },
  watch: {
  },
  created() {
  },
  mounted() {},
  methods: {
    handleSelect(key, keyPath) {
      if(key !== '/home' && !this.$store.getters.user.uid){
        this.$message.info("请先登录QAQ")
        return
      }
      this.$router.push({ path: key, query: {} }).catch((err)=>{console.log(err)})
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    // goBBS() {
    //   this.$router.push("/about").catch((err)=>{console.log(err)})
    //   //window.open('https://baidu.com/');
    // },
  },
};
</script>

<style scoped lang="less">
.LeftSide {
  overflow: hidden;
  height: 100%;
  width: 10%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-content: center;
  .beian {
    width: 15px;
    margin: 0 auto;
    line-height: 24px;
    font-size: 12px;
    word-wrap: break-word; /*英文的时候需要加上这句，自动换行*/
    word-break: break-all;
  }
}
</style>
