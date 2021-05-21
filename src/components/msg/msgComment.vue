<template>
  <div id="msgComment">
    <div v-if="total===0" class="no-msg-tip"><pre>Oops...没有内容...</pre></div>
    <el-button v-if="count>0" type="primary" plain @click="updateAll">全部已读</el-button>
    <msg-item v-for="(item,ind) in items" :item="item" :key="ind" @solveRead="solveRead"></msg-item>
    <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page.sync="pageIndex"
        @current-change="getItemList"
        :hide-on-single-page="true"
        :page-size="pageSize">
    </el-pagination>
  </div>
</template>

<script>
import msgItem from "@/components/msg/msgItem";
import {mapGetters} from 'vuex';
export default {
  name: "msgComment",
  components:{
    msgItem,
  },
  props: {
    count: {
      type: Number,
      required: true,
    }
  },
  data(){
    return {
      items: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  created() {
    //console.log('msgList created...')
    this.$api.msg.getAllCommentMsgCount(this.user.uid).then((res)=>{
      this.total = res.data
    })
    this.getItemList()
  },
  methods: {
    getItemList(){
      let startIndex = (this.pageIndex-1)*this.pageSize
      let tmp = []
      //this.items.push({uid:4,name:'likedy',content:'eeeee2021',date:'2021-1-1',is_read: 0})
      this.$api.msg.getMsgList(this.user.uid,this.user.name,startIndex,this.pageSize,0).then((res)=>{
        //console.log('请求消息:',res)
        tmp = res.data
        tmp.forEach((item)=>{
          item.content = ' 评论了你：' + item.content
          item.path = '/detail/' + item.pid
        })
        this.items = tmp
      })
    },
    solveRead(item) {
      this.$api.msg.updateCommentOrReplyMsg(item.cid).then((res)=>{
        console.log('ck评论消息',res)
        //this.count -= 1
        this.$emit('descCount',1)
        this.$store.commit('descMsgCount')
      })
    },
    updateAll(){
      this.$api.msg.updateMsg(this.user.uid,this.user.name,0).then(()=>{
        this.$store.commit('descMsgCount',this.count)
        this.$emit('descCount',this.count)
        //this.count = 0
        this.items.forEach((item)=>{
          item.is_read = 1
        })
      })
    },
  }
}
</script>

<style scoped lang="less">
#msgComment{
  width: 90%;
  .no-msg-tip{
    font-size: 1.5em;
    text-align: center;
    margin: 30px auto;
  }
  .el-pagination{
    margin: 30px auto;
    display: flex;
    justify-content: center;
  }
}
</style>