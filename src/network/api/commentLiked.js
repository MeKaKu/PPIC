import axios from '../index'

export default {

  //更新点赞状态
  updateCommentLiked(uid,cid,isLiked){
    return axios({
      url: '/CommentLiked/UpdateCommentLiked',
      method: 'put',
      params: {
        uid,
        cid,
        isLiked,
      }
    })
  }

}