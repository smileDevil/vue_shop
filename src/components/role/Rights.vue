<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card" >
      <el-table :data="rightsLis" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column  label="权限等级">
          <template slot-scope="scope">
             <el-tag v-if="scope.row.level == 0">一级</el-tag>
             <el-tag type="success" v-if="scope.row.level == 1">二级</el-tag>
             <el-tag type="warning" v-if="scope.row.level == 2">三级</el-tag>
          </template>
          <!-- <template v-slot:default="scope">
              <el-tag type="success">{{scope.row.level}}</el-tag>
          </template> -->
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name:'rights',
  created() {
    this.getRightsList("list")
  },
  data() {
    return {
      rightsLis:[]
    }
  },
  methods:{
    async getRightsList(type){
      //type的值 list 列表展示  tree 父子结构树形展示
        await this.$http.get('rights/'+type).then((res) => {
          console.log(res)
          if(res.data.meta.status != 200){
           return this.$message.error("数据请求失败")
          }else{
            this.rightsLis = res.data.data
          }
        }).catch((err) => {
          console.log(err)
        });
    }
  }
}
</script>

<style lang="less" scoped>
</style>