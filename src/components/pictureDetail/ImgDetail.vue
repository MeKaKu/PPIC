<template>
  <div id="ImgDetail" v-if="picture">
    <div class="detail-image">
      <el-image :src="`${pictureBaseUrl}/picture/${picture.url}`" fit="scale-down" style="height: 100%;width: 100%"
                :preview-src-list="[`${pictureBaseUrl}/picture/${picture.url}`]">
        <div slot="placeholder" class="image-slot">
          加载中<span class="dot">...</span>
        </div>
      </el-image>
    </div>
    <el-row class="detail-action">
      <el-col :span="7" :offset="3" class="view-count">
        <i class="icon-browse"/>
        {{picture.view_count}}
      </el-col>
      <el-col :span="7" class="like-count" >
        <i v-if="isLiked" class="icon-favorites-fill" @click="handleLike" style="color: #E2264D"/>
        <i v-else class="icon-favorites" @click="handleLike" style="color: #666666"/>
        {{picture.like_count}}
      </el-col>
      <el-col :span="7" class="collect-count">
        <i v-if="collectCount === 0" class="icon-collection"  @click="handleCollect" style="color: #666666"/>
        <i v-else class="icon-collection-fill" @click="handleCollect" style="color: #ee9900"/>
        {{picture.collect_count}}
      </el-col>
    </el-row>
    <el-row class="date-row">
      <el-col class="date-col" :offset="3" :span="7">
        <i class="el-icon-time"></i>
        {{picture.date}}
      </el-col>
      <el-col class="from-user-col" :offset="7" :span="7" >
        <div @click="goUserHomePage(userInfo.uid)" style="cursor: pointer">
          <i class="el-icon-user" />
          {{userInfo.name}}
        </div>
      </el-col>
    </el-row>
    <div class="detail-tags">
      <pre v-for="(tag,ind) in tags" :key="ind">#{{tag}}   </pre>
    </div>
    <el-dialog title="收藏" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="选择相册" :label-width="formLabelWidth">
          <el-select v-model="form.aid" placeholder="请选择相册">
            <el-option v-for="(album,ind) in albums" :key="ind" :label="album.name" :value="album.aid">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="form.aid!==''" type="primary" @click="submitCollect">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: "ImgDetail",
  data(){
    return {
      picture: null,
      isLiked: false,
      pid: parseInt(this.$route.params.pid),
      albums: [],
      collectCount: 0,
      form: {
        aid: '',
      },
      formLabelWidth: '120px',
      dialogFormVisible: false,
      userInfo: {},
    }
  },
  computed: {
    ...mapGetters(['user','pictureBaseUrl']),
    tags(){
      return this.picture.tag.split("#").filter((tag)=>tag!=='')
    }
  },
  methods: {
    getPicture(){
      this.$api.pictureLiked.getIsUserLikedPicture(this.user.uid,this.pid).then((res)=>{
        //console.log(res.data)
        this.isLiked = res.data
      })
      this.$api.picture.getPictureDetail(this.pid,true).then((res)=>{
        //console.log(res)
        this.picture = res.data
        this.$api.user.getUserByUid(res.data.uid).then((userRes)=>{
          this.userInfo = userRes.data
        })
      })
    },
    getAlbums(){
      this.$api.album.getAllAlbumByUid(this.user.uid,this.pid).then((res)=>{
        console.log("请求用户所有相册列表：")
        console.log(res)
        this.albums = res.data
        this.albums.forEach((album)=>{
          if(album.collected === true){
            this.collectCount += 1
          }
        })
      })
    },
    handleLike() {
      this.isLiked = !this.isLiked;
      console.log(this.isLiked)
      this.picture.like_count += this.isLiked?1:-1
      this.$api.pictureLiked.updatePictureLiked(this.user.uid,this.pid,this.isLiked)
    },
    handleCollect(){
      this.dialogFormVisible = true
    },
    submitCollect(){
      this.dialogFormVisible = false
      this.$api.collection.updateCollection(this.pid,this.form.aid,true).then((res)=>{
        console.log(this.form.aid)
        console.log("更新收藏情况：")
        console.log(res)
        if(this.collectCount === 0){
          this.picture.collect_count += 1
        }
        this.collectCount += 1
      })
    },
    goUserHomePage(uid){
      this.$router.push(`/user/${uid}`).catch((err)=>{console.log(err)})
    }
  },
  created() {
    this.getPicture()
    this.getAlbums()
  },
}
</script>

<style scoped lang="less">
#ImgDetail{
  width: 70vw;
  height: 95vh;
  .detail-image{
    width: 100%;
    height: 70%;
  }
  .detail-action{
    width: 80%;
    height: 5%;
    margin: 3% 10% 0 10%;
    .view-count{
      height: 100%;
      color: #666666;
      i{
        font-size: 30px;
        vertical-align: middle;
        color: #666666;
      }
    }
    .like-count{
      height: 100%;
      color: #666666;
      cursor: pointer;
      i{
        font-size: 30px;
        vertical-align: middle;
      }
    }
    .collect-count{
      height: 100%;
      color: #666666;
      cursor: pointer;
      i{
        font-size: 30px;
        vertical-align: middle;
        color: #666666;
      }
    }
  }
  .date-row{
    width: 80%;
    height: 3%;
    margin: 1% 10% 0 10%;
    .date-col{
      height: 100%;
      color: #909399;
      i{
        font-size: 15px;
        vertical-align: middle;
        color: #909399;
      }
    }
    .from-user-col{
      height: 100%;
      color: #909399;
      i{
        font-size: 15px;
        vertical-align: middle;
        color: #909399;
      }
    }
  }
  .detail-tags{
    height: 14%;
    width: 70%;
    margin: 1% 15% 4% 15%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    //border: 1px solid #fffdef;
    pre{
      color: #409EFF;
      font-size: 120%;
    }
  }
}
</style>