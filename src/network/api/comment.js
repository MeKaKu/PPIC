import axios from '../index'

export default {

  //获取主评论列表
  getMainCommentList(pid){
    return axios({
      url: '/Comment/GetMainCommentList',
      method: 'get',
      params: {
        pid,
      }
    })
  },

  //获取子评论列表
  getSubCommentList(cid){
    return axios({
      url: '/Comment/GetSubCommentList',
      method: 'get',
      params: {
        cid,
      }
    })
  },

  //获取评论列表
  getCommentList(uid,pid){
    return axios({
      url: '/Comment/GetCommentList',
      method: 'get',
      params: {
        uid,
        pid,
      }
    })
  },

  //添加评论
  createComment(from_username,pid,content,uid){
    return axios({
      url: '/Comment/CreateComment',
      method: 'post',
      params: {
        from_username,
        pid,
        content,
        uid,
      }
    })
  },

  //添加回复
  createReply(comment){
    return axios({
      url: '/Comment/CreateReply',
      method: 'post',
      data: comment,
    })
  }



}