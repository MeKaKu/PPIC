<template>
  <div id="album">
    <el-tabs v-model="activeName" @tab-click="handleClick" style="display: flex;justify-content: center;">
      <el-tab-pane label="点赞" name="like"></el-tab-pane>
      <el-tab-pane label="收藏" name="collect"></el-tab-pane>
    </el-tabs>
    <com-collection v-if="activeName==='like'" :width="width" :items="pItems" :total="pTotal"
                    @getItemList="getPictureList">
      <template v-slot:cell="props">
        <com-item :item="props.data" />
      </template>
    </com-collection>
    <album-collection v-else :width="width" :items="aItems" :total="aTotal"
                      @getItemList="getAlbumList" @createAlbum="createAlbum" >
      <template v-slot:cell="props">
        <album-item :item="props.data" />
      </template>
    </album-collection>
    <el-dialog title="创建相册" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="albumForm">
        <el-form-item label="相册名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off" :maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="相册描述" :label-width="formLabelWidth" prop="tip">
          <el-input v-model="form.tip" autocomplete="off" :maxlength="100"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAlbum">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ComCollection from "@/components/publicCom/ComCollection";
import AlbumCollection from "@/components/album/AlbumCollection";
import ComItem from "@/components/publicCom/ComItem";
import AlbumItem from "@/components/album/AlbumItem";
import { getClient } from '@/utils/dom';
import { mapGetters } from 'vuex';
export default {
  name: "index",
  components: {
    ComItem,
    ComCollection,
    AlbumItem,
    AlbumCollection,
  },
  data(){
    const validateName = (rule,value,callback) => {
      if (!value) {
        return callback(new Error('请输入相册名称'));
      }
      if(value.length > 10){
        return callback(new Error('相册名称不能超过10位'))
      }
      callback();
    };
    const validateTip = (rule,value,callback) => {
      if(!value){
        return callback(new Error('请输入相册描述'))
      }
      if(value.length > 100){
        return callback(new Error('相册描述不能超过100位'))
      }
      callback();
    };
    return {
      width: 0,
      pItems: [],
      aItems: [],
      aTotal: 0,
      pTotal: 0,
      activeName: 'collect',
      form: {
        name : '',
        tip : '',
      },
      rules: {
        name: [
          { validator: validateName, trigger: 'blur' },
        ],
        tip: [
          { validator: validateTip, trigger: 'blur' },
        ],
      },
      dialogFormVisible: false,
      formLabelWidth: '120px',
    }
  },
  computed: {
    ...mapGetters(['user']),
  },
  created() {
    this.width = getClient().width * 0.9
    this.$api.pictureLiked.getPictureLikedCount(this.user.uid).then((res)=>{
      console.log("请求用户喜欢的图片数目")
      console.log(res)
      this.pTotal = res.data
    })
    this.$api.album.getAlbumCount(this.user.uid).then((res)=>{
      console.log("请求用户的相册数目")
      console.log(res)
      this.aTotal = res.data
    })
  },
  methods: {
    //请求图片列表
    getPictureList(startIndex,pageSize,cWidth,cHeight){
      this.$api.picture.getPictureLikedByUser(this.user.uid,startIndex,pageSize).then((res)=>{
        console.log("请求用户喜欢的图片：startIndex="+startIndex)
        console.log(res)
        this.pItems = res.data
        this.pItems.forEach((item)=>{
          item.height = cHeight
          item.width = cWidth
        })
      }).catch(()=>{
        this.$message.error("Error")
      })
    },
    //请求相册列表
    getAlbumList(startIndex,pageSize,cWidth,cHeight){
      this.$api.album.getAlbumByUid(this.user.uid,startIndex,pageSize).then((res)=>{
        console.log("请求用户的相册：startIndex="+startIndex)
        console.log(res)
        this.aItems = res.data
        this.aItems.forEach((item)=>{
          item.height = cHeight
          item.width = cWidth
        })
      }).catch(()=>{
        this.$message.error("Error")
      })
    },
    handleClick(tab,event){
      console.log(tab, event);
    },
    createAlbum(){
      this.form.name = ''
      this.form.tip = ''
      this.dialogFormVisible = true
    },
    submitAlbum(){
      this.$refs.albumForm.validate((value)=>{
        if(value){
          this.dialogFormVisible = false
          let data = {
            uid: this.user.uid,
            name: this.form.name,
            tip: this.form.tip,
          }
          //console.log(data);
          this.$api.album.createAlbum(data).then((res)=>{
            console.log("请求创建相册",res)
            //let tmpUrl = this.$route.path
            //console.log(tmpUrl)
            //this.$router.replace(tmpUrl)
            location.reload()
          }).catch(()=>{
            this.$message.error("Error")
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
#album{
  margin: auto;
}
</style>