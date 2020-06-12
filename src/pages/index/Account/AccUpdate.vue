<template>
  <div>
    <div class="top">
      <span>修改密码</span>
    </div>
    <div class="content">
      <el-form style="width:350px;margin-top:20px" ref="form" label-width="80px">
        <el-form-item label="原密码">
          <el-tooltip
            v-model="check"
            class="item"
            effect="dark"
            :content="msg"
            manual
            placement="right"
          >
            <el-input @change="checkOld" v-model="oldPwd"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input type="password" v-model="newPwd"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input @change="checkpass" type="password" v-model="checkpwd"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="updatepwd" type="primary">确认修改</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { Checkoldpwd_api } from "../../../api/apis.js";
import { Editpwd_api } from "../../../api/apis.js";
export default {
  data() {
    return {
      isupdate: false, //是否发送请求
      check: false, //提示框显示隐藏
      oldPwd: "", //就密码
      newPwd: "", //新密码
      checkpwd: "", //确认新密码
      msg: ""
    };
  },
  methods: {
    //检查旧密码
    checkOld() {
      Checkoldpwd_api(this.oldPwd, window.localStorage.getItem("id")).then(
        res => {
          if (res.data.code == "0") {
            this.msg = "密码正确";
            this.check = true;
            this.isupdate = true;
          } else {
            this.msg = "密码错误请重新输入";
            this.check = true;
            setTimeout(() => {
              this.check = false;
            }, 3000);
          }
          setTimeout(() => {
            this.check = false;
          }, 3000);
        }
      );
    },
    //监测密码二次输入
    checkpass() {
      if (this.newPwd != this.checkpwd) {
        this.$message({
          type: "info",
          message: '两次密码输入不一致，请重新输入'
        });
        this.checkpwd=''
      }
    },
    //密码跟新
    updatepwd() {
      if (this.isupdate == true && this.newPwd == this.checkpwd) {
        this.$confirm("此操作将修改当前用户密码, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            Editpwd_api(this.newPwd, window.localStorage.getItem("id")).then(
              res => {
                if (res.data.code == 0) {
                  this.$message({
                    type: "success",
                    message: "密码修改成功!请重新登陆"
                  });
                  this.reset();
                  setTimeout(()=>{
                    localStorage.token='';
                    window.location.reload();
                  },1500)
                }
              }
            );
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消密码修改"
            });
            this.reset();
          });
      }
    },
    //重置
    reset() {
      this.oldPwd = "";
      this.newPwd = "";
      this.checkpwd = "";
    }
  }
};
</script>

<style lang="less" scoped>
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #fff;
  padding-bottom: 10px;
}
</style>