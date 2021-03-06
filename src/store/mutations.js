export default {
  setLoginBoolean: (state, param) => {
    state.loginOrSign = param;
    state.loginBoolean = !state.loginBoolean;
  },
  // setDetail: (state, param) => {
  //   state.detail = param;
  // },
  setUser: (state, param) => {
    state.user = param;
  },
  setIsLogined: (state,param) => {
    state.isLogined = param;
  },
  setIsDelete: (state,param) => {
    state.isDelete = param
  },
  setMsgCount: (state,param) => {
    state.msgCount = param
  },
  descMsgCount: (state,param = 1) => {
    state.msgCount -= param
  },
}