<template>
  <el-container class="Container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/appicon.png" alt="" />
        <span>电商后台管理习系统</span>
      </div>
      <el-button type="info" @click="loginout"> 退出</el-button>
    </el-header>
    <!-- 主题区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单 -->
        <el-menu
          :collapse-transition = "false"
          :collapse = "isCollapse"
          unique-opened 
          background-color="#333744"
          text-color="#fff"
          :default-active = "activePath"
          :router = "true"
        >
          <!-- 一级菜单 -->
          <el-submenu  :index= "index+ ''"  v-for="(item,index) in menulist" :key="index">
            <!-- 一级菜单的模版区域 -->
            <template slot="title">
              <!-- 一级菜单的图标 -->
              <i :class="item.icon"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

            <el-menu-item :index="subItem.path + ''" v-for="(subItem,subIndex) in item.children" :key="subIndex"  @click="saveNavState(subItem.path + '')">
              <template slot="title">
                <!-- 二级菜单的图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主要内容 -->
      <el-main>
        <!-- 路由站位符号 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'home',
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem("activePath")
  },
  data() {
    return {
      menulist:[
        {
          "authName":"用户管理",
          "icon":"iconfont icon-yonghu",
          "children":[{
            "authName":"用户列表",
            "path":"/user"
          }]
        },
        {
          "authName":"权限管理",
          "icon":"iconfont icon-quanxian",
          "children":[{
            "authName":"角色列表",
            "path":"/role"
          },
          {
            "authName":"权限列表",
            "path":"/roles"
          }]
        },
        {
          "authName":"商品管理",
          "icon":"iconfont icon-shangpin",
          "children":[{
            "authName":"商品列表",
            "path":"/role"
          },
          {
            "authName":"分类参数",
            "path":"/role"
          },
          {
            "authName":"商品分类",
            "path":"/role"
          }]
        },
        {
          "authName":"订单管理",
          "icon":"iconfont icon-icon-",
          "children":[{
            "authName":"订单列表",
            "path":"/role"
          }]
        },
        {
          "authName":"数据统计",
          "icon":"iconfont icon-shujutongji",
          "children":[{
            "authName":"统计列表",
            "path":"/role"
          }]
        }
      ],
      iconsObj:{
        '125':'iconfont icon-yonghu',
        '103':'iconfont icon-quanxian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-icon-',
        '145':'iconfont icon-shujutongji',
      },
      isCollapse:false,
      activePath:""
    }
  },
  methods: {
    loginout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const {data: res} = await this.$http.get('menus')
      console.log(res)
      if(res.meta.status !=200) {
        return this.$message.error(res.meta.msg)
      }else{
        // this.menulist = res.data
      }
    },
    // 点击按钮切换折叠与展开
    toggleCollapse(){
      this.isCollapse = !this.isCollapse
    },
    //保存选中的子项
    saveNavState(activePath){
      this.chooseIndex = activePath,
      window.sessionStorage.setItem("activePath",activePath)
    }
    
  },
}
</script>

<style lang="less" scoped>
.Container {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
  align-items: center;
  color: #fff;
  font-size: 20px;
  div {
    height: 100%;
    display: flex;
    align-items: center;
    img {
      widows: 35px;
      height: 35px;
    }
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  display: block;
  background-color: #333744;
  height: 100%;
  .el-menu{
    border-right: none;
  }
}


.el-main {
  background-color: #efedf1;
}

.toggle-button{
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.5em;
}
</style>