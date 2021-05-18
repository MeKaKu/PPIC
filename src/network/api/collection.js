import axios from '../index'

export default {

  //更新收藏情况
  updateCollection(pid,aid,collected){
    return axios({
      url: '/Collection/UpdateCollection',
      method: 'put',
      params: {
        pid,
        aid,
        collected,
      }
    })
  }

}