import axios from "../index";

export default {

  //获取number张图片
  getPictureStream: (startIndex,orderBy,number) => {
    return axios({
      url: '/Picture/PictureStream',
      method: 'get',
      params: {
        startIndex,
        orderBy,
        number,
      },
    })
  },

  //获取指定图片pid的详细信息
  getPictureDetail(pid,addViewFlag = false){
    return axios({
      url: '/Picture/PictureDetail',
      method: 'get',
      params: {
        pid: pid,
        addViewFlag,
      }
    })
  },

  //取消点赞
  cancelLiked(uid,pid){
    return axios({
      url: '/Picture/cancelLiked',
      method: 'put',
      params: {
        uid,
        pid,
      }
    })
  },

  //获取用户喜欢的图片
  getPictureLikedByUser(uid,startIndex,number){
    return axios({
      url: '/Picture/GetPictureLikedByUser',
      method: 'get',
      params: {
        uid,
        startIndex,
        number,
      }
    })
  },

  //获取指定相册内的图片
  getPictureListByAid(aid,startIndex,number){
    return axios({
      url: '/Picture/GetPictureListByAid',
      method: 'get',
      params: {
        aid,
        startIndex,
        number,
      }
    })
  },

  //获取指定用户上传的图片
  getPictureListByUid(uid,startIndex,number){
    return axios({
      url: '/Picture/GetPictureListByUid',
      method: 'get',
      params: {
        uid,
        startIndex,
        number,
      }
    })
  },

  //获取指定用户上传的图片数
  getPictureCountByUid(uid){
    return axios({
      url: '/Picture/GetPictureCountByUid',
      method: 'get',
      params: {
        uid,
      }
    })
  },

  //根据图片标签模糊匹配
  getPictureByKeyword(keyword,startIndex,number){
    return axios({
      url: '/Picture/GetPictureByKeyword',
      method: 'get',
      params: {
        keyword,
        startIndex,
        number,
      }
    })
  }

}