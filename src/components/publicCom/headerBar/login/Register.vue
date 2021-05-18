<template>
  <div id="register">
    <el-form
        ref="ruleForm"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
        label-position="left"
    >
      <el-form-item :label="$t('message.Username')" prop="username">
        <el-input v-model="ruleForm.username" :maxlength="10"/>
      </el-form-item>
      <el-form-item :label="$t('message.Sex')" >
        <el-radio-group v-model="ruleForm.sex">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('message.Password')" prop="password">
        <el-input v-model="ruleForm.password" :maxlength="20" show-password type="password" autocomplete="off"/>
      </el-form-item>
      <el-form-item :label="$t('message.CheckPassword')" prop="checkPass">
        <el-input v-model="ruleForm.checkPass" :maxlength="20" show-password type="password" autocomplete="off"/>
      </el-form-item>
      <el-form-item :label="$t('message.Phone')" prop="phone">
        <el-row type="flex" justify="space-between" :gutter="16">
          <el-col>
            <el-input v-model="ruleForm.phone" placeholder="手机号" :maxlength="11">
              <template slot="append">
                <el-button :disabled="!isOvertime" type="primary" :loading="loading" @click="getCode">
                  {{ word }}
                </el-button>
              </template>
            </el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('message.PhoneCode')" prop="phoneCode">
        <el-row type="flex" justify="space-between" :gutter="16">
          <el-col>
            <el-input v-model="ruleForm.phoneCode" placeholder="短信验证码(需手机获取)" :maxlength="6"/>
          </el-col>
        </el-row>
      </el-form-item>
      <div style="display: flex;justify-content: center">
        <el-button type="primary" :loading="loading" @click="submitForm('ruleForm')">
          {{ $t('message.Register') }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  username: 'Register',
  components: {},
  data() {
    // 用户名验证函数
    const checkName = (rule, value, callback) => {
      const patrn = /[`~!@#$%^&*()\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、][\s]/im;
      if (!value) {
        return callback(new Error('用户名不能为空'));
      }
      if (patrn.test(value)) {
        return callback(new Error('用户名不能包含特殊字符'));
      }
      if (value.length < 2) {
        return callback(new Error('用户名应为2-10位'));
      }
      this.$api.user.checkUser(value).then((res) => {
        //console.log(res)
        if (res.data !== false) {
          callback(new Error('此用户名已被注册'));
        } else {
          callback();
        }
      });
    };
    // 密码验证
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        if (value.length < 6) {
          callback(new Error('密码应为6-20位'));
        }
      }
      callback();
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    // const checkCode = (rule, value, callback) => {
    //   if (!value) {
    //     callback(new Error('请输入验证码'));
    //   } else {
    //     callback();
    //   }
    // };
    const checkPhone = (rule, value, callback) => {
      const patrn = /^[1]([3-9])[0-9]{9}$/;
      if (value === '') {
        callback(new Error('请输入手机号'));
      } else if (value.length !== 11 || !patrn.test(value)) {
        callback(new Error('请输入合法手机号'));
      } else {
        this.$api.user.checkPhone(value).then((res) => {
          if (res.data !== false) {
            callback(new Error('此手机号不可用'));
          } else {
            //this.isOvertime = true
            callback();
          }
        });
      }
    };
    return {
      word: '获取验证码',
      isOvertime: true,
      loading: false,
      vCode: 'ojxhdy',
      // 表格数据
      ruleForm: {
        password: '',//密码
        checkPass: '',//确认密码
        username: '',//用户名
        //verifyCode: '',
        phoneCode: '',//手机验证码
        phone: '',//手机号
        sex: '男',
      },
      // 验证规则
      rules: {
        password: [
          { validator: validatePass, trigger: 'blur' },
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' },
        ],
        username: [
          { validator: checkName, trigger: 'blur' },
        ],
        // phoneCode: [
        //   { validator: checkCode, trigger: 'blur' },
        // ],
        phone: [
          { validator: checkPhone, trigger: 'blur' },
        ],
      },
    };
  },
  computed: {},
  watch: {},
  mounted() {
    //this.getCode();
  },
  methods: {
    // 获取验证码
    getCode() {
      const patrn = /^[1]([3-9])[0-9]{9}$/;
      if (this.ruleForm.phone === '') {
        this.$message.warning("请输入手机号")
      } else if (this.ruleForm.phone.length !== 11 || !patrn.test(this.ruleForm.phone)) {
        this.$message.warning('请输入合法手机号')
      } else {
        this.$api.user.checkPhone(this.ruleForm.phone).then((res) => {
          if (res.data !== false) {
            this.$message.warning('此手机号已注册')
          } else {
            this.$api.user.getRegisterCheckCode(this.ruleForm.phone).then((res) => {
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
            });
          }
        })
      }
    },
    // 表单提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.register();
          return true;
        }
        return false;
      });
    },
    // 重置数据
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 注册
    register() {
      if(this.vCode != this.ruleForm.phoneCode){
        console.log('vCode',this.vCode)
        console.log('phoneCode',this.ruleForm.phoneCode)
        this.$message.warning("手机验证码错误")
        return
      }
      this.loading = true
      const data = {
        name: this.ruleForm.username.trim(),
        pwd: this.ruleForm.password,
        sex: this.ruleForm.sex,
        phone: this.ruleForm.phone,
        tip: '',
      };
      this.$api.user.register(data).then((res) => {
        if (res.status === 200) {
          console.log(res);
          this.$store.dispatch('setUser', res.data);
          this.$store.dispatch('setLoginBoolean');
          this.$message.success("注册成功");
        } else {
          this.$message.closeAll();
          this.$message.warning("注册失败");
        }
      })
      .catch((err) => {
        console.error(err);
      });
      this.loading = false;
      //this.getCode();
    },
  },
};
</script>

<style scoped lang="less">

#register{}

</style>
