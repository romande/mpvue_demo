import store from '@/store'

export function wechatLogin() {
    wx.login({
        success(res) {
            if (res.code) {
                wx.request({
                    url: process.env.CENTER_URL+'/wechat/login',
                    method: 'POST',
                    data: {
                        code: res.code
                    },
                    success: function(res){
                        let response = res.data.result;
                        store.dispatch('setWechatOpenId', response.openId)
                    },
                    error: function(res){
                        console.log("获取openId失败")
                    }
                })
            } else {
                console.log('登录失败！' + res.errMsg)
            }
        }
    })
}