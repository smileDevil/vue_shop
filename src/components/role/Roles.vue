<template>
  <div>
    <!-- 面包屑导航去 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }" @click="clearActivePath()"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddRoleView()"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe height="400px">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['dbbottom', index1 == 0 ? 'dbtop' : '', 'vcenter']"
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[index2 == 0 ? '' : 'dbtop', 'vcenter']"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable=""
                      @close="removeRightById(scope.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- <el-row>
                      <el-col
                        v-for="(item3, index3) in item2.children"
                        :key="item3.id"
                      >
                        <el-tag type="warning" closable>
                          {{ item3.authName }}
                        </el-tag>
                      </el-col>
                    </el-row> -->
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <!-- <el-table-column type="index"></el-table-column> -->
        <el-table-column
          prop="roleName"
          label="角色名称"
          width="120px"
        ></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editRole(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteRole(scope.row)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 新增界面 -->
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
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="showAddRoleView('addFormRef')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 分配权限界面 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightVisible"
      width="60%"
      @close="setRightsDialogClosed"
    >
      <!-- 树形控件 default-expand-all 默认展开所有 -->
      <el-tree
        :data="rightsList"
        :props="rightsProps"
        ref="rightTree"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultKeys"
      >
        <!--  -->
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'roles',
  created() {
    this.getRoles()
  },
  data() {
    return {
      rolesList: [],
      rightsList: [],
      //默认选中到节点id值
      defaultKeys: [],
      //tree中显示到树形对应值和子节点
      rightsProps: {
        children: 'children',
        label: 'authName',
      },
      roleId: '', //选中设置权限的角色id
      addForm: {
        roleName: '',
        roleDesc: '',
      },
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 3,
            max: 11,
            message: '长度在 3 到 11 个字符',
            trigger: 'blur',
          },
        ],
        roleDesc: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 3,
            max: 11,
            message: '长度在 3 到 11 个字符',
            trigger: 'blur',
          },
        ],
      },
      addDialogVisible: false, //新增角色界面显示隐藏
      setRightVisible: false, //设置权限界面显示隐藏
    }
  },
  methods: {
    //获取角色列表
    async getRoles() {
      await this.$http
        .get('roles')
        .then((result) => {
          console.log(result)
          if (result.data.meta.status != 200) {
            this.$message.err('未获取到角色信息')
          } else {
            this.rolesList = result.data.data
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    removeRightById(role, rightId) {
      //弹框提示是否要删除
       ('删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$http
            .delete(`roles/${role.id}/rights/${rightId}`)
            .then((result) => {
              if (result.data.meta.status != 200) {
                return this.$message.error('删除失败')
              } else {
                this.$message.success('删除成功')
                //不建议调用下面到方法,会重新更新界面
                // this.getRoles()
                role.children = result.data.data
              }
            })
            .catch((err) => {
              console.log(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },

    //展示角色添加界面
    showAddRoleView() {
      this.addDialogVisible = true
    },
    //添加角色
    addRole() {},
    //关闭添加界面后的事件
    addDialogClosed() {},
    //修改角色
    editRole(roleModel) {
      console.log(roleModel)
    },
    //删除角色
    deleteRole(roleModel) {
      console.log(roleModel)
    },
    // 设置权限显示
    async showSetRightDialog(roleModel) {
      this.roleId = roleModel.id
      await this.$http
        .get('rights/' + 'tree')
        .then((res) => {
          console.log(res)
          if (res.data.meta.status != 200) {
            return this.$message.error('数据请求失败')
          } else {
            this.rightsList = res.data.data
            //递归获取三级节点的id
            this.getLeafKeys(roleModel, this.defaultKeys)
          }
        })
        .catch((err) => {
          console.log(err)
        })
      this.setRightVisible = true
    },
    //设置权限
    async allotRights() {
      const inputKeys = [
        ...this.$refs.rightTree.getCheckedKeys(),
        ...this.$refs.rightTree.getHalfCheckedKeys(),
      ]
      // console.log(inputKeys)
      //通过字符串方式拼接
      const inputKeyStr = inputKeys.join(',')
      // console.log(inputKeys.join(','))
      const { data: res } = await this.$http
        .post(`roles/${this.roleId}/rights`, { rids: inputKeyStr })
        .catch((err) => {
          console.log(err)
        })
      if (res.meta.status != 200) {
        return this.$message.error('更新权限失败')
      }

      this.$message.success('分配权限成功')
      this.getRoles()
      this.setRightVisible = false
    },

    //通过递归形式 获取角色下所有三级权限id
    getLeafKeys(node, arr) {
      //如果当前node节点不包含children树形,说明是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr))
    },
    //监听分配权限对话框的关闭权限
    setRightsDialogClosed() {
      this.defaultKeys = []
    },
  },
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}
.el-tag {
  margin: 7px;
}

.dbtop {
  border-top: 1px solid #eee;
}
.dbbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>