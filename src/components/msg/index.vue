<template>
  <div id="msg">
    <el-tabs tab-position="top" style="height: 150px;" @tab-click="handleClick" v-model="activeName">

        <el-tab-pane name="commentMsg">
          <span slot="label">
            <p>
            <el-badge :value="commentMsgCount" type="primary" :hidden="commentMsgCount<=0">
              评 论
            </el-badge></p>
          </span>
          <msg-comment @descCount="descComment" :count="commentMsgCount"/>
        </el-tab-pane>

      <el-tab-pane name="replyMsg">
          <span slot="label">
            <el-badge :value="replyMsgCount" type="primary" :hidden="replyMsgCount<=0">
              回 复
            </el-badge>
          </span>
        <msg-reply @descCount="descReply" :count="replyMsgCount"/>
      </el-tab-pane>

      <el-tab-pane name="likeMsg">
          <span slot="label">
            <el-badge :value="likeMsgCount" type="primary" :hidden="likeMsgCount<=0">
              点 赞
            </el-badge>
          </span>
        <msg-like @descCount="descLike" :count="likeMsgCount"/>
      </el-tab-pane>

<!--      <el-tab-pane name="myMsg">-->
<!--          <span slot="label">-->
<!--            <el-badge :value="0" type="primary">-->
<!--              私 信-->
<!--            </el-badge>-->
<!--          </span>-->
<!--        私 信-->
<!--      </el-tab-pane>-->

    </el-tabs>
  </div>
</template>

<script>
import msgComment from "@/components/msg/msgComment";
import msgReply from "@/components/msg/msgReply";
import msgLike from "@/components/msg/msgLike";
import {mapGetters} from 'vuex'
export default {
  name: "index",
  components: {
    msgComment,
    msgReply,
    msgLike,
  },
  data(){
    return {
      commentMsgCount: 0,
      replyMsgCount: 0,
      likeMsgCount: 0,
      activeName: 'commentMsg',
    }
  },
  computed: {
    ...mapGetters(['user']),
  },
  created() {
    this.$api.msg.getCommentMsgCount(this.user.uid).then((res)=>{
      this.commentMsgCount = res.data
    })
    this.$api.msg.getReplyMsgCount(this.user.name).then((res)=>{
      this.replyMsgCount = res.data
    })
    this.$api.msg.getLikeMsgCount(this.user.uid).then((res)=>{
      this.likeMsgCount = res.data
    })
  },
  methods: {
    handleClick(tab,event){
      console.log(tab,event,this.activeName);
    },
    descComment(desc){
      if(this.commentMsgCount > 0){
        this.commentMsgCount -= desc
      }
    },
    descReply(desc){
      if(this.replyMsgCount > 0){
        this.replyMsgCount -= desc
      }
    },
    descLike(desc){
      //console.log('descLikeMsgCount')
      if(this.likeMsgCount > 0) {
        this.likeMsgCount -= desc
      }
    },
  }
}
</script>

<style scoped lang="less">

#msg{
  width: 80%;
  margin: 10px auto;
}

</style>