import Vue from 'vue'
import App from './App'
import store from "./store"  // 引入store 对象
import '@/styles/weui.css'

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(
    store,
    App)
app.$mount()
