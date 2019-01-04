const qrCodeStore = {
    state: {
      qrcodeText:'',
      indexText:'二维码'
    },
    mutations: {
      SET_WECHAT_QRCODETEXT: (state,qrcodeText) => {
        state.qrcodeText = qrcodeText
      },
      SET_WECHAT_INDEXTEXT: (state,indexText) => {
        state.indexText = indexText
      }
    },
    actions: {
      setQrcodeText({ commit }, qrcodeText) {
        commit('SET_WECHAT_QRCODETEXT', qrcodeText)
      },
      setIndexText({ commit }, indexText) {
        commit('SET_WECHAT_INDEXTEXT', indexText)
      }
    }
  }
  
  export default qrCodeStore
  