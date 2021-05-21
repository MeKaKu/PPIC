import axios from "../index";

export default {

  //获取未读消息总数
  getMsgCount(uid,name){
    return axios({
      url: '/Msg/GetMsgCount',
      method: 'get',
      params: {
        uid,
        name,
      }
    })
  },

  //获取未读评论信息数
  getCommentMsgCount(uid){
    return axios({
      url: '/Msg/GetCommentMsgCount',
      method: 'get',
      params: {
        uid,
      }
    })
  },

  //获取未读回复消息数
  getReplyMsgCount(name){
    return axios({
      url: '/Msg/GetReplyMsgCount',
      method: 'get',
      params: {
        name,
      }
    })
  },

  //获取未读点赞消息数
  getLikeMsgCount(uid){
    return axios({
      url: '/Msg/GetLikedMsgCount',
      method: 'get',
      params: {
        uid,
      }
    })
  },

  //获取评论消息数
  getAllCommentMsgCount(uid){
    return axios({
      url: '/Msg/GetAllCommentMsgCount',
      method: 'get',
      params: {
        uid,
      }
    })
  },

  //获取回复消息数
  getAllReplyMsgCount(name){
    return axios({
      url: '/Msg/GetAllReplyMsgCount',
      method: 'get',
      params: {
        name,
      }
    })
  },

  //获取点赞消息数
  getAllLikeMsgCount(uid){
    return axios({
      url: '/Msg/GetAllLikeMsgCount',
      method: 'get',
      params: {
        uid,
      }
    })
  },

  //获取消息列表
  getMsgList(uid,name,startIndex,number,type){
    return axios({
      url: '/Msg/GetMsgList',
      method: 'get',
      params: {
        uid,
        name,
        startIndex,
        number,
        type,
      }
    })
  },

  //更新评论或者回复消息
  updateCommentOrReplyMsg(cid){
    return axios({
      url: '/Msg/UpdateCommentOrReplyMsg',
      method: 'put',
      params: {
        cid,
      }
    })
  },

  //更新点赞消息
  updateLikeMsg(uid,pid){
    return axios({
      url: '/Msg/UpdateLikeMsg',
      method: 'put',
      params: {
        uid,
        pid,
      }
    })
  },

  //更新消息状态
  updateMsg(uid,name,type){
    return axios({
      url: '/Msg/UpdateMsg',
      method: 'put',
      params: {
        uid,
        name,
        type,
      }
    })
  }

}