<template>
  <div id="AlbumDetail">
    <!-- 相册信息 -->
    <div class="album-title" :style="backImg">
      <div class="album-info">
        <pre class="album-name">{{album.name}}</pre>
        <pre class="album-tip">{{album.tip}}</pre>
      </div>
      <img :src="this.pictureBaseUrl+'/user/'+userInfo.url" :alt="userInfo.name"
           @click="goUserHomePage(userInfo.uid)" class="avatar" style="cursor: pointer">
      <div class="user-info">
        <div class="user-name">{{userInfo.name}}</div>
      </div>
      <!-- 如果是用户自己的相册，则提供管理按钮 -->
      <div v-if="isLocalUser" class="album-action">
        <el-button v-if="isDelete" icon="el-icon-check" style="font-size: 1.4em"
                   @click="$store.dispatch('setIsDelete',false)"></el-button>
        <el-dropdown v-else @command="handleCommand">
          <el-button icon="el-icon-setting" circle style="font-size: 1.4em"></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="edit">编辑相册</el-dropdown-item>
            <el-dropdown-item command="manager">管理图片</el-dropdown-item>
            <el-dropdown-item command="delete" divided>删除相册</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- 编辑相册form -->
        <el-dialog title="编辑相册" :visible.sync="dialogFormVisible">
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
    </div>
    <!--相册内的图片-->
    <com-collection :width="width" :total="total" :items="pictures" ref="pictureContainer"
                    @getItemList="getPictureList" :bgurl="bgUrl">
      <template v-slot:cell="props">
        <album-detail-item :item="props.data"  @deleteItem="deletePicture" @changeBg="changeBg" @cancelBg="cancelBg"/>
      </template>
    </com-collection>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import ComCollection from "@/components/publicCom/ComCollection";
import AlbumDetailItem from "@/components/albumDetail/AlbumDetailItem";
import {getClient} from "@/utils/dom";
export default {
  name: "AlbumDetail",
  components: {
    ComCollection,
    AlbumDetailItem,
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
    }
    const validateTip = (rule,value,callback) => {
      if(!value){
        return callback(new Error('请输入相册描述'))
      }
      if(value.length > 100){
        return callback(new Error('相册描述不能超过100位'))
      }
      callback();
    }
    return {
      userInfo: {},
      album: {},
      albumId: parseInt(this.$route.params.aid),
      pictures: [],
      total: 0,
      width: 0,
      isLocalUser: false,
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
      bgUrl: '/white.jpg',
      titleUrl: '/undefined.jpg'
    }
  },
  created() {
    this.width = getClient().width * 0.9
    this.$api.album.getAlbumByAid(this.albumId).then((res)=>{
      console.log("相册详情界面，请求相册信息：")
      console.log(res)
      this.album = res.data
      this.total = this.album.picture_count
      this.titleUrl = this.album.url
      this.$api.user.getUserByUid(this.album.uid).then((res)=>{
        console.log("相册详情界面，请求相册所有者信息：")
        console.log(res)
        this.userInfo = res.data
        if(this.user.uid === this.userInfo.uid){
          this.isLocalUser = true
        }
      })
    })

  },
  computed: {
    ...mapGetters(['user','pictureBaseUrl','isDelete']),
    backImg() {
      return {
        'background-image': `url("${this.pictureBaseUrl}/picture/${this.titleUrl}")`,
      }
    },
  },
  methods: {
    getPictureList(startIndex,pageSize,cWidth,cHeight){
      this.$api.picture.getPictureListByAid(this.albumId,startIndex,pageSize).then((res)=>{
        console.log("相册详情界面，请求相册内的照片：startIndex="+startIndex)
        console.log(res)
        this.pictures = res.data
        this.pictures.forEach((p)=>{
          p.width = cWidth
          p.height = cHeight
        })
      })
    },
    handleCommand(command){
      if(command === 'edit'){
        this.form.name = this.album.name
        this.form.tip = this.album.tip
        this.dialogFormVisible = true
      }
      else if(command === 'manager'){
        this.$store.dispatch('setIsDelete',true)
      }
      else if(command === 'delete'){
        this.$confirm('此操作将移除相册内的所有图片，确定删除相册？','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(()=>{ //确定删除
          this.$api.album.deleteAlbum(this.albumId).then((res)=>{
            console.log('删除相册：aid='+this.albumId)
            console.log(res)
            this.$router.back()
          })
        }).catch(()=>{ //取消删除

        })
      }
    },
    deletePicture(pid){
      //this.$message.info("????")
      this.$api.collection.updateCollection(pid,this.albumId,false).then((res)=>{
        console.log('从相册删除图片：pid='+pid)
        console.log(res)
        this.total -= 1
        this.$refs.pictureContainer.changeList()
      })
    },
    submitAlbum(){
      this.$refs.albumForm.validate((value)=>{
        if(value){
          this.dialogFormVisible = false
          this.$api.album.updateAlbum(this.albumId,this.form.name,this.form.tip).then((res)=>{
            console.log('修改相册信息：aid='+this.albumId)
            console.log(res)
            this.album.name = this.form.name
            this.album.tip = this.form.tip
          })
        }
      })
    },
    changeBg(url){
      this.bgUrl = url
      //console.log("url:"+this.bgUrl)
    },
    cancelBg(){
      this.bgUrl = '/white.jpg'
    },
    goUserHomePage(uid){
      this.$router.push(`/user/${uid}`).catch((err)=>{console.log(err)})
    },
  }
}
</script>

<style scoped lang="less">
#AlbumDetail{
  width: 100%;
  height: 100%;
  .album-title{
    width: 95%;
    height: 40%;
    margin: 1% auto;
    position: relative;
    background-color: grey;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    .album-action{
      position: absolute;
      top: 10px;
      right: 10px;
    }
    .album-info{
      color: white;
      position: absolute;
      width: 100%;
      top: 10%;
      text-shadow: 1px 1px 3px #333333;
      text-align: center;
      .album-name{
        font-size: 3.5em;
      }
      .album-tip{
        font-size: 1.2em;
      }
    }
    .avatar{
      position: absolute;
      border-radius: 50%;
      right: 20px;
      bottom: 40px;
      width: 50px;
      height: 50px;
    }
    .user-info{
      color: white;
      position: absolute;
      bottom: 10px;
      right: 20px;
      text-shadow: 1px 1px 3px #333333;
      .user-name{
        font-size: 1.5em;
      }
    }
  }
}
</style>