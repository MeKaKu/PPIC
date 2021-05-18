<template>
  <div id="search">
    <el-input placeholder="搜索" v-model="keyword" class="input-with-select"
              @keyup.enter.native="goSearchResult" :maxlength="10">
      <el-select v-model="select" slot="prepend" placeholder="选择">
        <el-option label="图片" value="picture"></el-option>
        <el-option label="相册" value="album"></el-option>
        <el-option label="用户" value="user"></el-option>
      </el-select>
      <el-button slot="append" icon="el-icon-search" @click="goSearchResult"></el-button>
    </el-input>
  </div>
</template>
<script>
export default {
  name: "search",
  data() {
    return {
      select: 'picture', //搜索的种类type
      keyword: '', //关键字
    }
  },
  methods: {
    goSearchResult(){
      if (!this.keyword.trim()) {
        return;
      }
      this.$router.push({
        path: '/searchResult/'+this.select,
        query: {
          keyword: this.keyword,
        },
      }).catch((err)=>{console.log(err)});
    }
  }
}
</script>

<style scoped lang="less">
#search {
  .el-input {
    .el-select {
      width: 80px;
      //background-color: #fff;
    }
  }

}

</style>