<template>
  <!-- 分页加载显示器 -->
  <div id="ComCollection" :style="getContainerStyle">
    <div v-if="total !== 0" class="my-bg" :style="getBgStyle"></div>
    <div v-if="total === 0" class="empty">
      <pre>Oops...没有内容...</pre>
    </div>
    <div v-for="(item,ind) in items" :key="ind" class="cell-container" :style="getCellStyle(ind)">
      <slot name="cell" :data="item" />
    </div>
    <!-- 分页 -->
    <div style="position: absolute;bottom: 10px;" :style="`width:${this.width}px;height:${0.1*this.width}px;`">
      <el-pagination
          style="display: flex;justify-content: center;"
          layout="prev, pager, next"
          :total="total"
          :current-page.sync="pageIndex"
          @current-change="getItemList"
          :hide-on-single-page="true"
          :page-size="pageSize"
      />
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  name: "ComCollection",
  props: {
    width: {
      type: Number,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    bgurl:{
      type: String,
      default: '/white.jpg',
    },
  },
  data(){
    return {
      pageIndex: 1,
      yPositions: [0,0,0,0],
      yPos: [],
      pageSize: 16,
    }
  },
  created() {
    this.getItemList()
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
      let line = this.items.length/4
      if(this.items.length%4>0){
        line += 1
      }
      return (line * 33)*this.width/100
    },
    cWidth(){
      return 0.2 * this.width
    },
    cHeight(){
      return 0.24 * this.width
    }
  },
  methods: {
    getX(ind){
      return this.width*(7+(20+2)*(ind%4))/100;
    },
    getY(ind){
      if(this.yPos[ind] == null) {
        this.yPositions[ind % 4] += 0.03 * this.width;
        this.yPos[ind] = this.yPositions[ind % 4];
        this.yPositions[ind % 4] += this.cHeight;
      }
      return this.yPos[ind];
    },
    getCellStyle(ind){
      return {
        left: `${this.getX(ind)}px`,
        top: `${this.getY(ind)}px`,
        height: `${this.cHeight}px`,
        width: `${this.cWidth}px`,
      }
    },
    getItemList(){
      let startIndex = this.pageSize*(this.pageIndex-1);
      this.$emit('getItemList',startIndex,this.pageSize,this.cWidth,this.cHeight)
    },
    changeList(){
      console.log("changeList!")
      if(this.total > 0 && this.items.length === 1){
        this.pageIndex -= 1
      }
      this.getItemList()
    }
  }
}
</script>

<style scoped lang="less">
#ComCollection {
  -webkit-overflow-scrolling: touch;
   position: relative;
   margin: 10px auto;
  .my-bg{
    position: absolute;
    top: 0;
    left: 0;
    margin: 0 auto;
    background-color: white;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    filter: blur(5px);
  }
  .empty{
    height: 100%;
    width: 100%;
    line-height: 100%;
    color: #666666;
    text-align: center;
    pre{
      font-size: 1.5em;
    }
  }
  .cell-container {
    position: absolute;
  }
}
</style>