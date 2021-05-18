<template>
  <!-- 无限加载显示器 -->
  <div id="InfCollection" :style="getContainerStyle" class="infinite-list-wrapper">
    <div class="container"
         :v-infinite-scroll="load" :infinite-scroll-disabled="disabled">
      <div v-for="(item,ind) in items" :key="ind" class="cell-container" :style="getCellStyle(ind)">
        <slot name="cell" :data="item" />
      </div>
    </div>
    <div class="inf-tip" style="position: absolute;bottom: 5px" :style="`width:${width}px;height:${0.05*width}px;`" >
      <pre v-if="loading">加载中...</pre>
      <pre v-if="noMore">Oops...没有更多了</pre>
      <pre v-if="!disabled" @mouseenter="load"><i class="el-icon-arrow-down" />查看更多</pre>
    </div>
    <el-backtop target=".infinite-list-wrapper" />
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  name: "InfCollection",
  props: {
    width: {
      type: Number,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
    noMore: {
      type: Boolean,
      required: true,
    }
  },
  data(){
    return {
      yPositions: [0,0,0,0],
      yPos: [],
      xPos: [],
      bottomY: 0,
    }
  },
  created() {
    this.init()
  },
  computed: {
    ...mapGetters(['pictureBaseUrl']),
    getContainerStyle(){
      return {
        height: `${this.height}px`,
        width: `${this.width}px`,
      }
    },
    getBgStyle(){
      return {
        'background-image': `url("${this.pictureBaseUrl}/picture/${this.bgurl}")`,
        height: `${this.height}px`,
        width: `${this.width}px`,
      }
    },
    height(){
      return this.bottomY + 0.08 * this.width
    },
    cWidth(){
      return 0.2 * this.width
    },
    cHeight(){
      return 0.24 * this.width
    },
    disabled(){
      return this.loading || this.noMore
    },
  },
  methods: {
    getX(ind){
      return this.width*(7+(20+2)*(ind%4))/100;
    },
    getY(ind){
      if(this.yPos[ind] == null) {
        // this.yPositions[ind % 4] += 0.03 * this.width;
        // this.yPos[ind] = this.yPositions[ind % 4];
        // this.yPositions[ind % 4] += this.cHeight;
        //获取y值最小的那一列 minInd
        let minInd = 0
        for(let i = 0;i < 4;i++){
          if(this.yPositions[i] < this.yPositions[minInd]){
            minInd = i
          }
        }
        //更新 yPosition[minInd]
        this.yPositions[minInd] += 0.03 * this.width //图片垂直间距
        this.yPos[ind] = this.yPositions[minInd] //图片y值
        this.yPositions[minInd] += this.items[ind].height //图片高度
        let maxInd = 0
        for(let i = 0;i < 4;i++){
          if(this.yPositions[i] > this.yPositions[maxInd]){
            maxInd = i
          }
        }
        this.bottomY = this.yPositions[maxInd] + 0.03 * this.width
        //x
        this.xPos[ind] = this.getX(minInd)
      }
      return {x:this.xPos[ind],y:this.yPos[ind]}
    },
    getCellStyle(ind){
      return {
        left: `${this.getY(ind).x}px`,
        top: `${this.getY(ind).y}px`,
        height: `${this.items[ind].height}px`,
        width: `${this.cWidth}px`,
      }
    },
    load(){
      this.$emit('load',this.cWidth,this.cHeight)
    },
    init(){
      this.xPos = []
      this.yPos = []
      this.yPositions = [0,0,0,0]
      this.bottomY = 0
      this.load()
    },
  }
}
</script>

<style scoped lang="less">
#InfCollection {
  -webkit-overflow-scrolling: touch;
  position: relative;
  margin: 10px auto;
  .container{
    height: 100%;
  }
  .inf-tip{
    pre{
      text-align: center;
      margin-top: auto;
      font-size: 1.2em;
    }
  }
  .cell-container {
    position: absolute;
  }
}
</style>