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
    <el-card class="box-card">
      <div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input
              placeholder="请输入内容"
              clearable
              v-model="queryInfo.query"
              @clear="getUserList()"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getUserList()"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true"
              >新增用户</el-button
            >
          </el-col>
        </el-row>
        <el-table :data="userlist" border stripe>
          <el-table-column type="index" fixed></el-table-column>
          <el-table-column prop="username" label="姓名" width="120px">
          </el-table-column>
          <el-table-column prop="mobile" label="电话" width="140px">
          </el-table-column>
          <el-table-column prop="role_name" label="角色" width="100px">
          </el-table-column>
          <el-table-column prop="email" label="邮箱" width="180px">
          </el-table-column>
          <el-table-column label="状态" width="70px">
            <!-- 作用域插槽 v-slot:default="scope" 接受数据 scope.row则是当前这行数据 -->
            <template v-slot:default="scope">
              <el-switch
                v-model="scope.row.mg_state"
                @change="userStateChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200px">
            <template v-slot:default="scope">
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
                  @click="showEditDialog(scope.row.id)"
                ></el-button>
              </el-tooltip>

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
                  @click="showDelteUserView(scope.row.id)"
                ></el-button>
              </el-tooltip>

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
                  @click="showSetUserRoleDialog(scope.row)"
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
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 添加弹出框 -->
    <el-dialog
      title="新增用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser('addFormRef')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser('editFormRef')"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="修改用户权限"
      :visible.sync="editUserRoleVisible"
      width="50%"
      @close="editUserRoleClosed"
    >
      <div>
        <p>当前用户:{{ userInfo.username }}</p>
        <p>当前角色:{{ userInfo.role_name }}</p>
        <p>
          分配角色:
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'newuser',
  created() {
    this.getUserList()
  },
  data() {
    var checkEmail = (rule, value, cb) => {
      const regEmail =
        /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    var checkMobile = (rule, value, cb) => {
      const regMobile =
        /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/

      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的号码'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      editForm: {},
      total: 0,
      userlist: [],
      addDialogVisible: false, // 显示或则隐藏新增
      editDialogVisible: false, //显示或隐藏修改
      editUserRoleVisible: false, //修改用户权限隐藏
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 11,
            message: '长度在 3 到 11 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码' },
          { min: 6, max: 8, message: '长度在 6 到 8 个字符', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱' },
          {
            validator: checkEmail,
            trigger: 'blur',
          },
        ],
        mobile: [
          { required: true, message: '请输入手机号' },
          {
            validator: checkMobile,
            trigger: 'blur',
          },
        ],
      },
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱' },
          {
            validator: checkEmail,
            trigger: 'blur',
          },
        ],
        mobile: [
          { required: true, message: '请输入手机号' },
          {
            validator: checkMobile,
            trigger: 'blur',
          },
        ],
      },
      roleList: [],
      userInfo: {}, //当前选中修改权限的role
      selectRoleId:""
    }
  },
  methods: {
    async getUserList() {
      await this.$http
        .get('users', { params: this.queryInfo })
        .then((result) => {
          console.log(result)
          if (result.data.meta.status != 200) {
            return this.$message.error('获取数据失败')
          }
          const total = result.data.data.total
          this.total = total
          this.userlist = result.data.data.users
          console.log(result.data.data)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 监听size改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    //选中页数改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    //用户状态修改
    userStateChange(userInfo) {
      console.log(userInfo)
      this.$http
        .put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
        .then((result) => {
          if (result.data.meta.status != 200) {
            userInfo.mg_state = !userInfo.mg_state
            return this.$message.error('更新状态失败')
          } else {
            this.$message.success('更新状态成功')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    //添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        await this.$http.post('users', this.addForm).then((res) => {
          // console.log(res.data)
          if (res.data.meta.status != 201) {
            this.$message.error('添加失败')
          } else {
            this.$message.success('添加成功')
            this.addDialogVisible = false
            this.getUserList()
          }
        })
      })
    },
    //关闭添加界面事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    clearActivePath() {
      // window.sessionStorage.removeItem("activePath")
      window.sessionStorage.setItem('activePath', '')
    },
    editUser() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        await this.$http
          .put('users/' + this.editForm.id, {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          })
          .then((res) => {
            if (res.data.meta.status != 200) {
              this.$message.error('修改失败')
            } else {
              this.$message.success('修改成功')
              this.getUserList()
              this.editDialogVisible = false
            }
          })
      })
    },
    //展示编辑用户的对话框
    async showEditDialog(userId) {
      await this.$http.get('users/' + userId).then((res) => {
        console.log(res)
        if (res.data.meta.status != 200) {
          this.$message.error('用户信息请求失败,请重试')
        } else {
          this.editForm = res.data.data
        }
      })

      this.editDialogVisible = true
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //删除操作
    showDelteUserView(userId) {
      this.$confirm('此操作将删除用户信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.deleteUser(userId)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    async deleteUser(userId) {
      await this.$http.delete('users/' + userId).then((res) => {
        if (res.data.meta.status != 200) {
          return this.$message.error('删除失败,请从新操作')
        } else {
          this.$message.success('删除成功')
          this.getUserList()
        }
      })
    },

    //修改用户权限
    //显示权限
    showSetUserRoleDialog(user) {
      this.userInfo = user
      //展示对话框之前获取所有的权限
      this.$http
        .get('roles')
        .then((result) => {
          console.log(result)
          if (result.data.meta.status != 200) {
            return this.$message.error('获取权限信息失败')
          }
          this.roleList = result.data.data
        })
        .catch((err) => {
          console.log(err)
        })
      this.editUserRoleVisible = true
    },
    //保存用户修改的权限
    async saveRoleInfo(){
    //   if (this.selectRoleId !== null && this.selectRoleId !== undefined && this.selectRoleId !== '') {
    //     console.log(this.selectRoleId)
    //     console.log(true)
    //  }else{
    //     console.log(false)
    //  }
     if(!this.selectRoleId){
       this.$message.error("请选择要分配的角色")
     }
     const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{
       rid:this.selectRoleId
     }).catch((err)=>{
       console.log(err)
     })
     console.log(res)
     if(res.meta.status != 200){
      return this.$message.error(res.meta)
     }
     this.$message.success("修改成功")
     this.editUserRoleVisible = false
     this.getUserList()
    },
    editUserRoleClosed(){
    },
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
  width: 100%;
}
</style>