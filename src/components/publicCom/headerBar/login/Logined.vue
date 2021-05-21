<template>
  <div id="logined">
    <el-badge :value="msgCount" class="msg-but" type="primary" :hidden="msgCount===0">
      <el-tooltip class="item" effect="dark" content="消息" placement="bottom">
        <i class="el-icon-message" style="font-size: 1.8em" @click="goMsg"></i>
      </el-tooltip>
    </el-badge>
    <el-dropdown trigger="hover" @command="clickMenu">
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
            v-for="item of MenuList"
            :key="item.handler"
            :command="item.handler"
            :divided="item.divided">
          {{ item.name }}
        </el-dropdown-item>
      </el-dropdown-menu>
      <div>
        <el-avatar :src="pictureUrl+'/user/'+user.url" fit="cover" shape="square" style="cursor: pointer"/>
      </div>
    </el-dropdown>
    <!-- 修改个人信息弹出框 -->
    <el-dialog
        title="修改头像"
        :visible.sync="dialogVisible"
        :before-close="beforeClose"
        width="50%"
        center>
      <el-upload
          class="avatar-uploader"
          :action="`${$store.getters.serverAddress}/User/UploadUserIcon`"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :on-error="handleAvatarError"
          :on-change="addedFile"
          accept="image/jpeg"
          :auto-upload="false"
          :data="data"
          :disabled="disabled"
          ref="upload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar" alt="">
        <img v-else :src="pictureUrl+'/user/'+user.url" class="avatar" alt="">
        <i class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>

      <el-form ref="form" :model="form" label-width="80px" style="margin-top: 20px">
        <el-form-item label="用户名">
          <el-input v-model="form.name" disabled :maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="form.tip" type="textarea" autosize :maxlength="100"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button type="primary" @click="submitEdit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改密码弹出框 -->
    <el-dialog
        width="50%"
        title="修改密码"
        :visible.sync="isChangePwd"
        append-to-body>
      <el-form :model="formPwd" label-width="100px">
        <el-form-item :label="$t('message.Phone')">
          <el-input v-model="formPwd.phone" placeholder="请输入手机号" :maxlength="11">
            <template slot="append">
              <el-button :disabled="!isOvertime" type="primary" @click="getCode">
                {{ word }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('message.VerifyCode')">
          <el-input v-model="formPwd.code" placeholder="输入验证码" :maxlength="6"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelChange">取 消</el-button>
        <el-button type="primary" @click="submitChange">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import cookie from 'js-cookie';
export default {
  name: "Logined",
  data(){
    return {
      pictureUrl: this.$store.getters.pictureBaseUrl,
      imageUrl: '',
      dialogVisible: false,
      disabled: false,
      form: {
        name: '',
        sex: '',
        tip: '',
      },
      data: {
        name: '',
        sex: '',
        uid: 0,
      },
      isChangePwd: false,
      formPwd: {
        phone: '',
        code: '',
      },
      word: '获取验证码',
      isOvertime: true,
      vCode: 'ojxhdy',
    }
  },
  computed:{
    ...mapGetters(['user','msgCount']),
    MenuList() {
      return [
        {
          name: this.$t('message.UserHomePage'),
          handler: 'homePage',
        },
        {
          name: '修改个人信息',
          handler: 'editInfo'
        },
        {
          name: '修改密码',
          handler: 'changePwd'
        },
        {
          name: this.$t('message.Logout'),
          handler: 'logout',
          divided: true,
        },
      ];
    },
  },
  methods: {
    clickMenu(handler){
      console.log(handler)
      if(handler === 'editInfo'){
        this.form.name = this.user.name
        //this.form.sex = this.user.sex
        //this.form.tip = this.user.tip
        this.form.sex = this.user.sex==='男'?'男':'女'
        this.form.tip = this.user.tip
        this.imageUrl = ''
        this.disabled = false
        this.dialogVisible = true
      }
      else if(handler === 'changePwd'){
        this.isChangePwd = true
      }
      else if(handler === "homePage"){
        this.$router.push("/user/"+this.user.uid).catch((err)=>{console.log(err)})
      }
      else if(handler === "logout"){
        //this.$store.dispatch("setIsLogined",false)
        //this.$store.dispatch("setUser",{})
        cookie.remove('jwt')
        localStorage.removeItem('user')
        this.$store.dispatch('setUser',{})
        this.$store.dispatch('setIsLogined',false)
        let routeHistory=history.length-2;
        if(routeHistory<0) routeHistory=0;
        this.$router.go(-routeHistory);
        this.$router.push("/home").catch(()=>{})
      }
    },
    addedFile(file){
      console.log(file)
      if(file.size > 5*1024*1024){
        this.$message.error("图片大小不能超过5M")
        this.$refs.upload.remove(file)
        return
      }
      if(file && file.status === 'ready'){
        this.imageUrl =  URL.createObjectURL(file.raw);
        this.disabled = true
      }
    },
    handleAvatarSuccess(){
      this.$message.success("修改成功")
      this.$refs.upload.clearFiles()
      this.imageUrl = ''
      this.$api.user.getUserByUid(this.user.uid).then((res)=>{
        //this.$store.dispatch('setUser',res.data)
        localStorage.removeItem('user')
        localStorage.setItem('user',JSON.stringify(res.data))
        this.$router.push('/home').catch((err)=>{console.log(err)})
        location.reload()
      }).catch(()=>{
        this.$message.error("获取用户失败")
      })
    },
    handleAvatarError(){
      this.$message.error("修改失败")
      this.$refs.upload.clearFiles()
      this.imageUrl = ''
    },
    submitEdit(){//提交修改
      this.data.sex = this.form.sex
      this.data.tip = this.form.tip
      this.data.uid = this.user.uid
      if(this.imageUrl){
        this.$refs.upload.submit()
      }
      else{
        this.$api.user.updateUserInfo(this.user.uid,this.form.sex,this.form.tip).then((res)=>{
          console.log("请求修改个人信息")
          console.log(res)
          //this.$store.dispatch('setUser',res.data)
          //localStorage.removeItem('user')
          this.$message.success("修改成功")
          localStorage.setItem('user',JSON.stringify(res.data))
          this.$router.push('/home').catch((err)=>{console.log(err)})
          //location.reload()
        }).catch(()=>{
          this.$message.error("修改个人信息失败")
        })
      }
      this.dialogVisible = false
    },
    cancelEdit(){
      this.$refs.upload.clearFiles()
      this.imageUrl = ''
      this.dialogVisible = false
    },
    beforeClose(){
      this.$refs.upload.clearFiles()
      this.dialogVisible = false
    },
    getCode(){
      const patrn = /^[1]([3-9])[0-9]{9}$/;
      if (this.formPwd.phone === '') {
        this.$message.warning("请输入手机号")
      } else if (this.formPwd.phone.length !== 11 || !patrn.test(this.formPwd.phone)) {
        this.$message.warning('请输入合法手机号')
      } else {
        this.$api.user.checkPhone(this.formPwd.phone).then((res) => {
          if (res.data === false) {
            this.$message.warning('此手机号未注册')
          } else {
            this.$api.user.getChangePwdCheckCode(this.formPwd.phone).then((res)=>{
              this.vCode = res.data
              //this.$message.info("验证码："+this.vCode)
              this.isOvertime = false;
              let time = 60;
              this.word = `重新发送${time}(s)`;
              const sendTimer = setInterval(() => {
                this.isOvertime = false;
                time -= 1;
                this.word = `重新发送${time}(s)`;
                if (time < 0) {
                  this.isOvertime = true;
                  clearInterval(sendTimer);
                  this.word = '获取验证码';
                }
              }, 1000);
            })
          }
        });
      }
    },
    cancelChange(){
      this.isChangePwd = false
    },
    submitChange(){
      if(this.vCode != this.formPwd.code){
        return
      }
      this.$api.user.changePwdByPhone(this.formPwd.phone).then((res)=>{
        console.log(res)
      })
      this.isChangePwd = false
    },
    goMsg(){
      this.$router.push('/msg').catch(()=>{})
    }
  }
}
</script>

<style scoped>
.avatar-uploader  {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  height: 178px;
  width: 178px;
  left: 50%;
  margin-left: -89px;
}
.avatar-uploader:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
#logined{
  display: flex;
  align-items: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.msg-but{
  display: inline-block;
  text-align: center;
  font-size: 14px;
  margin-right: 30px;
  color: #777777;
  cursor: pointer;
  height: 20px;
}
</style>