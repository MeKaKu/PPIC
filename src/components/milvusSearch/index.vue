<template>
  <div id="milvusSearch">
    <h2>上传图片搜索相似的图片</h2>
<!--    <el-button icon="el-icon-search" circle @click="test"></el-button>-->
    <el-upload
        drag
        action="http://180.76.167.81:35000/api/v1/search"
        :data="params"
        :on-success="submitSuccess"
        :on-change="addFile"
        :multiple="false"
        accept="image/jpeg,image/png"
        :show-file-list="false"
        class="uploader"
        ref="milvusSearchUpload">
      <el-image v-if="imgUrl" :src="imgUrl" fit="scale-down" class="up-image"/>
      <i v-if="!imgUrl" class="el-icon-upload"></i>
      <div v-if="!imgUrl" class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div v-if="!imgUrl" class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <el-divider />
    <!-- 显示结果 -->
    <inf-collection :width="width" :loading="loading" :no-more="noMore"
                    :items="pictures" @load="load" ref="infCollection">
      <template v-slot:cell="props">
        <img-item :item="props.data" />
      </template>
    </inf-collection>
  </div>
</template>

<script>
import InfCollection from "@/components/publicCom/InfCollection";
import ImgItem from "@/components/pictureStream/ImgItem";
import {getClient} from "@/utils/dom";
export default {
  name: "milvusSearch",
  components: {
    InfCollection,
    ImgItem,
  },
  data(){
    return {
      params: {
        Num: 100,
      },
      width: getClient().width * 0.9,
      loading: false,
      noMore: false,
      pictures: [],
      size: 12,
      index: 0,
      milvusResult: [],
      imgUrl: '',
    }
  },
  methods: {
    load(cWidth,cHeight){//加载图片
      this.loading = true
      let tmp = []
      //let tmpImg = {}
      for(let i=0;i<this.size;i++){
        if(this.index<this.milvusResult.length){
          let result = this.milvusResult[this.index]
          tmp[i] = {}
          tmp[i].width = cWidth
          tmp[i].height = cHeight
          let imgName = result[0].split('/').pop()
          tmp[i].pid = parseInt(imgName.split('.')[0].substring(4))
          //console.log(imgName)
          tmp[i].url = '/' + imgName
          //setTimeout(()=>{},100)
          //tmp[this.index] = tmp[i]
          this.index += 1
          //console.log('load',tmp[i])
        }
        else{
          break
        }
      }
      //console.log('load',tmp)
      this.pictures.push(...tmp)
      if(this.index >= this.milvusResult.length){
        this.noMore = true
      }
      this.loading = false
      //console.log('load',this.pictures)
    },
    submitSuccess(res){
      console.log('search',res)//res是一个数组[[url,dist],...]
      this.milvusResult = res
      this.index = 0
      this.pictures = []
      this.noMore = false
      this.$refs.infCollection.init()
    },
    addFile(file){
      if(file.size > 5*1024*1024){
        this.$message.error("图片大小不能超过5M")
        this.$refs.upload.remove(file)
        return
      }
      if(file.status === 'ready') {
        //console.log('ready',file)
        this.imgUrl =  URL.createObjectURL(file.raw)
      }
    },
    test(){

      //[1]test-milvus-process
      //返回已经加载转化的图片数和传入路径下的总图片数
      // this.$api.milvus.getPictureProcess().then((res)=>{
      //   console.log('process:',res)//res.data是一个字符串"current: number, total: number"
      // })

      //[2]test-milvus-count
      //返回milvus里面的图片总数
      // this.$api.milvus.getPictureCount().then((res)=>{
      //   console.log('count:',res)//res.data是一个数字number，无图片res.data是字符串"None"
      // })

      //[3]test-milvus-delete
      //清空milvus里面的所有图片
      // this.$api.milvus.deletePicture().then((res)=>{
      //   console.log('delete',res)//res.data是一个字符串"Status(code=0, message='Delete collection successfully!')"
      // })

      //[4]test-milvus-train
      // this.$api.milvus.addPicture('/tmp/pic2/test').then((res)=>{
      //   console.log('train',res)
      //   //res.data返回状态
      //   //"start"开始加载图片
      // })

      //[5]test-milvus-serach
      //this.$refs.milvusSearchUpload.submit()
      //submitSuccess(res){
      //  console.log('search',res)//res是一个数组[[url,dist],...]
      //},
    },
  },
}
</script>

<style scoped lang="less">
#milvusSearch{

}
.uploader{
  overflow: hidden;
  position: relative;
  height: 180px;
  width: 360px;
  left: 50%;
  margin-left: -180px;
  .up-image{
    width: 360px;
    height: 180px;
    position: absolute;
    top: 0;
    left: 0;
  }
}

</style>