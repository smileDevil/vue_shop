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
        :closable="false"
      >
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
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit">修改</el-button>
                <el-button type="danger" icon="el-icon-delete">删除</el-button>
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
                <el-button type="primary" icon="el-icon-edit">修改</el-button>
                <el-button type="danger" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog :title="'添加'+titleText" :visible.sync="addAttributeVisilbe">


       <span slot="footer" class="dialog-footer">
        <el-button @click="addAttributeVisilbe = false">取 消</el-button>
        <el-button type="primary" @click="addAttributeVisilbe = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import App from '../../App.vue'
export default {
  created() {
    this.getCategories()
  },
  data() {
    return {
      categories: [],//商品分类数据
      selectKeys:[],//选择的商品分类
      caseCardProp:{//显示结构
        checkStrictly: false,//是否可选中父项
        expandTrigger:'hover',//展开方式放上去还是点击 hover/click
        value:'cat_id',
        label:'cat_name',
        children:'children'
      },
      activeName:'many',
      manyAttributes:[],//属性数据列表
      onlyAttributes:[],//静态属性
      atributeAddForm:{

      },
      addAttributeVisilbe:false//添加框

    }
  },
  methods: {
    async getCategories() {
      const { data: res } = await this.$http
        .get('categories')
        .catch((err) => {
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
    selectChage(val){
      if(this.selectKeys.length ==0){
        this.selectKeys = []
        return
      }
      //选中的是3级分类
      console.log(val)
      this.getAttributes()
    },
    //tab切换的点击事件
    handleClick(){
        console.log(this.activeName)
        this.getAttributes()
      },
    //获取属性
    async getAttributes(){
        await this.$http.get('categories/'+this.cateId+'/attributes',{params:{sel:this.activeName}}).then((result) => {
         console.log(result)
         if(result.data.meta.status != 200){
           return this.$message.error("没有满足条件数据")
         }
        
        if(this.activeName === 'many'){
          this.manyAttributes = result.data.data
        }else{
          this.onlyAttributes = result.data.data
        }
       }).catch((err) => {
         
       });
    }
  },
  computed:{
    // 如果按钮被禁用 返回true 否则返回 false
    isBtnDisable(){
      if(this.selectKeys.length <=0){
        return true
      }
      return false
    },
    //获取分类id
    cateId(){
         if(this.selectKeys.length != 0){
           const categoryId = this.selectKeys[this.selectKeys.length-1]
         return categoryId
         }
         return null
    },
    //动态计算标题等文本
    titleText(){
      if(self.activeName === 'many'){
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>
<style lang="less" scoped>
.el-row{
  margin:15px 0;
}
.el-cascader{
  margin-left: 10px;
  width: 30%;
}
</style>