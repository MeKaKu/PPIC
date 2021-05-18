<template>
  <div class="container">
    <!--添加新的评论-->
    <div class="write-reply" @click="showCommentInput()">
      <i class="el-icon-edit" />
      <span class="add-comment" style="font-size: 1.2em">添加新评论</span>
    </div>
    <transition name="fade">
      <div v-if="commentFor === 0" class="input-wrapper">
        <el-input
            v-model="inputComment"
            type="textarea"
            class="gray-bg-input"
            autofocus
            placeholder="..."
            :rows="4"
            :maxlength="255"
        />
        <div class="btn-control">
          <span class="cancel" @click="cancel">取消</span>
          <el-button class="btn" type="primary" round @click="submitComment">确定</el-button>
        </div>
      </div>
    </transition>
    <!--显示评论列表-->
    <div v-for="item in comments" :key="item.cid" class="comment">
      <!--用户信息-->
      <div class="info" @click="goUserHomePage(item.uid)" style="cursor: pointer">
        <!--用户头像-->
        <img :src="`${pictureBaseUrl}/user/user-${item.uid}.jpg`" alt="user?" class="avatar" width="36" height="36"/>
        <div class="right">
          <!--用户名-->
          <div class="name">
            {{item.from_username}}
          </div>
          <!--评论日期-->
          <div class="date">
            {{item.date}}
          </div>
        </div>
      </div>
      <!--评论内容-->
      <div style="padding-left: 44px">
        <!--内容-->
        <div class="content">
          {{item.content}}
        </div>
        <!--点赞、回复-->
        <div class="control">
          <span class="like" :class="{active: item.liked}" @click="likeClick(item)">
            <i class="iconfont icon-like" />
            <span class="like-num">
              <i class="el-icon-caret-top" />
              {{item.like_count}}
            </span>
          </span>
          <span class="comment-reply" @click="showCommentInput(item)">
            <i class="el-icon-chat-square" />
            <span>回复</span>
          </span>
        </div>
      </div>
      <!--回复列表-->
      <div class="reply">
        <transition name="fade">
          <div v-if="commentFor === item.cid" class="input-wrapper" style="padding-left: 44px">
            <el-input v-model="inputComment" class="gray-bg-input" type="textarea" :row="3" placeholder="..." :maxlength="255"/>
            <div class="btn-control">
              <span class="cancel" @click="cancel">
                取消
              </span>
              <el-button class="btn" type="primary" round @click="submitComment(item)">
                确定
              </el-button>
            </div>
          </div>
        </transition>
        <div v-for="reply in item.replyList" :key="reply.cid" class="comment-item">
          <!--回复的内容-->
          <div class="reply-content">
            <span class="from-name" @click="goUserHomePage(reply.uid)" style="cursor: pointer">
              {{reply.from_username}}</span>
            <span>: </span>
            <span class="to-name">@{{reply.to_username}}</span>
            <span>{{reply.content}}</span>
          </div>
          <div class="reply-bottom">
            <span>{{reply.date}}</span>
            <span class="reply-text" @click="showCommentInput(item,reply)">
              <i class="el-icon-chat-square" />
              <span>回复</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: "comment",
  data(){
    return {
      inputComment: '',//当前输入的评论
      commentFor: -1,//回复的评论的id，0为添加新评论
      replyFor: null,//回复的子评论，为null代表回复的是主评论
      comments: [],//主评论列表
      pid: parseInt(this.$route.params.pid),
    }
  },
  computed: {
    ...mapGetters(['user',"pictureBaseUrl"]),
    isLogined(){
      return this.$store.getters.isLogined
    },
  },
  created() {
    //获取评论列表
    // let tmpComments = []
    // this.$api.comment.getCommentList(this.pid).then((res)=>{
    //   console.log(res)
    //   tmpComments.push(...res.data)
    //   tmpComments.forEach((comment)=>{
    //     this.$api.comment.getSubCommentList(comment.cid).then((res2)=>{
    //       console.log(res2)
    //       comment.replyList = res2.data
    //     })
    //   })
    //   this.comments.push(...tmpComments)
    // })
    this.$api.comment.getCommentList(this.user.uid,this.pid).then((res)=>{
      console.log(res)
      this.comments.push(...res.data)
    })

  },
  methods: {
    showCommentInput(item,reply){
      // if(!this.isLogined){
      //   this.$message.error('请先登录');
      //   return;
      // }
      if(!item){//添加新的评论
        this.commentFor = 0;
      }
      else {//回复评论
        this.commentFor = item.cid;
        //console.log("评论cid="+item.cid+"  commentFor="+this.commentFor)
      }
      if(reply){
        this.replyFor = reply
      }
      else{
        this.replyFor = null
      }
    },
    cancel(){
      this.commentFor = -1;
    },
    submitComment(item){
      if(this.inputComment === ''){
        this.$message('请输入评论');
        return;
      }
      if(this.commentFor === 0){//评论图片
        this.$api.comment.createComment(this.user.name,this.pid,this.inputComment,this.user.uid).then((res)=>{
          this.comments.push(res.data)
          console.log(res)
        })
      }
      else{//回复（主评论/子评论）
        console.log(item)
        let data = {
          pid: this.pid,
          date: '',
          content: this.inputComment,
          belong_cid: item.cid,
          to_cid: this.replyFor?this.replyFor.cid:this.commentFor,
          to_username: this.replyFor?this.replyFor.from_username:item.from_username,
          from_username: this.user.name,
          uid: this.user.uid,
        }
        this.$api.comment.createReply(data).then((res)=>{
          if(!item.replyList){
            item.replyList = []
          }
          item.replyList.push(res.data)
          console.log(res)
        })
      }
      this.commentFor = -1
      this.inputComment = ''
    },
    goUserHomePage(uid){
      this.$router.push(`/user/${uid}`).catch((err)=>{console.log(err)})
    },
    likeClick(item){
      item.liked = ! item.liked
      item.like_count += item.liked?1:-1
      this.$api.commentLiked.updateCommentLiked(this.user.uid,item.cid,item.liked)
    },
  }
}
</script>

