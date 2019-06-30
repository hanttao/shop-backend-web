<template>
  <div class="info">
    <div class="avatar">
      <img src="../assets/luo.jpg" alt="" width="140">
    </div>
    <!-- ref表示组件名称，用于直接操作DOM -->
    <el-form ref="loginForm" :rules='rules' :model='form' class="container">
      <div class="userInfo">
        <el-form-item prop='username'>
          <el-input prefix-icon='myicon myicon-user' v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item prop='password'>
          <el-input prefix-icon='myicon myicon-key' type='password' v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click='login' :plain="true" >登录</el-button>
          <el-button type='reset'>重置</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import {login} from '../api/api.js'
export default {
  data () {
    return {
      form: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        // 用户输入规则 element-ui 提供
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login () {
      // 调用接口前做表单验证
      this.$refs['loginForm'].validate(valid => {
        if (valid) {
          // 表单验证通过
          // 调用登录接口
          let params = {
            username: this.form.username,
            password: this.form.password
          }
          // 调用接口，提交用户登录信息
          login(params).then(res => {
            if (res.meta.status === 200) {
              // 跳转到主页
              this.$router.push({path: '/'})
              // 成功登陆后 存储token 值
              localStorage.setItem('mytoken', res.data.token)
            } else {
              console.log('用户名或者密码错误')
              this.$message({
                message: res.meta.msg,
                type: 'error'
              })
            }
          })
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .info {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    box-sizing: border-box;
    background-color: #2f4050;
  }
  .container {
    box-sizing: border-box;
    margin: 180px auto 0;
    width: 500px;
    height: 340px;
    background-color: #fff;
    position: relative;
  }
  .avatar {
    position: absolute;
    left: 50%;
    top: 110px;
    width: 120px;
    height: 120px;
    border: 10px solid #FFF;
    margin-left: -70px;
    border-radius: 50%;
    box-shadow: 0 1px 5px #CCC;
    background-color: pink;
    overflow: hidden;
    z-index: 9999;
  }
  .userInfo {
    position: absolute;
    text-align: center;
    width: 400px;
    margin: 100px 50px;
  }
  .btn {
    width: 400px;
  }
</style>
