import axios from "../index"

export default {

  //创建一个新的相册
  createAlbum(data){
    return axios({
      url: '/Album/CreateAlbum',
      method: 'post',
      data,
    })
  },

  //删除一个相册
  deleteAlbum(aid){
    return axios({
      url: '/Album/DeleteAlbum',
      method: 'post',
      params: {
        aid,
      }
    })
  },

  //修改相册信息
  updateAlbum(aid,name,tip){
    return axios({
      url: '/Album/UpdateAlbum',
      method: 'post',
      params: {
        aid,
        name,
        tip,
      }
    })
  },

  //分页获取用户的相册列表
  getAlbumByUid(uid,startIndex,number){
    return axios({
      url: '/Album/GetAlbumByUid',
      method: 'get',
      params: {
        uid,
        startIndex,
        number,
      }
    })
  },

  //获取指定用户的相册数目
  getAlbumCount(uid){
    return axios({
      url: '/Album/GetAlbumCountByUid',
      method: 'get',
      params: {
        uid,
      }
    })
  },

  //根据aid获取相册
  getAlbumByAid(aid){
    return axios({
      url: '/Album/GetAlbumByAid',
      method: 'get',
      params: {
        aid,
      }
    })
  },

  //获取用户的所有相册
  getAllAlbumByUid(uid,pid){
    return axios({
      url: '/Album/GetAllAlbumByUid',
      method: 'get',
      params: {
        uid,
        pid,
      }
    })
  },

  //根据相册名模糊匹配
  getAlbumByKeyword(keyword,startIndex,number){
    return axios({
      url: '/Album/GetAlbumByKeyword',
      method: 'get',
      params: {
        keyword,
        startIndex,
        number,
      }
    })
  }

}