<template>
  <div class="body">
    <div id="canvas_fa">
      <div id="canva_qr_code">
        <canvas v-show="showQRCode" id="canva" canvas-id="myQrcode"></canvas>
        <span v-show="!showQRCode" id="errorMsg">生成二维码失败，请返回重试！</span>
      </div>
    </div>
    <div style="color:#fff; margin-top:10px; padding-bottom:80px;">
      {{indexText}}
    </div>
    <div style="width:60px; height:60px;" @click="navigateBack">
      <img src="../../../static/img/close.png" style="align-items: center; width:50px; height:50px;"/>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import drawQrcode from 'weapp-qrcode'

export default {
    data() {
    return {
      indexText: '二维码',
      showQRCode: true,
    };
  },
  //小程序初始化完成后，触发onShow方法
  onShow:function () {
    // 默认二维码的宽高
    var codeWidth = 185
    // 二维码下的描述文字
    this.indexText = store.getters.indexText
    // 二维码内容
    let qrcodeText = store.getters.qrcodeText

    if(qrcodeText === undefined || qrcodeText === null || qrcodeText === '') {
      //提示二维码内容错误
      this.showQRCode = false;
    } else {
      try {
        // 获取屏幕宽度，保证二维码的大小是自适应
        const res = wx.getSystemInfoSync()
        console.log(res.windowWidth)
        codeWidth = res.windowWidth * 0.57
      } catch (e) {
        console.log("获取屏幕的宽度失败,二维码宽高为185")
      }
      //生成二维码
      drawQrcode({
        width: codeWidth,
        height: codeWidth,
        canvasId: 'myQrcode',
        text: qrcodeText
      })
    }
  },
  methods: {
    navigateBack(){
      wx.navigateBack({
        delta: 1
      })
    }
  }
}
</script>

<style>
.body{
  width: 100%;
  height: 100%;
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color:#717171;
}
#canvas_fa{
  width:65%;
  height:  65vw;
  background-size: 100%;
  background-color:#fff;
  margin-top:50px;
  text-align: center;
}
#canva_qr_code{
  width:90%;
  height:90%;
  margin:0 auto;
  margin-top:6%;
}
#canva{
  width: 100%;
  height: 100%;
}
#errorMsg{
  font-size:14px;
  color:red;
}
</style>