<style scoped lang="less">

@import "../../assets/less/color.less";

.container {
  width: 80%;
  padding: 0 10px;
  box-sizing: border-box;

  .write-reply {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: @text-minor;
    padding: 10px;
    cursor: pointer;

    &:hover {
      color: @text-main;
    }

    .el-icon-edit {
      margin-right: 5px;
    }
  }

  .comment {
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-bottom: 1px solid @border-fourth;

    .info {
      display: flex;
      align-items: center;

      .avatar {
        border-radius: 50%;
      }

      .right {
        display: flex;
        flex-direction: column;
        margin-left: 10px;

        .name {
          font-size: 16px;
          color: @text-main;
          margin-bottom: 5px;
          font-weight: 500;
        }

        .date {
          font-size: 12px;
          color: @text-minor;
        }
      }
    }

    .content {
      font-size: 16px;
      color: @text-main;
      line-height: 20px;
      padding: 10px 0;
    }

    .control {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: @text-minor;

      .like {
        display: flex;
        align-items: center;
        margin-right: 20px;
        cursor: pointer;

        &.active,
        &:hover {
          color: @color-main;
        }

        .iconfont {
          font-size: 14px;
          margin-right: 5px;
        }
      }

      .comment-reply {
        display: flex;
        align-items: center;
        cursor: pointer;

        &:hover {
          color: @text-333;
        }

        .iconfont {
          font-size: 16px;
          margin-right: 5px;
        }
      }
    }

    .reply {
      margin: 10px 44px;
      border-left: 2px solid @border-first;

      .comment-item {
        margin: 0 10px;
        padding: 10px 0;
        border-bottom: 1px dashed @border-third;

        .reply-content {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: @text-main;

          .from-name {
            color: @color-main;
          }

          .to-name {
            color: @color-main;
            margin-left: 5px;
            margin-right: 5px;
          }
        }

        .reply-bottom {
          display: flex;
          align-items: center;
          margin-top: 6px;
          font-size: 12px;
          color: @text-minor;

          .reply-text {
            display: flex;
            align-items: center;
            margin-left: 10px;
            cursor: pointer;

            &:hover {
              color: @text-333;
            }

            .icon-comment {
              margin-right: 5px;
            }
          }
        }
      }

      .fade-enter,
      .fade-leave-to {
        opacity: 0;
      }
    }
  }

  .input-wrapper {
    padding: 10px;

    .gray-bg-input,
    .el-input__inner {
      /*background-color: #67C23A;*/
    }

    .btn-control {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-top: 10px;

      .cancel {
        font-size: 16px;
        color: @text-normal;
        margin-right: 20px;
        cursor: pointer;

        &:hover {
          color: @text-333;
        }
      }

      .confirm {
        font-size: 16px;
      }
    }
  }
}
</style>