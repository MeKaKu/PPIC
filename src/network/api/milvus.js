import Axios from 'axios';
const axios = Axios.create({
  baseURL: 'http://180.76.167.81:35000',
  timeout: 20000,//20s
})
//milvus-1.0.0
export default {

  //milvus-train  POST
  //将指定路径下的图片全部加载进milvus(服务器上面的路径)
  addPicture(File){
    return axios({
      url: '/api/v1/train',
      method: 'post',
      params: {
        File,
      }
    })
  },

  //milvus-process  GET
  //返回已经加载转化的图片数和传入路径下的总图片数
  //返回字符串"current: number, total: number"
  getPictureProcess(){
    return axios({
      url: '/api/v1/process',
      method: 'get',
    })
  },

  //milvus-count  POST
  //返回milvus里的图片总数目
  //返回一个number类型，表示总数
  getPictureCount(){
    return axios({
      url: '/api/v1/count',
      method: 'post',
    })
  },

  //milvus-delete  POST
  //清空milvus里面的所有图片
  //成功返回字符串"Status(code=0, message='Delete collection successfully!')"
  deletePicture(){
    return axios({
      url: '/api/v1/delete',
      method: 'post',
    })
  }

  //milvus-search  POST
  //上传一张图片进行相似图片检索
  //返回数组[[url,dist],...]
  // searchPicture(topk,image){
  //   return axios({
  //     url: '/api/v1/search',
  //     method: 'post',
  //     params: {
  //       topk,
  //       image,
  //     }
  //   })
  //}

}