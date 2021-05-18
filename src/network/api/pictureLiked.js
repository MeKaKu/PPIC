import axios from "../index";

export default {

  //获取用户是否为图片点赞了
  getIsUserLikedPicture(uid,pid){
    return axios({
      url: '/PictureLiked/IsUserLikedPicture',
      method: 'get',
      params: {
        uid,
        pid,
      }
    })
  },

  //更新点赞状态
  updatePictureLiked(uid,pid,isLiked){
    return axios({
      url: '/PictureLiked/UpdatePictureLiked',
      method: 'put',
      params: {
        uid,
        pid,
        isLiked,
      }
    })
  },

  //获取用户喜欢的图片数量
  getPictureLikedCount(uid){
    return axios({
      url: '/PictureLiked/GetPictureLikedCount',
      method: 'get',
      params: {
        uid,
      }
    })
  }
}
