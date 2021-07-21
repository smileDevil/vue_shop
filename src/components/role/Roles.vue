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
          <el-button type="primary" @click="addRole">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe height="400px">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['dbbottom',index1 == 0 ? 'dbtop':'','vcenter']" v-for="(item1,index1) in scope.row.children" :key="item1.id" >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
               <el-tag closable>
                  {{item1.authName}}
               </el-tag>
               <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级三级权限 -->
              <el-col :span="19">
                <el-row :class="[index2 == 0? '':'dbtop','vcenter']" v-for="(item2,index2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable="">
                      {{item2.authName}}
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
                    <el-tag v-for="(item3) in item2.children" :key="item3.id" type="warning" closable>
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <!-- <el-table-column type="index"></el-table-column> -->
        <el-table-column prop="roleName" label="角色名称" width="120px"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button  size="mini" type="primary" icon="el-icon-edit" @click="editRole(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete"  @click="deleteRole(scope.row)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting"  @click="setRole(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
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
    // tianjaijuese
    addRole() {},
    //修改角色
    editRole(roleModel){
      console.log(roleModel)
    },
    //删除角色
    deleteRole(roleModel){
      console.log(roleModel)
    },
    // 设置权限
    setRole(roleModel){
      console.log(roleModel)
    },
  },
}
</script>

<style lang="less" scoped>
.el-table{
  margin-top: 15px;
}
.el-tag{
  margin: 7px
}

.dbtop{
  border-top: 1px solid #eee;
}
.dbbottom{
  border-bottom: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>