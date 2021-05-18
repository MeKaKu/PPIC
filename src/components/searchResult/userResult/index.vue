<template>
  <div id="userResult" class="infinite-list-wrapper" style="overflow:auto">
    <div class="container"
        :v-infinite-scroll="load"
        :infinite-scroll-disabled="disabled">
<!--      <div v-for="(item,ind) in items" :key="ind" class="cell-contianer">-->
<!--        <slot name="cell" :data="item" />-->
<!--      </div>-->
      <user-bar v-for="(userInfo,ind) in userInfos" :user-info="userInfo" :key="ind" />
    </div>
    <pre v-if="loading">加载中...</pre>
    <pre v-if="noMore">Oops...没有更多了</pre>
  </div>
</template>

<script>
import UserBar from "@/components/publicCom/UserBar";
export default {
  name: "userResult",
  components: {
    UserBar,
  },
  data(){
    return {
      userInfos: [],
      loading: false,
      noMore: false,
      keyword: this.$route.query.keyword,
      startIndex: 0,
      size: 10,
    }
  },
  computed: {
    disabled(){
      return this.loading || this.noMore
    }
  },
  created() {
    //console.log("搜索用户界面" + this.keyword)
    this.load()
  },
  methods: {
    load(){
      this.loading = true;
      let tmp = []
      this.$api.user.getUserByKeyword(this.keyword,this.startIndex,this.size).then((res)=>{
        console.log("搜索用户：keyword="+this.keyword)
        console.log(res)
        tmp = res.data
        this.userInfos.push(...tmp)
        this.startIndex += tmp.length
        if(tmp.length < this.size){
          this.noMore = true
        }
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="less">
.infinite-list-wrapper{
  pre{
    text-align: center;
    margin-top: 20px;
    font-size: 1.2em;
  }
  .container{
    width: 80%;
    margin: auto;
  }
}
</style>