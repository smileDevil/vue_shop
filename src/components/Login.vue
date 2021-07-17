<template>
  <div id="login" class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <el-form
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
        label-width="0"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-username"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-password"
            type="password"
          ></el-input>
        </el-form-item>

        <el-form-item class="btns">
          <el-button type="primary" @click="submitForm('loginFormRef')"
            >登录</el-button
          >
          <el-button type="info" @click="resetForm('loginFormRef')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script src= "../plugins/element.js"></script>
<script>
export default {
  name: 'login',
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      loginFormRules: {
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
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 11,
            message: '长度在 6 到 11 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    submitForm(formRef) {
      this.$refs[formRef].validate(async (valid) => {
        // valid 是 bool
        if (valid) {
          //解构 ,去除内部数据data 并重命名为res
          const { data: res } = await this.$http.post('login', this.loginForm)
          console.log(res)
          if (res.meta.status != 200) {
            this.$message({
              message: res.meta.msg,
              type: 'error',
            })
          } else {
            //  this.$message({
            //     message:res.meta.msg,
            //     type:'success'
            //   });
            //简写
            this.$message.success('登录成功')
            //1 将额登录成功后的tonken 保存到客户端sessionStorage中
            //1.1 项目中除了登录接口外其他api 必须登录后才能使用
            //1.3 token只应当前网站打开期间生效,所以token保存在sessionStorage中
            window.sessionStorage.setItem('token', res.data.token)
            //路由跳转
            this.$router.push('/homes')
          }
        } else {
        }
      })
    },
    resetForm(formRef) {
      this.$refs[formRef].resetFields()
    },
  },
}
</script>


// 样式
<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 4px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border: 1px solid #eee;
    border-radius: 50%;
    height: 130px;
    width: 130px;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    img {
      height: 100%;
      width: 100%;
      background-color: #eee;
      border-radius: 50%;
    }
  }
}
.login_form {
  padding: 0 40px;
  box-sizing: border-box;
  width: 100%;
  position: absolute;
  bottom: 0;
}
.btns {
  display: flex;
  justify-content: flex-end;
  margin-right: 20px;
}
</style>