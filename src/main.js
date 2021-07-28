import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import './assets/css/iconfont.css'
import axios from 'axios'
import ElementUI from 'element-ui'
//table插件
import TreeTable from 'vue-table-with-tree-grid'


Vue.use(ElementUI)
//配置请求等跟路径 
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
// 设置拦截器 用来添加请求头验证
axios.interceptors.request.use(config => {
  //为请求头对象,添加token的验证Authorization字段 
  config.headers.Authorization = window.sessionStorage.getItem("token")
  return config
})
//设置http
Vue.prototype.$http = axios //全局挂载axios
Vue.config.productionTip = false
//table插件
Vue.component("tree-table", TreeTable);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
