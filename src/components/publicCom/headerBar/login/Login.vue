<template>
  <div id="Login">
    <!--登录-弹窗-->
    <el-form
        ref="loginForm"
        :model="loginForm"
        status-icon
        :rules="rules"
        label-width="100px"
        label-position="right"
    >
      <el-form-item :label="$t('message.Username')" prop="username">
        <el-input v-model="loginForm.username" :maxlength="10"/>
      </el-form-item>
      <el-form-item :label="$t('message.Password')" prop="password">
        <el-input v-model="loginForm.password" :maxlength="20"
            show-password type="password" autocomplete="off"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="resetPassword">
          {{ $t('message.ResetPassword') }}
        </el-button>
        <el-button type="primary" @click="submitForm('loginForm')">
          {{ $t('message.Login') }}
        </el-button>
      </el-form-item>
    </el-form>
    <el-dialog
        width="50%"
        title="修改密码"
        :visible.sync="isChangePwd"
        append-to-body>
      <el-form :model="form" label-width="100px">
        <el-form-item :label="$t('message.Phone')">
          <el-input v-model="form.phone" placeholder="请输入手机号" :maxlength="11">
            <template slot="append">
              <el-button :disabled="!isOvertime" type="primary" @click="getCode">
                {{ word }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('message.VerifyCode')">
          <el-input v-model="form.code" placeholder="输入验证码" :maxlength="6"></el-input>
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
import { mapGetters } from 'vuex';

export default {
  name: 'Login',
  components: {},
  data() {
    const checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入密码用户名'));
      }
      else{
        this.$api.user.checkUser(value).then((res) => {
          if (res.data !== true) {
            callback(new Error('用户不存在'));
          } else {
            callback();
          }
        });
      }
      callback();
    };
    // 密码验证
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      }
      callback();
    };

    return {
      // 登录数据
      loginForm: {
        username: '',
        password: '',
      },
      // 验证规则
      rules: {
        username: [
          { validator: checkName, trigger: 'blur' },
        ],
        password: [
          { validator: validatePass, trigger: 'blur' },
        ],
      },
      isChangePwd: false,
      form: {
        phone: '',
        code: '',
      },
      vCode: 'ojxhdy',
      word: '获取验证码',
      isOvertime: true,
    };
  },
  computed: {
    ...mapGetters([
      'serverAddress',
    ]),
  },
  watch: {},
  created() {

  },
  methods: {
    // 重置密码
    resetPassword() {
      this.isChangePwd = true
    },
    // 表单提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loginAjax();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 重置数据
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 登录
    async loginAjax() {
      const reqBody = {
        username: this.loginForm.username.trim(),
        password: this.loginForm.password,
      };
      const res = await this.$api.user.login(reqBody);
      console.log('login',res);
      if (res.data.name !== this.loginForm.username) {
        this.$message.closeAll();
        this.$message.info("密码错误");
        // this.loading = false;
        // this.getCode();
        return;
      }
      localStorage.setItem('user',JSON.stringify(res.data));
      console.log(localStorage.getItem('user'))
      //localStorage.removeItem('user')
      await this.$store.dispatch('setUser', res.data);
      await this.$store.dispatch('setLoginBoolean');
      await this.$store.dispatch('setIsLogined',true);
      this.$message.success("登录成功");
      //console.log(this.$store.state.user)
    },
    getCode(){
      const patrn = /^[1]([3-9])[0-9]{9}$/;
      if (this.form.phone === '') {
        this.$message.warning("请输入手机号")
      } else if (this.form.phone.length !== 11 || !patrn.test(this.form.phone)) {
        this.$message.warning('请输入合法手机号')
      } else {
        this.$api.user.checkPhone(this.form.phone).then((res) => {
          if (res.data === false) {
            this.$message.warning('此手机号未注册')
          } else {
            this.$api.user.getChangePwdCheckCode(this.form.phone).then((res)=>{
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
      if(this.vCode != this.form.code){
        return
      }
      this.$api.user.changePwdByPhone(this.form.phone).then((res)=>{
        console.log(res)
      })
      this.isChangePwd = false
    }
  },
};
</script>

<style scoped lang="less">

#Login {

}
</style>
