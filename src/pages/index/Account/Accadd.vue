<template>
  <div>
    <div class="top">
      <span>账号添加</span>
    </div>
    <div class="content">
      <el-form style="width:300px;margin-top:20px" ref="form" label-width="80px">
        <el-form-item label="账号">
          <el-input v-model="user"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="pwd"></el-input>
        </el-form-item>
        <el-form-item label="用户组">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="addAcc" type="primary">添加</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {Addcount_api} from '../../../api/apis.js'
export default {
  data() {
    return {
      options: [
        {
          value: "超级管理员",
          label: "超级管理员"
        },
        {
          value: "普通管理员",
          label: "普通管理员"
        }
      ],
      value: "",
      user:'',
      pwd:'',
      isAdd:false
    }
  },
  methods:{
    addAcc(){
      if(this.isAdd) return;
      this.isAdd=true;
      //发送请求
      Addcount_api(this.user,this.pwd,this.value).then(res=>{
        if(res.data.code==0){
          this.$message({
            showClose: true,
            message: "账号添加成功",
            type: "success"
          });
        }else{
          this.$message({
          showClose: true,
          message: '账户添加失败',
          type: 'error'
        });
        }
        setTimeout(()=>{
          this.isAdd=false
        },3000)
      })
    },
    reset(){
      this.user='';
      this.pwd='';
      this.value='';
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