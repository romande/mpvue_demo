const userStore = {
    state: {
      userDetailInfo:{},
      userUsageProduct:{}
    },
    mutations: {
      SET_WECHAT_USER_DETAIL_INFO:(state,userDetailInfo) => {
        state.userDetailInfo = userDetailInfo
      },
      SET_WECHAT_USER_USAGE_PRODUCT:(state,userUsageProduct) => {
        state.userUsageProduct = userUsageProduct
      }
    },
    actions: {
      setWechatUserDetailInfo({ commit }, userDetailInfo) {
        commit('SET_WECHAT_USER_DETAIL_INFO',userDetailInfo)
      },
      setWechatUserUsageProduct({ commit }, userUsageProduct) {
        commit('SET_WECHAT_USER_USAGE_PRODUCT',userUsageProduct)
      }
    }
  }
  
  export default userStore
  