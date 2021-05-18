<template>
  <div id="AlbumDetailItem" :style="comStyle"
       @click="goDetail" @mouseenter="changeBg" @mouseleave="cancelBg">
    <div class="item-container">
      <img :src="`${pictureBaseUrl}/picture/${item.url}`" alt="?">
    </div>
    <div v-if="isDelete" class="delete-button">
      <el-popconfirm title="确定要删除这一张图片吗？" @confirm="confirmDelete">
        <el-button slot="reference" circle icon="el-icon-close" style="font-size: 1.2em" type="danger"></el-button>
      </el-popconfirm>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  name: "AlbumDetailItem",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['pictureBaseUrl','isDelete']),
    comStyle() {
      return {
        width: `${this.item.width}px`,
        height: `${this.item.height}px`,
      };
    }
  },
  methods: {
    goDetail() {
      if(this.isDelete === true){
        return
      }
      if(this.$store.getters.isLogined === false){
        this.$message.info("请先登录QWQ");
        return;
      }
      //this.$store.dispatch('setDetail', this.item);
      if(localStorage.getItem('openNew') === true){
        const routeUrl = this.$router.resolve(`/detail/${this.item.pid}`);
        window.open(routeUrl.href, '_blank');
      }
      else{
        this.$router.push(`/detail/${this.item.pid}`).catch((err)=>{console.log(err)});
      }
    },
    confirmDelete(){
      this.$emit('deleteItem',this.item.pid);
    },
    changeBg(){
      this.$emit('changeBg',this.item.url)
    },
    cancelBg(){
      this.$emit('cancelBg')
    }
  },
}
</script>

<style scoped lang="less">
#AlbumDetailItem{
  box-sizing: border-box;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 8px;
  overflow: hidden;
  //background-color: #409EFF;
  //&:hover {
  //  img {
  //    transform: scale(1.2);
  //  }
  //}
  .delete-button{
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    line-height: 40px;
    text-align: center;
    &:hover{
      color: #E2264D;
    }
  }
  .item-container {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 16px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      transition: opacity 0.3s, transform 0.3s ease;
      object-fit: cover;
      border-radius: 16px;
    }
  }
}
</style>