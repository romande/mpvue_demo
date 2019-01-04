const loginStore = {
    state: {
      openId:'',
      token:'',
      userInfo:{}
    },
    mutations: {
      SET_WECHAT_OPENID: (state,openId) => {
        state.openId = openId
      },
      SET_WECHAT_TOKEN: (state,token) => {
        state.token = token
      },
      SET_WECHAT_USER_INFO:(state,userInfo) => {
        state.userInfo = userInfo
      }
    },
    actions: {
      setWechatOpenId({ commit }, openId) {
        commit('SET_WECHAT_OPENID', openId)
      },
      setWechatToken({ commit }, token) {
        commit('SET_WECHAT_TOKEN', token)
      },
      setWechatUserInfo({ commit }, userInfo) {
        commit('SET_WECHAT_USER_INFO',userInfo)
      }
    }
  }
  
  export default loginStore
  