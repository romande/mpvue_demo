<template>
  <div class="body" v-show="pageShow">
    <img class="imgbg" src="../../../static/img/login_bg.png">

    <p class="title">掌上法云</p>

    <div class="userName">
      <img src="../../../static/img/user.png">
      <input v-model="username" placeholder="请输入用户名">
    </div>
    <div class="userName">
      <img src="../../../static/img/password.png">
      <input v-model="password" placeholder="请输入密码" password="true">
    </div>
    <button @click="submit">登 录</button>

    <div class="bottom">
      <img src="../../../static/img/logo.png">
      <p>苏州德启智能科技有限公司</p>
    </div>
  </div>
</template>

<script>
import store from "@/store";
import { apiLogin } from "@/api/system/login";
import { wechatLogin } from "@/api/system/wechat_login";
import { getUserUsageProduct } from "@/api/system/user";

export default {
  data() {
    return {
      pageShow: false,
      username: "testa",
      password: "123456"
    };
  },
  methods: {
    submit() {
      let openId = store.getters.openId;

      var user = {};
      user.userName = this.username;
      user.password = this.password;
      user.useOpenIdLogin = false;
      user.openId = openId;

      apiLogin(user).then(response => {
        console.log("小程序登录返回值");
        console.log(response);
        store.dispatch("setWechatUserInfo", response.result);
        store.dispatch("setWechatToken", response.security.token);

        //查询菜单权限
        getUserUsageProduct({}).then(usageProRes => {
          console.log("登录用户可用的菜单权限返回值");
          console.log(usageProRes.result);
          store.dispatch("setWechatUserUsageProduct", usageProRes.result);
          let productId = -1;
          for (var i = 0; i < usageProRes.result.length; i++) {
            if (usageProRes.result[i].productId == "201") {
              productId = 201;
            }
          }
          if (productId === 201) {
            //页面跳转
            wx.navigateTo({
              url: "../cabinet/cabinetCloud/main?productId=" + productId
            });
          } else {
              wx.showToast({title: "该帐户没有权限登录",icon: 'none',duration: 2000, mask: true})
          }
        });
      });
    }
  },

  /**
   * 小程序的顶级生命周期
   **/
  onLoad: function(options) {
    var me = this
    //获取openId
    wechatLogin()
    setTimeout(() => {
      me.pageShow = true
    }, 500);
  }
};
</script>

<style>
.body {
  width: 100%;
  height: 100%;
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.body button {
  background: #409eff;
  color: #fff;
  margin-top: 30px;
  border-radius: 5px;
  font-size: 16px;
  width: 80%;
  height: 40px;
}

.title {
  width: 100%;
  position: absolute;
  top: 15%;
  text-align: center;
  color: white;
  font-size: 24px;
}

.imgbg {
  position: absolute;
  z-index: -1;
  height: 100%;
  width: 100%;
  background-size: 100%;
}
.userName {
  border-radius: 5px;
  margin-bottom: 20px;
  width: 75%;
  height: 35px;
  background: white;
  display: flex;
  flex-flow: row;
  align-items: center;
  padding-left: 10px;
  font-size: 15px;
}
.userName img {
  width: 20px;
  height: 20px;
}
.userName input {
  margin-left: 10px;
  color: #000;
  line-height: 35px;
  text-align: left;
  height: 35px;
}
.bottom {
  position: absolute;
  bottom: 0px;
  display: flex;
  justify-content: center;
  height: 25px;
  padding-bottom: 5px;
}
.bottom img {
  height: 20px;
  width: 15px;
}
.bottom p {
  padding-top: 2px;
  font-size: 12px;
  margin-left: 10px;
  color: white;
}
</style>
