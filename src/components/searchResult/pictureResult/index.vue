<template>
  <div id="PictureResult">
    <inf-collection :width="width" :loading="loading" :no-more="noMore"
                    :items="pictures" @load="load">
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
  name: "PictureResult",
  components: {
    InfCollection,
    ImgItem,
  },
  data(){
    return {
      width: getClient().width * 0.9,
      loading: false,
      noMore: false,
      pictures: [],
      startIndex: 0,
      size: 16,
      keyword: this.$route.query.keyword,
    }
  },
  methods: {
    load(cWidth,cHeight){
      this.loading = true;
      let tmp = []
      this.$api.picture.getPictureByKeyword(this.keyword,this.startIndex,this.size).then((res)=>{
        console.log("模糊匹配图片：startIndex="+this.startIndex)
        console.log(res)
        tmp=res.data
        tmp.forEach((item)=>{
          item.width = cWidth
          item.height = cHeight
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

<style scoped>

</style>