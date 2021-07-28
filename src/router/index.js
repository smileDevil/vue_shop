import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('../components/Login.vue')
  },
  {
    path: '/home',
    component: () => import('../components/Home.vue'),
    redirect:'/welcome',
    children:[
      {path:'/welcome', component:()=>import('../components/Welcome.vue')},
      {path:'/user', component:()=>import('../components/user/User.vue')},
      {path:'/roles', component:()=>import('../components/role/Roles.vue')},
      {path:'/rights', component:()=>import('../components/role/Rights.vue')},
      {path:'/cate', component:()=>import('../components/goods/Cate.vue')},
      {path:'/classifty',component:()=>import('../components/goods/ClassifyParameters.vue')}
    ]
  },
  {
    path:'/homes',
    component:()=> import('../components/Homes.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to 将要访问路径
  //from 表示从哪里来
  //next 一个函数表示放行  next 直接放行  next(‘/login’) 进入制定页面强制跳转
  if (to.path === '/login') return next()
  //获取token
  const tokenStr = window.sessionStorage.getItem("token")
  if (!tokenStr) return next('/login')
  next()
})
export default router
