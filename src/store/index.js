import Vue from 'vue'
import Vuex from 'vuex'
import mp from './modules/mp'
import loginStore from './modules/loginStore'
import qrCodeStore from './modules/qrCodeStore'
import userStore from './modules/user'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    mp,
    loginStore,
    qrCodeStore,
    userStore,
  },
  getters
})

export default store
