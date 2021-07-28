<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }" @click="clearActivePath()"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 显示卡片内容主要区域 -->
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateView()">
            添加分类
          </el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        class="treeTable"
        :data="categories"
        :columns="columns"
        border
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot-scope="scope" slot="isok">
          <i
            class="el-icon-success"
            style="color: lightgreen"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot-scope="scope" slot="sort">
          <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.level == 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作  -->
        <template slot-scope="scope" slot="operation">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditDialog(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="showDeleteDialog(scope.row)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        :page-sizes="[2, 5, 10, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 新增区域 -->
    <el-dialog
      title="新增分类"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form :model="addForm" :rules="addFormRules" label-width="80px" ref="addFormRef">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>

        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectKeys"
            :options="addParentCateList"
            :props="caseCardProp"
            @change="parentSelectChange"
            clearable
            ref="refHandle"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  created() {
    this.getCategories()
  },
  data() {
    return {
      queryInfo: {
        type: 3, //可选123 如果不设置,默认所有分类
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      categories: [],
      // tree-table用来使用
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否删除',
          type: 'template',
          template: 'isok',
        },
        {
          label: '排序',
          type: 'template',
          template: 'sort',
        },

        {
          label: '操作',
          type: 'template',
          template: 'operation',
        },
      ],
      addForm: {
        //分类id 一级的时候为0
        cat_pid: 0,
        cat_name: '',
        //分类登记默认一级
        cat_level: 0,
      },
      addFormRules: {
        cat_name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 11,
            message: '长度在 3 到 11 个字符',
            trigger: 'blur',
          },
        ],
      },
      addParentCateList: [],
      caseCardProp:{
        checkStrictly: true,
        expandTrigger:'hover',
        value:'cat_id',
        label:'cat_name',
        children:'children'
      },
      selectKeys:[],
      addDialogVisible: false,
    }
  },
  methods: {
    clearActivePath() {
      // window.sessionStorage.removeItem("activePath")
      window.sessionStorage.setItem('activePath', '')
    },
    async getCategories() {
      const { data: res } = await this.$http
        .get('categories', { params: this.queryInfo })
        .catch((err) => {
          console.log(err)
        })
      console.log(res)
      if (res.meta.status != 200) {
        return this.$message.error('没有获取到分类数据')
      }
      this.categories = res.data.result
      this.total = res.data.total
    },
    // 监听size改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCategories()
    },

    //选中页数改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCategories()
    },
    showAddCateView() {
      this.getParentCateList()
      this.addDialogVisible = true
    },
    addDialogClosed() {
          this.$refs.addFormRef.resetFields()
          // this.addForm.cat_name = ''
          this.addForm.cat_pid = 0
          this.addForm.cat_level = 0
          this.selectKeys = []
    },
    //修改操作
    showEditDialog(cateModel) {},
    //删除操作
    showDeleteDialog(cateModel) {},

    //获取新增分类的时候父级列表
    async getParentCateList() {
      await this.$http
        .get('categories', { params: { type: 2 } })
        .then((result) => {
          console.log(result)
          if (result.data.meta.status != 200) {
            return this.$message.error('获取父级列表失败')
          } else {
            this.addParentCateList = result.data.data
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    //选中父分类事件
    parentSelectChange(value) {
        if(this.$refs.refHandle){
          this.$refs.refHandle.dropDownVisible = false
        }
        if(value.length >0){
          this.addForm.cat_pid = value[value.length -1]
          this.addForm.cat_level = value.length
        }else{
          this.addForm.cat_pid = 0
          this.addForm.cat_level = 0
        }
      },
       addCate(){
        this.$refs.addFormRef.validate(async valid=>{
          if(!valid)return
          await this.$http.post('categories',this.addForm).then((result) => {
            console.log(result)
            if(result.status != 200){
              return this.$message.error("添加失败")
            }
            this.$message.success('添加分类成功')
            this.addDialogVisible = false
            this.getCategories()
        }).catch((err) => {
            console.log(err)
        });
        })
        
      }
  },
}
</script>
<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader{
  width: 100%;
}
</style>