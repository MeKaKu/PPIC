<template>
  <div id="PictureStream">
    <inf-collection :width="width" :loading="loading" :no-more="noMore"
                    :items="pictures" @load="load" ref="infCollection">
      <template v-slot:cell="props">
        <img-item :item="props.data" />
      </template>
    </inf-collection>
    <el-popover
        style="position:fixed;z-index:999;right:40px;bottom:100px;"
        title="图片排列方式"
        placement="left-end"
        width="400"
        trigger="hover">
      <el-radio-group v-model="orderBy" size="medium" @change="orderChange">
        <el-radio-button label="view" >浏览量</el-radio-button>
        <el-radio-button label="like">点赞数</el-radio-button>
        <el-radio-button label="collect">收藏数</el-radio-button>
        <el-radio-button label="date">最新</el-radio-button>
        <el-radio-button label="dateAsc">最早</el-radio-button>
      </el-radio-group>
      <el-button slot="reference" type="info" icon="el-icon-setting"
                 :disabled="this.loading" circle></el-button>
    </el-popover>
  </div>
</template>

<script>
import InfCollection from "@/components/publicCom/InfCollection";
import ImgItem from "@/components/pictureStream/ImgItem";
import {getClient} from "@/utils/dom";
export default {
  name: "PictureStream",
  components: {
    InfCollection,
    ImgItem,
  },
  created() {
    //console.log('user',this.$store.getters.user)
    //console.log('isLogined',this.$store.getters.isLogined)
  },
  data(){
    return {
      width: getClient().width * 0.9,
      loading: false,
      noMore: false,
      pictures: [],
      startIndex: 0,
      size: 24,
      orderBy: 'view'
    }
  },
  methods: {
    orderChange(value){
      console.log("排序方式change=" + value)
      this.startIndex = 0
      this.pictures = []
      this.noMore = false
      this.$refs.infCollection.init()
    },
    load(cWidth,cHeight){
      this.loading = true;
      let tmp = []
      this.$api.picture.getPictureStream(this.startIndex,this.orderBy,this.size).then((res)=>{
        console.log("PictureStream：startIndex="+this.startIndex)
        console.log(res)
        tmp=res.data
        tmp.forEach((item)=>{
          item.height = item.height * cWidth / item.width;
          item.width = cWidth;
          if(item.height < 0.1 * cHeight){
            item.height = 0.1 * cHeight
          }
          else if(item.height > 3 * cHeight){
            item.height = 3 * cHeight
          }
        })
        this.pictures.push(...tmp)
        this.startIndex += tmp.length
        if(tmp.length < this.size){
          this.noMore = true
        }
        this.loading = false
      })
    }
  }

}
</script>

<style scoped lang="less">

</style>