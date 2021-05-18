<template>
  <div id="UserBar" @click="goUserHomePage">
<!--    <img :src="`${pictureBaseUrl}/user/${userInfo.url}`" alt="user?">-->
    <el-avatar :src="`${pictureBaseUrl}/user/${userInfo.url}`" :size="50" />
    <div class="user-name">{{userInfo.name}}</div>
    <div class="user-tip">{{userInfo.tip}}</div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  name: "UserBar",
  props: {
    userInfo: {
      type: Object,
      require: true,
    },
  },
  data(){
    return {

    }
  },
  computed: {
    ...mapGetters(['pictureBaseUrl'])
  },
  methods: {
    goUserHomePage(){
      if(this.$store.getters.isLogined === false){
        this.$message.info("请先登录QWQ")
      }
      this.$router.push(`/user/${this.userInfo.uid}`).catch((err)=>{console.log(err)})
    }
  }
}
</script>

<style scoped lang="less">
#UserBar{
  width: 90%;
  height: 70px;
  border: 1px solid #cccccc;
  border-radius: 5px;
  margin-top: 10px;
  position: relative;
  &:hover{
    background-color: #eeeeee;
  }
  .el-avatar {
    position: absolute;
    top: 10px;
    left: 10px;
  }
  .user-name{
    position: absolute;
    top: 10px;
    left: 70px;
    font-size: 1.5em;
  }
  .user-tip{
    position: absolute;
    bottom: 12px;
    left: 75px;
    width: 100%;
    font-size: 0.8em;
  }
}
</style>