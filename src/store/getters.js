const getters = {

  openId: state => state.loginStore.openId,
  token: state => state.loginStore.token,
  userInfo: state => state.loginStore.userInfo,

  qrcodeText: state => state.qrCodeStore.qrcodeText,
  indexText: state => state.qrCodeStore.indexText,

  userDetailInfo: state => state.userStore.userDetailInfo,

  pageX: state => state.mpdata.pageX,
  pageY: state => state.mpdata.pageY
}
export default getters
