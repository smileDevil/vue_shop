<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入查询条件"
            clearable
            v-model="queryInfo.query"
            @clear="getGoodsList()"
          >
            <el-button
              icon="el-icon-search"
              slot="append"
              @click="getGoodsList()"
            >
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">新增商品</el-button>
        </el-col>
      </el-row>
      <!-- table部分 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格(元)"
          width="120px"
          prop="goods_price"
        ></el-table-column>
        <el-table-column
          label="商品数量"
          width="80px"
          prop="goods_number"
        ></el-table-column>
        <el-table-column label="创建时间" width="180px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" />
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="showDeleteGoods(scope.row.goods_id)"
            />
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
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getGoodsList()
  },
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      }, //搜索条件
      goodsList: [],
      total: 0, //总数
    }
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo,
      })
      console.log(res)
      if (res.meta.status != 200) {
        return this.$message.error('没有满足条件数据')
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    //修改size
    handleSizeChange(indexsize) {
      this.queryInfo.pagesize = indexsize
      this.getGoodsList()
    },
    handleCurrentChange(currentpage) {
      this.queryInfo.pagenum = currentpage
      this.getGoodsList()
    },
    //删除商品操作
    async showDeleteGoods(goodid) {
      this.$confirm('此操作将删除用户信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.deleteByGoodId(goodid)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    async deleteByGoodId(goodid) {
      const { data: res } = await this.$http.delete(`goods/${goodid}`)
      if (res.meta.status != 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getGoodsList()
    },
    goAddPage(){
      this.$router.push('/goodslist/add')
    }
  },
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}
</style>