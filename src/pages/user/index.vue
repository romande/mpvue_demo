<template>
  <!-- <div class="body" :style="{height:fullHeight}">
    <div class="weui-cells weui-cells_form">

        <canvas style="width: 200px; height: 200px;" canvas-id="myQrcode"></canvas>

        <div class="weui-cell">
            <div class="weui-cell__hd"><label class="weui-label">用户名</label></div>
            <div class="weui-cell__bd">
                <input v-model="username" class="weui-input" type="text" placeholder="请输入用户名">
            </div>
        </div>
        
        <div class="weui-cell">
          <div class="weui-cell__hd"><label class="weui-label">密码</label></div>
          <div class="weui-cell__bd">
                <input v-model="password" class="weui-input" type="password" placeholder="请输入用户名">
          </div>
        </div>

        <div class="weui-cell">
          <button @click="submit()" class="weui-btn weui-btn_primary">登录</button>
        </div>
    </div>
 
 
  </div> -->
  <div>
      <div v-for="(item,index) in datas">
        {{item}}
      </div>
  </div>
</template>

<script>
import store from '@/store'
import drawQrcode from 'weapp-qrcode'
import { apiLogin } from '@/api/system/login'
import { wechatLogin } from '@/api/system/wechat_login'
import { getNoticeList } from '@/api/notice/notice'

export default {
  data () {
    return {
      username:'admin',
      password:'Abcd@1234',
      datas: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]
    }
  },
  onPullDownRefresh(){
    console.log("到顶了")
  },
  onReachBottom(){
    console.log("到底了")
    for(let i = 0; i < 10; i++){
      this.datas.push("新加载："+i)
    }
  },
  methods: {
    submit(){
      this.loadingHidden = true
      let openId = store.getters.openId
      
      var user = {}
      user.userName = this.username
      user.password = this.password
      user.useOpenIdLogin = false
      user.openId = openId

      // 二维码
      drawQrcode({
        width: 200,
        height: 200,
        canvasId: 'myQrcode',
        text: 'liyida'
      })
      
      store.dispatch('setIndexText', "取件码")
      store.dispatch('setQrcodeText', "liyidaliyidaliyidaliyidaliyidaliyidaliy")
      wx.navigateTo({url:"../qrcode/main"});
      
      // apiLogin(user).then(response => {
      //   store.dispatch('setWechatUserInfo',response.result)
      //   store.dispatch('setWechatToken', response.security.token)

      //   getNoticeList({}).then(response => {
      //       console.log(response)
      //   })
      // })
    },
  },
  //小程序的顶级生命周期
  onLoad:function (options) {
    wechatLogin()
  }
}
</script>

<style>
.body{
  height: 100%;
  padding: 100px 0 0;
  box-sizing: border-box ;
  position: relative;
  /* background-color: aquamarine; */
  background-size:100% 100%;
  /* background-image: url("../../img/login_bg.png") */
}
 
</style>
