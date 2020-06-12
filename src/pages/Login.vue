<template>
  <div id="box">
    <div id="login">
      <p id="title">流星平台管理系统登陆</p>
      <p>
        <el-input
          id="user"
          placeholder="请输入用户名"
          prefix-icon="el-icon-user"
          v-model="user"
          clearable
        ></el-input>
      </p>
      <p>
        <el-input
          id="pwd"
          placeholder="请输入密码"
          prefix-icon="el-icon-lock"
          v-model="pwd"
          show-password
        ></el-input>
      </p>
      <p>
        <el-button id="login_btn" @click="login" type="primary">登陆</el-button>
      </p>
    </div>
  </div>
</template>

<script>
import { Login_api } from "../api/apis.js";
export default {
  data() {
    return {
      user: "",
      pwd: "",
      isreq: false
    };
  },
  methods: {
    //点击登陆
    login() {
      //防抖节流
      if (this.isreq) return;
      this.isreq = true;
      //发送请求
      Login_api(this.user, this.pwd).then(res => {
        if (res.data.code == 0) {
          window.localStorage.setItem('id',res.data.id);
          window.localStorage.setItem('token',res.data.token);
          localStorage.role=res.data.role;
          localStorage.acc=this.user;
          this.$message({
            showClose: true,
            message: "恭喜你，登陆成功,正在为你跳转。。",
            type: "success"
          });
          setTimeout(()=>{
            this.$router.push('/index/Home');
          },3000)
        }else{
          this.$message({
          showClose: true,
          message: '登陆失败,请检查账号或密码是否正确.',
          type: 'error'
        });
        }
        setTimeout(()=>{
          this.isreq=false
        },3000)
      });
    }
  }
};
</script>

<style lang="less" scoped>
#box {
  height: 100vh;
  background: #0a2440;
}
#login {
  position: absolute;
  width: 350px;
  height: 300px;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  margin: auto auto;
  p {
    margin: 30px 0px;
    width: 100%;
    text-align: center;
    button {
      width: 100%;
    }
  }
  #title {
    color: #fff;
  }
}
</style>