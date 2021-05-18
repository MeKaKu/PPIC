<template>
  <div id="share">
    <!-- 上传 -->
    <div class="upload-section">
      <el-upload
          class="upload-button"
          drag
          :action="`${$store.getters.serverAddress}/Picture/UpLoadPicture`"
          :multiple="false"
          :data="params"
          :auto-upload="false"
          ref="upload"
          :on-change="addedFile"
          :on-success="uploadSucceed"
          :on-error="uploadError"
          list-type="picture"
          accept="image/jpeg,image/png"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过5M</div>
      </el-upload>

      <el-dialog :visible.sync="dialogVisible">
        <!-- 图片预览 -->
        <img width="100%" :src="dialogImageUrl" alt="">
        <!-- 添加tags -->
        <div class="tag-controller">
          <el-tag
              :key="tag"
              v-for="tag in dynamicTags"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)">
            {{tag}}
          </el-tag>
          <el-input
              class="input-new-tag"
              v-if="inputVisible === 2"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
          >
          </el-input>
          <el-button v-else-if="inputVisible === 1" class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelSubmit">取 消</el-button>
          <el-button type="primary" @click="submitFile">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <el-divider></el-divider>
    <!-- 用户上传过的图片 -->
    <div>
      <pre>我的上传：</pre>
    </div>
    <com-collection ref="collection" :width="width" :items="items" :total="total" @getItemList="getItemList">
      <template v-slot:cell="props">
        <com-item :item="props.data" />
      </template>
    </com-collection>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import ComCollection from "@/components/publicCom/ComCollection";
import ComItem from "@/components/publicCom/ComItem";
import {getClient} from "@/utils/dom";
export default {
  name: "index",
  components: {
    ComCollection,
    ComItem,
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      files: [],
      url: '',
      params: {
        uid: 0,
        tag: '',
      },//图片上传附带的参数
      dynamicTags: [],//标签数组
      inputVisible: 1,//是否输入标签
      inputValue: '',//输入的标签的值
      //用户上传的图片
      width: 0,
      total: 0,
      items: [],
    };
  },
  created() {
    //宽度
    this.width = getClient().width * 0.9
    //获取total数
    this.$api.picture.getPictureCountByUid(this.user.uid).then((res)=>{
      console.log("上传界面-请求用户上传的图片数目:")
      console.log(res)
      this.total = res.data
    })
  },
  computed: {
    ...mapGetters(['user']),
  },
  methods: {
    addedFile(file){
      this.dialogImageUrl = file.url
      console.log("on-change")
      console.log(file)
      if(file.size > 5*1024*1024){
        this.$message.error("图片大小不能超过5M")
        this.$refs.upload.remove(file)
        return
      }
      if(file.status === 'ready'){
        this.dialogVisible = true
      }
    },
    cancelSubmit(){
      this.dynamicTags = []
      this.inputVisible = 1
      this.inputValue = ''
      this.dialogVisible = false
      this.$refs.upload.fileList.pop()
    },
    submitFile(){ //确定上传文件
      this.dialogVisible = false
      this.params.uid = this.user.uid
      this.params.tag = this.dynamicTags.join('#')
      this.params.tag = '#' + this.params.tag
      //console.log(this.params.tag)
      this.$refs.upload.submit()
      this.dynamicTags = []
      this.inputVisible = 1
      this.inputValue = ''
      this.dialogVisible = false
    },
    uploadSucceed(res){//上传成功
      console.log('上传文件结果',res)
      this.$message.success("上传成功")
      let milvusPath = '/tmp/pic3/' + (res.split('/').pop())
      this.$api.milvus.addPicture(milvusPath).then((retState)=>{
        console.log('milvus-train',retState)
      })
      //this.dialogVisible = false
      this.total += 1
      this.$refs.collection.getItemList()
    },
    uploadError(err,file){//上传失败
      this.$message.error("上传失败")
      console.log(err)
      this.$refs.upload.remove(file)
      //this.dialogVisible = false
    },
    handleClose(tag) { //处理标签关闭
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      if(this.dynamicTags.length < 10 && this.inputVisible === 0){
        this.inputVisible = 1
      }
    },
    showInput() {
      this.inputVisible = 2;
      this.$nextTick( () => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if(inputValue.length>10){
        this.$message.info("标签长度不能超过10")
        return
      }
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = 1;
      this.inputValue = '';
      if(this.dynamicTags.length>=10){
        this.inputVisible = 0
      }
    },
    getItemList(startIndex,pageSize,cWidth,cHeight){
      this.$api.picture.getPictureListByUid(this.user.uid,startIndex,pageSize).then((res)=>{
        console.log("上传界面-请求用户上传的图片：startIndex="+startIndex)
        console.log(res)
        this.items = res.data
        this.items.forEach((item)=>{
          item.height = cHeight
          item.width = cWidth
        })
      }).catch(()=>{
        this.$message.error("无法获取上传的图片")
      })
    },
  },
}
</script>

<style scoped lang="less">
.tag-controller{
  margin-top: 20px;
}
.el-tag + .el-tag {
  margin-left: 10px;
  margin-top: 10px;
}
.button-new-tag {
  margin-left: 10px;
  margin-top: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  margin-top: 10px;
  vertical-align: bottom;
}
</style>