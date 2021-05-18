<template>
  <div id="ImgItem" :style="comStyle" @click="goDetail">
    <div class="item-container">
<!--      <h3>{{item.view_count}}</h3>-->
      <img :src="`${this.pictureBaseUrl}/picture/${item.url}`" alt="?" />
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  name: "ImgItem",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['pictureBaseUrl']),
    comStyle(){
      return {
        width: `${this.item.width}px`,
        height: `${this.item.height}px`,
      }
    },
  },
  methods: {
    goDetail(){
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
    }
  }
}
</script>

<style lang="less" scoped>
#ImgItem{
  box-sizing: border-box;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 8px;
  overflow: hidden;
  &:hover {
    img {
      transform: scale(1.2);
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