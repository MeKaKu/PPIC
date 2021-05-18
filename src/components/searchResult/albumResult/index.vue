<template>
  <div id="AlbumResult">
    <inf-collection :width="width" :loading="loading" :no-more="noMore"
                    :items="albums" @load="load">
      <template v-slot:cell="props">
        <album-item :item="props.data" />
      </template>
    </inf-collection>
  </div>
</template>

<script>
import InfCollection from "@/components/publicCom/InfCollection";
import AlbumItem from "@/components/album/AlbumItem";
import {getClient} from "@/utils/dom";
export default {
  name: "AlbumResult",
  components: {
    InfCollection,
    AlbumItem,
  },
  data(){
    return {
      width: getClient().width * 0.9,
      loading: false,
      noMore: false,
      albums: [],
      startIndex: 0,
      size: 16,
      keyword: this.$route.query.keyword,
    }
  },
  methods: {
    load(cWidth,cHeight){
      console.log("load")
      this.loading = true;
      let tmp = []
      this.$api.album.getAlbumByKeyword(this.keyword,this.startIndex,this.size).then((res)=>{
        console.log("模糊匹配相册：startIndex="+this.startIndex)
        console.log(res)
        tmp=res.data
        tmp.forEach((item)=>{
          item.width = cWidth
          item.height = cHeight
        })
        this.albums.push(...tmp)
        this.startIndex += tmp.length
        if(tmp.length < this.size){
          this.noMore = true
        }
        this.loading = false
      })
    }
  },

}
</script>

<style scoped>

</style>