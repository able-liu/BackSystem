<template>
  <div>
    <p style="margin-bottom:10px">管理员信息</p>
    <el-form :label-position="labelPosition" label-width="100px" :model="user">
      <el-form-item label="管理员ID">
        <el-input style="width:150px" readonly v-model="user.id"></el-input>
      </el-form-item>
      <el-form-item label="账号">
        <el-input style="width:200px" readonly v-model="user.account"></el-input>
      </el-form-item>
      <el-form-item label="用户组">
        <el-input style="width:200px" readonly v-model="user.userGroup"></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-input style="width:300px" readonly v-model="user.ctime"></el-input>
      </el-form-item>
      <el-form-item label="管理员头像">
        <!-- 头像上传 -->
        <el-upload
          class="avatar-uploader"
          action="http://127.0.0.1:5000/users/avatar_upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :data="data"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Accountinfo_api } from "../../api/apis.js"; // Avatar_api
export default {
  //获取用户信息
  created() {
    Accountinfo_api(window.localStorage.getItem("id")).then(res => {
      this.imageUrl = res.data.accountInfo.imgUrl;
      res.data.accountInfo.ctime=this.date(res.data.accountInfo.ctime);
      this.user = res.data.accountInfo;
    });
  },
  data() {
    return {
      labelPosition: "right",
      user: {
        id: 0,
        ctime: "",
        account: "",
        userGroup: "",
        imgUrl: ""
      },
      imageUrl: "",
      data: { id: localStorage.id }
    };
  },
  methods: {
    // upload(){
    //   Avatar_api(localStorage.id).then(res=>{
    //     if(res.data.code==0){
    //       this.$message({
    //           showClose: true,
    //           message: "头像上传成功",
    //           type: "success"
    //         });
    //     }else{
    //       this.$message({
    //         showClose: true,
    //         message: "头像上传失败",
    //         type: "error"
    //       });
    //     }
    //   })
    // },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.$message({
        showClose: true,
        message: "头像上传成功",
        type: "success"
      });
      setTimeout(()=>{
        window.location.reload();
      },1000)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    date(arr) {
      if (typeof arr == "string") {
        let date = new Date(arr);
        //获取年
        let year = date.getFullYear();
        let month = date.getMonth();
        month = month < 9 ? "0" + (month + 1) : month + 1;
        let day = date.getDate();
        day = day < 10 ? "0" + day : day;
        let h = date.getHours();
        h = h < 10 ? "0" + h : h;
        let m = date.getMinutes();
        m = m < 10 ? "0" + m : m;
        let s = date.getSeconds();
        s = s < 10 ? "0" + s : s;
        arr = `${year}-${month}-${day} ${h}:${m}:${s}`;
        return arr;
      } else {
        for (let i in arr) {
          // console.log(arr[i]);
          let date = new Date(arr[i]);
          //获取年
          let year = date.getFullYear();
          let month = date.getMonth();
          month = month < 9 ? "0" + (month + 1) : month + 1;
          let day = date.getDate();
          day = day < 10 ? "0" + day : day;
          let h = date.getHours();
          h = h < 10 ? "0" + h : h;
          let m = date.getMinutes();
          m = m < 10 ? "0" + m : m;
          let s = date.getSeconds();
          s = s < 10 ? "0" + s : s;
          arr[i] = `${year}-${month}-${day} ${h}:${m}:${s}`;
        }
        return arr;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>