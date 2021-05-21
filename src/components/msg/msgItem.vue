<template>
  <div id="msgItem">
    <div class="user-info" @click="goUserHomePage(item.uid)">
      <pre><em>{{ item.from_username }}</em></pre>
    </div>
    <div class="msg-content" @click="goDetail(item.path)">
      {{item.content}}
    </div>
    <div class="msg-date">
      {{item.date}}
    </div>
<!--    <div class="msg-action">-->
<!--      <i class="el-icon-delete"></i>-->
<!--    </div>-->
    <div v-if="item.is_read===0" class="msg-read">
      <i class="el-icon-warning"></i>
    </div>
    <el-divider />
  </div>
</template>

<script>
export default {
  name: "msgItem",
  props:{
    width: {
      type: Number,
      default: 100,
    },
    item: {
      type: Object,
      required: true,
    },
  },
  data(){
    return {

    }
  },
  methods: {
    goUserHomePage(uid){
      if(this.$store.getters.isLogined === false){
        this.$message.info("请先登录QWQ")
      }
      this.solveRead()
      const routeUrl = this.$router.resolve(`/user/${uid}`);
      window.open(routeUrl.href, '_blank');
      //this.$router.push(`/user/${uid}`).catch((err)=>{console.log(err)})
    },
    goDetail(path){
      if(this.$store.getters.isLogined === false){
        this.$message.info("请先登录QWQ")
      }
      this.solveRead()
      const routeUrl = this.$router.resolve(path);
      window.open(routeUrl.href, '_blank');
      //this.$router.push(path).catch((err)=>{console.log(err)})
    },
    solveRead(){
      if(this.item.is_read === 0){
        this.item.is_read = 1
        this.$emit('solveRead',this.item)
      }
    }
  }
}
</script>

<style scoped lang="less">
#msgItem{
  position: relative;
  height: 80px;
  width: 100%;
  .user-info{
    position: absolute;
    top: 15px;
    left: 5px;
    //width: 10%;
    height: 30%;
    cursor: pointer;
    pre{
      position: absolute;
      top: 5px;
      left: 5px;
      margin: auto;
      font-size: 1.2em;
      color: #3a8ee6;
    }
  }
  .msg-content{
    position: absolute;
    width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 30%;
    left: 10px;
    bottom: 5px;
    font-size: 1em;
    cursor: pointer;
  }
  .msg-read{
    position: absolute;
    height: 20%;
    top: 15px;
    right: 15px;
    text-align: center;
    color: #409EFF;
  }
  .msg-date{
    position: absolute;
    height: 20%;
    width: 40%;
    text-align: right;
    bottom: 5px;
    right: 5px;
    color: #909399;
    font-size: 0.8em;
  }

  .el-divider{
    position: absolute;
    bottom: 0;
    margin: auto;
  }
}
</style>