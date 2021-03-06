import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import './assets/css/iconfont.css'
import axios from 'axios';
import ElementUI from 'element-ui'
Vue.use(ElementUI)
//配置请求等跟路径 
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
//设置http
Vue.prototype.$http = axios //全局挂载axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
