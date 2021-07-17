<template>
  <div>
    <!-- 面包屑导航去 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }" @click="clearActivePath()"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUsers()">
              <el-button slot="append" icon="el-icon-search" @click="getUsers()"> </el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
          </el-col>
        </el-row>
        <el-table :data="userlist" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="username" label="姓名"> </el-table-column>
          <el-table-column prop="mobile" label="电话"> </el-table-column>
          <el-table-column
            prop="create_time"
            label="创建时间"
          ></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column label="状态" width="70">
            <!-- 使用作用域插槽后 覆盖了prop中属性值, 所以可以删除 -->
            <template v-slot:default="scope">
              <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"> </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="190">
            <template >
              <!-- 修改 -->
              <el-tooltip
                class="item"
                effect="dark"
                content="修改 "
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  :enterable="false"
                ></el-button>
              </el-tooltip>

              <!-- 删除 -->
              <el-tooltip
                class="item"
                effect="dark"
                content="删除 "
                placement="top"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                ></el-button>
              </el-tooltip>
              <!-- 分配角色 -->
              <el-tooltip
                class="item"
                effect="dark"
                content="分配角色"
                placement="top"
              >
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  size="mini"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页区域 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[2, 5, 10, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
      </div>
    </el-card>
    <!-- 添加弹出框 -->
    <el-dialog
    title="新增用户"
    :visible.sync="addDialogVisible"
    width="50%"
    @close="addDialogClosed">
    <!-- 内容主题区域 -->
      <el-form 
      :model="addForm" 
      :rules="addFormRules" 
      ref="addFormRef" 
      label-width="70px" >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addForm.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="addForm.mobile"></el-input>
      </el-form-item>
      </el-form>
    <!-- 按钮区域 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getUsers()
  },
  data() {
    var checkEmail = (rule ,value ,cb) => {
      const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if(regEmail.test(value)){
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    var checkMobile = (rule ,value ,cb) => {
       const regMobile = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/

       if(regMobile.test(value)){
          return cb()
       }
      cb(new Error('请输入合法的号码'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2,
      },
      userlist: [],
      total: 0,
      addDialogVisible:false, // 显示或则隐藏新增
      // 添加用户的表单数据
      addForm:{
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username:[
          {required : true, message: "请输入用户名",trigger:'blur'},
          {min: 3,max: 11, message: '长度在 3 到 11 个字符',
            trigger: 'blur',
          },
        ],
        password:[
          {required : true, message: "请输入密码"},
          {min: 6,max: 8,message: '长度在 6 到 8 个字符',
            trigger: 'blur',
          },
        ],
        email:[
          {required : true, message: "请输入邮箱"},
          {
            validator:checkEmail,trigger:"blur"
          }
        ],
        mobile:[
          {required : true, message: "请输入手机号"},
           {
            validator:checkMobile,trigger:"blur"
          }
        ]
      }
    }
  },
  methods: {
    clearActivePath() {
      console.log('执行了操作')
      window.sessionStorage.setItem('activePath', '')
    },
    //获取用户信息
    getUsers() {
      this.$http
        .get('users', { params: this.queryInfo })
        .then((result) => {
          if (result.data.meta.status != 200) {
            return this.$message.error('获取数据失败')
          }
          const total = result.data.data.total
          this.total = total
          this.userlist = result.data.data.users
          console.log(result.data.data)
        })
        .catch((err) => {})
    },
    // 监听size改变的事件
    handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize
        this.getUsers()
    },
    //选中椰树改变
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getUsers()
    },
    //修改状态 row 第几行数据
    userStateChange(userInfo){
        console.log(userInfo)
      this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`).then((result) => {
         if(result.data.meta.status != 200){
           userInfo.mg_state = !userInfo.mg_state
           return this.$message.error("更新状态失败")
         }else{
            this.$message.success("刚更新状态成功")
         }
      }).catch((err) => {
         console.log(err)
      });
    },
    //关闭添加界面事件
    addDialogClosed(){

    }

  },
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
  width: 100%;
}
</style>