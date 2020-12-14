import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/login'
  },
  {
    path:'/login',
    component:()=>import('../components/Login.vue')
  },
  {
    path:'/home',
    component:()=>import('../components/Home.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//挂载路由导航守卫
router.beforeEach((to,from,next) => {
  //to 将要访问路径
  //from 表示从哪里来
  //next 一个函数表示放行  next 直接放行  next(‘/login’) 进入制定页面强制跳转
  if(to.path==='/login') return next()
  //获取token
  const tokenStr =  window.sessionStorage.getItem("token")
  if(!tokenStr) return next('/login')
  next()
})
export default router
