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

//构造一个全局过滤器 过滤时间轴、
Vue.filter('dateFormat',function(originVal){
  const dt = new Date(originVal)
  const year = dt.getFullYear()
  //默认月份从0 开始 所以要+1
  const month = (dt.getMonth() + 1 + '').padStart(2,'0')//padStart(2,'0')补足 ,希望字符串有2位,不足2位用0填充
  const d = (dt.getDate() + '').padStart(2,'0')
  const hh = (dt.getHours() + '').padStart(2,'0')
  const mm = (dt.getMinutes() + '').padStart(2,'0')
  const ss = (dt.getSeconds() + '').padStart(2,'0')
  return `${year}-${month}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
