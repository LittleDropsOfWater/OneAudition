import Vue from 'vue'
import App from './App'
import store from '@/store'
import mpvueToastRegistry from 'mptoast/src/registry'
Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$store=store;
Vue.prototype.$bus=new Vue();
mpvueToastRegistry(Vue)

const app = new Vue(App)
app.$mount()
