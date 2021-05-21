<template>
  <!-- 相册分页显示器 -->
  <div id="AlbumCollection" :style="getContainerStyle">
    <el-tooltip class="item" effect="dark" content="创建相册" placement="right">
      <div class="add-album" :style="getCellStyle(0)" @click="createAlbum">
        <i class="icon-add" />
      </div>
    </el-tooltip>
    <div v-for="(item,ind) in items" :key="ind" class="cell-container" :style="getCellStyle(ind+1)">
      <slot name="cell" :data="item" />
    </div>
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
export default {
  name: "AlbumCollection",
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
    }
  },
  data(){
    return {
      pageIndex: 1,
      yPositions: [0,0,0,0],
      yPos: [],
      pageSize: 15,
    }
  },
  created() {
    this.getItemList()
  },
  computed: {
    getContainerStyle(){
      return {
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
    },
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
        'line-height': `${this.cHeight}px`
      }
    },
    getItemList(){
      let startIndex = this.pageSize*(this.pageIndex-1);
      this.$emit('getItemList',startIndex,this.pageSize,this.cWidth,this.cHeight)
    },
    createAlbum() {
      this.$emit('createAlbum')
    }
  }
}
</script>

<style scoped lang="less">
#AlbumCollection {
  -webkit-overflow-scrolling: touch;
  position: relative;
  margin: 10px auto;
  .add-album{
    position: absolute;
    border: 2px dashed #666666;
    border-radius: 16px;
    text-align: center;
    overflow: hidden;
    cursor: pointer;
    &:hover{
      color: #409EFF;
    }
    i{
      margin: auto;
      font-size: 250%;
    }
  }
  .cell-container {
    position: absolute;
  }
}
</style>