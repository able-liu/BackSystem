<template>
  <div>
    <div class="top">
      <span>商品添加</span>
    </div>
    <div class="content">
      <el-form ref="form" label-width="80px" style="width:500px">
        <el-form-item label="商品名称">
          <el-input v-model="name"></el-input>
        </el-form-item>
        <el-form-item label="商品分类">
          <template>
            <el-select v-model="category" filterable placeholder="请选择">
              <el-option
                v-for="(item,index) in categories"
                :key="index"
                :label="item.cateName"
                :value="item.cateName"
              ></el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input-number v-model="price" :min="1" :max="10" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-upload
            action="http://127.0.0.1:5000/goods/goods_img_upload"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handlePicSuccess"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="goodsDesc"></el-input>
        </el-form-item>
        <el-button @click="upload" type="primary">添加商品</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { Addgoods_api, Categories_api } from "@/api/apis.js";
export default {
  created() {
    Categories_api().then(res => {
      this.categories = res.data.categories;
    });
  },
  data() {
    return {
      name: "",
      category: "",
      price: "",
      imgUrl: "",
      goodsDesc: "",
      isupdate: true,
      dialogImageUrl: "",
      dialogVisible: false,
      categories: [] //所有分类
    };
  },

  methods: {
    //图片上传成功时的函数
    handlePicSuccess(res) {
      if (res.code == 0) {
        this.imgUrl = res.imgUrl;
      } else {
        this.$message({
          showClose: true,
          message: "图片上传失败",
          type: "error"
        });
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.imgUrl = file.url;
      this.dialogVisible = true;
    },
    upload() {
      if (this.isupdate) {
        this.isupdate = false;
        Addgoods_api(
          this.name,
          this.category,
          this.price,
          this.imgUrl,
          this.goodsDesc
        ).then(res => {
          if (res.data.code == 0) {
            this.$message({
              showClose: true,
              message: "商品添加成功",
              type: "success"
            });
            this.name = "";
            this.category = "";
            this.price = "";
            this.imgUrl = "";
            this.goodsDesc = "";
          } else {
            this.$message({
              showClose: true,
              message: "商品添加失败",
              type: "error"
            });
          }
          setTimeout(() => {
            this.isupdate = true;
          }, 3000);
        });
      } else {
        this.$message({
          showClose: true,
          message: "您的操作过于频繁",
          type: "error"
        });
      }
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
  margin-bottom: 10px;
}
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