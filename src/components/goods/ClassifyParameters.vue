<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert
        title="只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false">
      </el-alert>
      <el-row>
        <el-col>
          <span>选择分类商品:</span>
          <!-- 选择位置 -->
          <el-cascader v-model="selectKeys" :options="categories"
            :props="caseCardProp"
            @change="selectChage"
            clearable>

          </el-cascader>
        </el-col>
      </el-row>
      <!-- tab 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <div>
            <el-button type="primary" size="mini" :disabled="isBtnDisable" @click="addAttributeVisilbe = true">添加参数</el-button>
          </div>
          <el-table :data="manyAttributes" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                v-for="(item,i) in scope.row.attr_vals"
                :key="i"
                closable
                @close="closeAttrVals()"
                >
                {{item}}
              </el-tag>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="deleteAttribute(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <div>
            <el-button type="primary" size="mini" :disabled="isBtnDisable" @click="addAttributeVisilbe = true">添加属性</el-button>
          </div>
          <el-table :data="onlyAttributes" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="deleteAttribute(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加界面 -->
    <el-dialog :title="'添加'+titleText" :visible.sync="addAttributeVisilbe"
      @close="addAttributeClosed">
      <el-form
        :model="addAtributeForm"
        :rules="addAtributeFormRules"
        ref="addAtributeFormRef"
        label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addAtributeForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addAttributeVisilbe = false">取 消</el-button>
        <el-button type="primary" @click="addAttributes()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改界面 -->
    <el-dialog :title="'修改'+titleText" :visible.sync="eidtAttributeVisilbe"
      @close="editAttributeClosed">
      <el-form
        :model="selectAttribute"
        :rules="addAtributeFormRules"
        ref="addAtributeFormRef"
        label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="selectAttribute.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="eidtAttributeVisilbe = false">取 消</el-button>
        <el-button type="primary" @click="editAttribute()">确 定</el-button>
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
      categories: [], //商品分类数据
      selectKeys: [], //选择的商品分类
      caseCardProp: {
        //显示结构
        checkStrictly: false, //是否可选中父项
        expandTrigger: 'hover', //展开方式放上去还是点击 hover/click
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      activeName: 'many',
      manyAttributes: [], //属性数据列表
      onlyAttributes: [], //静态属性

      addAttributeVisilbe: false, //添加框\
      //添加属性的内容
      addAtributeForm: {
        attr_name: '',
        attr_sel: '',
      },
      //添加属性的约定
      addAtributeFormRules: {
        attr_name: [
          { required: true, message: '请输内容', trigger: 'blur' },
          {
            min: 1,
            max: 6,
            message: '长度在 1 到 6 个字符',
            trigger: 'blur',
          },
        ],
      },
      eidtAttributeVisilbe: false,
      selectAttribute: {}, // 选中修改的属性或者删除的属性
    }
  },
  methods: {
    async getCategories() {
      const { data: res } = await this.$http.get('categories').catch((err) => {
        console.log(err)
      })
      console.log(res)
      if (res.meta.status != 200) {
        return this.$message.error('没有获取到分类数据')
      }
      this.categories = res.data
      this.total = res.data.total
    },
    //分类产品变更时获取属性
    selectChage(val) {
      if (this.selectKeys.length == 0) {
        this.selectKeys = []
        return
      }
      //选中的是3级分类
      console.log(val)
      this.getAttributes()
    },
    //tab切换的点击事件
    handleClick() {
      console.log(this.activeName)
      this.getAttributes()
    },
    //获取属性
    async getAttributes() {
      await this.$http
        .get('categories/' + this.cateId + '/attributes', {
          params: { sel: this.activeName },
        })
        .then((result) => {
          console.log(result)
          if (result.data.meta.status != 200) {
            return this.$message.error('没有满足条件数据')
          }
          result.data.data.forEach((item) => {
            if(this.activeName === "many"){
            item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
            }else{
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
            }
            // if(item.attr_vals.length === 1 && item.attr_vals[0] === ""){
            //   item.attr_vals = []
            // }
          })
          if (this.activeName === 'many') {
            this.manyAttributes = result.data.data
          } else {
            this.onlyAttributes = result.data.data
          }
        })
        .catch((err) => {})
    },
    addAttributeClosed() {
      this.$refs.addAtributeFormRef.resetFields()
    },
    //添加属性
    async addAttributes() {
      this.addAtributeForm.attr_sel = this.activeName
      await this.$http
        .post(`categories/${this.cateId}/attributes`, this.addAtributeForm)
        .then((result) => {
          console.log(result)
          if (result.data.meta.status != 201) {
            return this.$message.error('添加失败')
          }
          this.$message.success('添加成功')
          this.addAttributeVisilbe = false
          this.getAttributes()
        })
        .catch((err) => {})
    },
    showEditDialog(val) {
      this.eidtAttributeVisilbe = true
      this.selectAttribute = val
    },
    editAttributeClosed() {
      this.selectAttribute = {}
    },
    async editAttribute() {
      await this.$http
        .put(
          `categories/${this.cateId}/attributes/${this.selectAttribute.attr_id}`,
          {
            attr_name: this.selectAttribute.attr_name,
            attr_sel: this.selectAttribute.attr_sel,
          }
        )
        .then((result) => {
          console.log(result)
          if (result.data.meta.status != 200) {
            return this.$message.error('修改失败')
          }
          this.$message.success('修改成功')
          this.eidtAttributeVisilbe = false
          this.getAttributes()
        })
    },
    deleteAttribute(val) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$http
            .delete(`categories/${this.cateId}/attributes/${val.attr_id}`)
            .then((result) => {
              if (result.data.meta.status != 200) {
                return this.$message.error('删除失败')
              }
              this.$message.success('删除成功')
              this.getAttributes()
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    //删除一个vals
    closeAttrVals(){

    }
  },
  computed: {
    // 如果按钮被禁用 返回true 否则返回 false
    isBtnDisable() {
      if (this.selectKeys.length <= 0) {
        return true
      }
      return false
    },
    //获取分类id
    cateId() {
      if (this.selectKeys.length != 0) {
        const categoryId = this.selectKeys[this.selectKeys.length - 1]
        return categoryId
      }
      return null
    },
    //动态计算标题等文本
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    },
  },
}
</script>
<style lang="less" scoped>
.el-row {
  margin: 15px 0;
}
.el-cascader {
  margin-left: 10px;
  width: 30%;
}
.el-tag{
  margin: 10px;
}
</style>