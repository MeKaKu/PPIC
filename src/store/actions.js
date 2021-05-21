export default {
  setLoginBoolean : ({ commit }, param = true) => {
    commit('setLoginBoolean', param);
  },
  // setDetail: ({commit},param) =>{
  //   commit('setDetail',param);
  // },
  setUser: ({commit},param) => {
    commit('setUser',param);
  },
  setIsLogined: ({commit},param) => {
    commit('setIsLogined',param);
  },
  setIsDelete: ({commit},param) => {
    commit('setIsDelete',param)
  },
  setMsgCount: ({commit},param) => {
    commit('setMsgCount',param)
  },
}