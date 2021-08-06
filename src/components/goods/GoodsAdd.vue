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
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>

      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"> </el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 左侧tabs -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="tabLeaveFunction"
          @tab-click="tabClick()"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="categories"
                :props="caseCardProp"
                clearable
                @change="selectChange"
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyAttributes"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  :label="cb"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyAttributes"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 表示图片要上传到的地址 -->
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getCategories()
  },
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_cat: [],
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        pics: '',
        attrs: '',
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品书里那个', trigger: 'blur' },
        ],
        goods_cat: [{ required: true, message: '请选择商品分类' }],
      },
      categories: [], //商品分类数据
      caseCardProp: {
        checkStrictly: false, //是否可选中父项
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      manyAttributes: [], //属性数据列表
      onlyAttributes: [], //静态属性
      uploadUrl:"http://timemeetyou.com:8889/api/private/v1/upload",//上传文件的url地址
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
    selectChange(val) {
      //选中的是3级分类
      console.log(val)
    },
    //切换左侧标签时判读有没有选中商品类型
    tabLeaveFunction(activeName, oldActive) {
      if (this.addForm.goods_cat.length <= 0 && oldActive === '0') {
        return false
      } else {
        return true
      }
    },
    tabClick() {
      if (this.activeIndex == 1) {
        this.getAttributes('many')
      }
      if (this.activeIndex == 2) {
        this.getAttributes('only')
      }
    },
    //获取属性
    async getAttributes(val) {
      const result = await this.$http
        .get('categories/' + this.cateId + '/attributes', {
          params: { sel: val },
        })
        .catch((err) => {})

      console.log(result)
      if (result.data.meta.status != 200) {
        return this.$message.error('没有满足条件数据')
      }

      result.data.data.forEach((item) => {
        if (val === 'many') {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        } else {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        }
        //控制文本框显示与隐藏
        item.inputVisible = false
        //文本框中输入的内容
        item.inputVal = ''
        // if(item.attr_vals.length === 1 && item.attr_vals[0] === ""){
        //   item.attr_vals = []
        // }
      })
      if (val === 'many') {
        this.manyAttributes = result.data.data
      } else {
        this.onlyAttributes = result.data.data
      }
    },
    //上传处理
    //预览的逻辑
    handlePreview(){
      
    }
  },
  computed: {
    //获取分类id
    cateId() {
      if (this.addForm.goods_cat.length != 0) {
        const categoryId =
          this.addForm.goods_cat[this.addForm.goods_cat.length - 1]
        return categoryId
      }
      return null
    },
  },
}
</script>

<style lang="less" scoped>
.el-input {
  width: 400px;
}
.el-cascader {
  width: 400px;
}
.el-checkbox {
  margin: 0 20px 0 0 !important;
}
</style>