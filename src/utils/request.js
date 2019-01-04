import axios from 'axios'
import store from '../store'
import CryptoJS from 'crypto-js/crypto-js'

// 密钥
var SECRET = process.env.SCREAT
// 创建axios实例
const service = axios.create({
    baseURL: process.env.BASE_API,
    headers: {
      Accept:"application/json, text/plain, */*",
      'Content-Type':'application/json'
    },
    timeout: 15000 // 请求超时时间
})

/**
 * request拦截器
 **/ 
service.interceptors.request.use(config => {
    if(config.timeout !== undefined){
      service.defaults.timeout = config.timeout
    }else{
      service.defaults.timeout = 15000
    }
    config.url = authFormat(config)
    return config
  },
  error => {
    // Do something with request error
    wx.hideLoading()
    console.log(error)
    Promise.reject(error)
})

/**
 * respone拦截器
 * */
service.interceptors.response.use(response => {
    if(undefined == response.statusCode) {
      wx.hideLoading()
      wx.showToast({title: '请求失败',icon: 'none', duration: 2000, mask: true})
    }

    const res = response.data
    if (res.code !== 200) {
      wx.hideLoading()
      //如果被登录了
      if (res.code === 150) {
        wx.showModal({ title: '提示', content: '登录超时，请重新登录',success (modeRes) {
            if (modeRes.confirm) {
              // TODO 清空所有的store，并且跳转到登录页面
              console.log('用户点击确定')
              wx.navigateTo({ url: "../login/main" });
            } else if (modeRes.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        wx.showToast({title: res.message,icon: 'none',duration: 2000, mask: true})
        return Promise.reject('error')
      }
    }
    wx.hideLoading()
    return response.data
  },
  error => {
    wx.hideLoading()
    return Promise.reject(error)
  }
)

/**
 * 拼接请求头，包括token、sign
 */
var authFormat = (config) => {
    var url = ''
    if(config.version != undefined){
      url = "/app/"+config.version+"/" + config.module + config.url  
    } else {
      url = "/app/v1.0/" + config.module + config.url
    }
    var timestamp = new Date().getTime()
    url += url.indexOf("?") == -1 ? ("?token=" + store.getters.token) : ("&token=" + store.getters.token)
    url += "&timestamp=" + timestamp
    var requestURI = url.split("?")[0]
    requestURI = url.startsWith("/") ? requestURI : "/" + requestURI
    requestURI = url.endsWith("/") ? requestURI.substring(0, requestURI.length - 1) : requestURI
    // 请求参数
    var args = new Array()
    var query = url.split("?")[1]
    var pairs = query.split("&")
    for (var i = 0; i < pairs.length; i++) {
      var pos = pairs[i].indexOf('=')
      if (pos == -1) continue
      var argname = pairs[i].substring(0, pos)
      var value = pairs[i].substring(pos + 1)
      value = decodeURIComponent(value)
      var arg = new Object()
      arg.key = argname
      arg.value = value
      args.push(arg)
    }
    args = args.sort(function (a, b) {
      return a.key > b.key ? 1 : -1
    })
    var paramstring = ""
    for (var index in args) {
      paramstring += args[index].key + args[index].value
    }
    // 非get方法的body添加
    var body = ""
    if("get" != config.method.toLowerCase() && config.data) {
      body = JSON.stringify(config.data)
    }
    var sign = CryptoJS.HmacMD5(requestURI + paramstring + body, SECRET)
    url = url + "&sign=" + sign
    return url
}

/**
 * 将普通的请求转发到调用微信
 */
service.defaults.adapter = (config => {
  return new Promise((resolve, reject) => {
      wx.request({
        url: config.url,
        method: config.method,
        data: config.data,
        timeout: config.timeout,
        header: config.headers,
        success: function(res) {
          resolve(res)
        },
        fail: function(res) {
          resolve(res)
        }
      })
  })
})

export default service