<template>
  <!--瀑布流-->
  <div id="Collection" class="vue-virtual-collection" :style="collectionStyle">
    <div class="vue-virtual-collection-container" :style="containerStyle">
      <div v-for="(item,ind) in imgItems" :key="ind" class="cell-container" :style="getCellStyle(item,ind)">
        <slot name="cell" :data="item" />
      </div>
    </div>
    <!--无限加载-->
    <infinite-loading @infinite="infinite" >
      <div slot="no-more" >
        <div style="width: 0;height: 0;"/>
        <!--        <svg font-size="160" class="icon" aria-hidden="true">-->
        <!--          <use xlink:href="#pickongtai1" />-->
        <!--          <p style="color: #e3f2fa; font-size: 20px;">到底了</p>-->
        <!--        </svg>-->
      </div>
      <!--无结果-->
      <!--      <div slot="no-results" style="margin-top: 50px">-->
      <!--        <svg font-size="160" class="icon" aria-hidden="true">-->
      <!--          <use xlink:href="#pickongtai1" />-->
      <!--          <p style="color: #e3f2fa; font-size: 20px;">没有内容</p>-->
      <!--        </svg>-->
      <!--      </div>-->
    </infinite-loading>
    <el-backtop target=".vue-virtual-collection" />
    <el-popover
        title="图片排列方式"
        placement="left-end"
        width="400"
        trigger="click"
        @change="orderChange">
      <el-radio-group v-model="orderBy" size="medium">
        <el-radio-button label="view" >浏览量</el-radio-button>
        <el-radio-button label="like">点赞数</el-radio-button>
        <el-radio-button label="collect">收藏数</el-radio-button>
        <el-radio-button label="date">最新</el-radio-button>
        <el-radio-button label="dateAsc">最早</el-radio-button>
      </el-radio-group>
      <el-button slot="reference" type="info" icon="el-icon-setting" circle></el-button>
    </el-popover>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading';
import { getClient } from '@/utils/dom';
export default {
  name: "Collection",
  components: {
    InfiniteLoading,
  },
  data(){
    return {
      imgItems: [],//需要显示的图片集
      scrollY: 0,//竖直滚动条的位置
      cWidth: 0,//图片固定宽度
      cHeight: 0,//高度
      imgIndex: 0,
      yPositions: [0,0,0,0],
      yPos: [],
      xPositions: [],
      width: 0,//容器宽度
      height: 0,//容器高度
      number: 20,//每次请求的图片数目
      orderBy: 'view',
    }
  },
  created() {
    this.width = getClient().width * 0.90;
    this.cWidth = 0.20 * this.width;
    this.yPositions = [0,0,0,0]
  },
  computed: {
    collectionStyle(){
      return {
        width: `${getClient().width * 0.92}px`,
        height: `${getClient().height * 0.9}px`,

      }
    },
    containerStyle(){
      return {
        width: `${getClient().width * 0.90}px`,
        height: `${this.height}px`,
      }
    },
  },
  methods: {
    infinite($state){
      let tmpItems = []
      this.$api.picture.getPictureStream(this.imgIndex,this.orderBy,this.number).then((res)=>{
        console.log(res);
        tmpItems.push(...res.data);
        tmpItems.forEach((item)=>{
          item.height = item.height * this.cWidth / item.width;
          item.width = this.cWidth;
        })
        this.imgIndex += res.data.length;
        this.imgItems.push(...tmpItems);
        $state.loaded();
        if(res.data.length<this.number){
          $state.complete();
        }
      });

    },
    getX(ind){
      return this.width*(7+(20+2)*(ind%4))/100;
    },
    getY(ind,tHeight){
      if(this.yPos[ind]==null){
        this.yPositions[ind%4] += 20;
        this.yPos[ind] = this.yPositions[ind%4]
        this.yPositions[ind%4] += tHeight;
      }
      return this.yPos[ind]
    },
    getCellStyle(item,ind){
      return {
        left: `${this.getX(ind)}px`,
        top: `${this.getY(ind,item.height)}px`,
        width: `${this.cWidth}px`,
        height: `${item.height}px`,
      }
    },
    orderChange(){
      console.log(this.orderBy)
      this.yPos = []
      this.xPositions = [0,0,0,0]
      this.imgItems = []
      this.imgIndex = 0

    }
  },
}
</script>

<style lang="less" scoped>
.vue-virtual-collection {

  -webkit-overflow-scrolling: touch;
  &-container {
    position: relative;
    margin: 10px auto;
  }
  .cell-container {
    position: absolute;
    top: 0;
  }
}
</style>