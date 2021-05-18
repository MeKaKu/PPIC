<template>
  <div id="userHome">
    <div class="user-title" :style="backgroundStyle">
      <img :src="this.pictureBaseUrl+'/user/'+userInfo.url" :alt="userInfo.name" class="avatar">
      <div class="user-info">
        <div class="user-name">{{userInfo.name}}</div>
        <div class="user-tip">{{userInfo.tip}}</div>
      </div>
    </div>
    <div class="user-control">
      <el-tabs v-model="activeName" class="control-tab">
        <el-tab-pane label="用户信息" name="first" class="tab-userinfo">
          <p style="margin-top: 30px"><b>用户名：</b> {{userInfo.name}}</p>
          <p style="margin-top: 20px"><b>性别：</b> {{userInfo.sex}}</p>
          <p style="margin-top: 20px"><b>电话：</b> {{userInfo.phone}}</p>
          <p style="margin-top: 20px"><b>注册时间：</b> {{userInfo.date}}</p>
          <p v-if="userInfo.tip" style="margin-top: 20px;word-wrap:break-word;word-break:normal;"><b>简介：</b> {{userInfo.tip}}</p>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="second">
          <com-collection :width="width" :items="items" :total="total" @getItemList="getItemList">
            <template v-slot:cell="props">
              <com-item :item="props.data" />
            </template>
          </com-collection>
        </el-tab-pane>
        <el-tab-pane label="喜欢图片" name="third">
          <com-collection :width="width" :items="pictures" :total="pTotal" @getItemList="getPictureList">
            <template v-slot:cell="props">
              <com-item :item="props.data" />
            </template>
          </com-collection>
        </el-tab-pane>
        <el-tab-pane label="相 册" name="fourth">
          <com-collection :width="width" :items="albums" :total="aTotal" @getItemList="getAlbumList">
            <template v-slot:cell="props">
              <album-item :item="props.data" />
            </template>
          </com-collection>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import ComCollection from "@/components/publicCom/ComCollection";
import ComItem from "@/components/publicCom/ComItem";
import AlbumItem from "@/components/album/AlbumItem";
import { getClient } from '@/utils/dom';
import {mapGetters} from "vuex";
export default {
  name: "index",
  components: {
    ComCollection,
    ComItem,
    AlbumItem,
  },
  data(){
    return {
      activeName: 'first',
      userInfo: {
        url: '/user-undefined.jpg'
      },
      forUid: parseInt(this.$route.params.uid),
      isLocalUser: false,
      width: 0,
      total: 0,//用户上传的图片数
      items: [],//上传的图片
      pTotal: 0,//用户点赞的图片数
      pictures: [],//点赞的图片
      aTotal: 0,//用户创建的相册数
      albums: [],//用户相册
    }
  },
  computed: {
    ...mapGetters(['user','pictureBaseUrl']),
    backgroundStyle(){
      return {
        'background-image': `url("${this.pictureBaseUrl}/user/${this.userInfo.url}")`,
      }
    },
  },
  methods: {
    getItemList(startIndex,pageSize,cWidth,cHeight){
      this.$api.picture.getPictureListByUid(this.forUid,startIndex,pageSize).then((res)=>{
        console.log("个人主页-请求上传的图片列表：startIndex="+startIndex)
        console.log(res)
        this.items = res.data
        this.items.forEach((item)=>{
          item.height = cHeight
          item.width = cWidth
        })
      })
    },
    getPictureList(startIndex,pageSize,cWidth,cHeight){
      this.$api.picture.getPictureLikedByUser(this.forUid,startIndex,pageSize).then((res)=>{
        console.log("个人主页-请求点赞的图片列表：startIndex="+startIndex)
        console.log(res)
        this.pictures = res.data
        this.pictures.forEach((picture)=>{
          picture.width = cWidth
          picture.height = cHeight
        })
      })
    },
    getAlbumList(startIndex,pageSize,cWidth,cHeight){
      this.$api.album.getAlbumByUid(this.forUid,startIndex,pageSize).then((res)=>{
        console.log("个人主页-请求相册：startIndex="+startIndex)
        console.log(res)
        this.albums = res.data
        this.albums.forEach((album)=>{
          album.width = cWidth
          album.height = cHeight
        })
      })
    },
  },
  created() {
    this.width = getClient().width * 0.64
    this.isLocalUser = (this.forUid === this.user.uid)
    //获取用户信息
    if(this.isLocalUser){
      this.userInfo = this.user
    }
    else{
      this.$api.user.getUserByUid(this.forUid).then((res)=>{
        console.log(res)
        this.userInfo = res.data
      })
    }
    //获取total上传图片数
    this.$api.picture.getPictureCountByUid(this.forUid).then((res)=>{
      //console.log("个人主页-请求用户上传图片数：")
      //console.log(res.data)
      this.total = res.data
    })
    //获取pTotal点赞图片数
    this.$api.pictureLiked.getPictureLikedCount(this.forUid).then((res)=>{
      this.pTotal = res.data
    })
    //获取相册数
    this.$api.album.getAlbumCount(this.forUid).then((res)=>{
      this.aTotal = res.data
    })
  }
}
</script>

<style scoped lang="less">
#userHome{
  width: 100%;
  height: 100%;
  .user-title{
    width: 80%;
    height: 30%;
    margin: 1% 10% 0 10%;
    position: relative;
    background-color: grey;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    .avatar{
      position: absolute;
      border-radius: 50%;
      left: 30px;
      bottom: 25px;
      height: 64px;
      width: 64px;
    }
    .user-info{
      color: white;
      position: absolute;
      bottom: 40px;
      left: 100px;
      text-shadow: 1px 1px 3px #333333;

      .user-name{
        font-size: 1.5em;
      }
      .user-tip{
        font-size: 0.875em;
      }
    }
  }
  .user-control{
    width: 80%;
    margin: 0 10%;
    //border: 2px solid #666666;
    .control-tab{
      margin-top: 2%;
      .tab-userinfo{
        p{
          margin-left: 20px;
        }
      }
    }
  }
}
</style>