<template>
  <div id="login">
    <!---->
    <div style="margin-left:20px;">
      <!--用户已经登录-->
      <Logined v-if="isLogined" />
      <!--未登录-->
      <div v-else class="loginOrRegister">
        <!--登录按钮-->
        <span class="button-text" @click="Login">
          {{ $t('message.Login') }}
        </span>
        <!--注册按钮-->
        <span class="button-text" @click="Register">
            {{ $t('message.Register') }}
          </span>
      </div>
    </div>
    <!-- 登录注册-弹出框（点击登录注册时弹出） -->
    <el-dialog
        v-if="$store.getters.loginBoolean"
        :close-on-click-modal="false"
        :visible="$store.getters.loginBoolean"
        width="600px"
        :title="`${loginOrSign?$t('message.Login'):$t('message.Register')}`"
        center
        @close="$store.dispatch('setLoginBoolean')"
    >
      <login-form v-show="loginOrSign" />
      <register-form v-show="!loginOrSign" />
    </el-dialog>
  </div>
</template>

<script>
import LoginForm from './Login';
import RegisterForm from './Register';
import Logined from './Logined';
import {mapGetters} from "vuex";
import cookie from 'js-cookie';

export default {
  name: 'Login',
  components: {
    LoginForm,
    RegisterForm,
    Logined,
  },
  computed: {
    ...mapGetters(['user','isLogined']),
    loginOrSign() {
      return this.$store.getters.loginOrSign;
    },
  },
  methods: {
    Login(){
      if(!cookie.get('jwt')){
        this.$store.dispatch('setLoginBoolean', true);
      }
    },
    Register(){
      if (!cookie.get('jwt')) {
        this.$store.dispatch('setLoginBoolean', false);
      }
    },
  }
};
</script>

<style scoped lang="less">
#login {
  display: flex;
  overflow: hidden;
  justify-content: flex-end;
  align-items: center;
  .button-text {
    user-select: none;
    transition: background 20ms ease-in 0s;
    cursor: pointer;
    padding: 4px 10px;
    border-radius: 3px;
    flex-shrink: 0;
    font-size: 15px;
    margin-left: 2px;
    margin-right: 2px;
    font-weight: 500;
    width: auto;

    &:hover {
      background: rgba(55, 53, 47, 0.16);
    }
  }
}
</style>