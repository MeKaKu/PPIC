<template>
  <div id="AlbumItem" :style="comStyle" @click="goDetail">
    <div class="item-container" :style="backImg">
<!--      <img :src="item.url" alt="?">-->
      <div class="count">
        <img src="../../assets/img/count.svg" alt="?">
        <span>{{ item.picture_count }}</span>
      </div>
      <div class="album-name" >
        <pre>{{item.name}}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  name: "AlbumItem",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['pictureBaseUrl']),
    comStyle() {
      return {
        width: `${this.item.width}px`,
        height: `${this.item.height}px`,
      };
    },
    backImg(){
      return {
        'background-image' : `url("${this.pictureBaseUrl}/picture/${this.item.url}")`,
      }
    },
  },
  methods: {
    goDetail() {
      if(this.$store.getters.isLogined === false){
        this.$message.info("请先登录QWQ");
        return;
      }
      //this.$store.dispatch('setDetail', this.item);
      if(localStorage.getItem('openNew') === true){
        const routeUrl = this.$router.resolve(`/albumDetail/${this.item.aid}`);
        window.open(routeUrl.href, '_blank');
      }
      else{
        this.$router.push(`/albumDetail/${this.item.aid}`).catch((err)=>{console.log(err)})
      }
    },

  },
}
</script>

<style scoped lang="less">
#AlbumItem{
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
  .item-container {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 16px;
    overflow: hidden;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    .album-name{
      font-size: 3em;
      color: white;
      text-shadow: 2px 2px 3px #333333;
      text-align: center;
      &:hover{
        pre{
          transform: scale(1.2);
        }
      }
      pre{
        transition: font-size 0.3s, transform 0.3s ease;
      }
    }

    img {
      width: 100%;
      height: 100%;
      transition: opacity 0.3s, transform 0.3s ease;
      object-fit: cover;
      border-radius: 16px;
    }

    .count {
      position: absolute;
      display: inline-block;
      top: 8px;
      right: 8px;
      color: white;
      background-color: #0000009e;
      padding: 2px;
      border-radius: 4px;

      img {
        float: left;
        fill: white;
        height: 20px;
        width: 20px;
      }

      span {
        float: right;
        padding: 0 2px;
        line-height: 20px;
      }
    }
  }
}
</style>