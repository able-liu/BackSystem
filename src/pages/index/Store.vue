<template>
  <div>
    <div class="top" style="padding-bottom:10px;margin-bottom:10px">
      <span>店铺管理</span>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
    <div class="content">
      <el-form style="width:650px" :model="form" label-width="80px">
        <span>店铺名称：</span>
        <el-input
          style="width:300px"
          type="text"
          placeholder="请输入店名"
          v-model="form.name"
          maxlength="10"
          show-word-limit
        ></el-input>
        <div style="margin: 20px 0;"></div>
        <span>店铺公告：</span>
        <el-input
          style="width:500px;vertical-align: middle;"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 10}"
          placeholder="请输入内容"
          v-model="form.bulletin"
        ></el-input>
        <div class="demo-image__preview" style="align-items: center;display:flex;margin-top:20px">
          <span style="margin-right:10px">店铺头像:</span>
          <el-upload
            class="avatar-uploader"
            action="http://127.0.0.1:5000/shop/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img
              v-if="form.avatar"
              width="120px"
              height="120px"
              :src="'http://127.0.0.1:5000/upload/shop/'+form.avatar"
              class="avatar"
            />
            <i v-else class="el-icon-plus"></i>
          </el-upload>
        </div>
        <!-- 照片上传 -->
        <div style="height:20px"></div>
        <span>店铺图片：</span>

        <div>
          <el-upload
            action="http://127.0.0.1:5000/shop/upload"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :file-list="piclist"
            :on-success="handlePicSuccess"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </div>

        <el-form-item label="配送费" style="width:300px">
          <el-input v-model="form.deliveryPrice"></el-input>
        </el-form-item>
        <el-form-item label="起送价格" style="width:300px">
          <el-input v-model="form.minPrice"></el-input>
        </el-form-item>
        <el-form-item label="配送时间" style="width:300px">
          <el-input v-model="form.deliveryTime"></el-input>
        </el-form-item>
        <el-form-item label="配送描述" style="width:300px">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="店铺评分" style="width:300px">
          <el-input v-model="form.score"></el-input>
        </el-form-item>
        <el-form-item label="销量" style="width:300px">
          <el-input v-model="form.sellCount"></el-input>
        </el-form-item>
        <el-form-item label="活动">
          <el-checkbox-group v-model="supports">
            <el-checkbox v-for="(item,index) in supportsAll" :key="index" :label="item">{{item}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="营业时间" style="width:300px">
          <div class="block">
            <el-time-picker
              is-range
              v-model="form.date"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            ></el-time-picker>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { Shop_api, Shop_edit_api } from "@/api/apis.js"; //Shop_edit_api
const supportOptions = [
  "在线支付满28减5",
  "VC无限橙果汁全场8折",
  "单人精彩套餐",
  "特价饮品8折抢购",
  "单人特色套餐"
];
export default {
  created() {
    Shop_api().then(res => {
      res.data.data.date = this.date(res.data.data.date);
      this.form = { ...res.data.data };
      this.supports = this.form.supports;
      let pic = {};
      this.piclist = res.data.data.pics.map(item => {
        pic.url = "http://127.0.0.1:5000/upload/shop/" + item;
        return JSON.parse(JSON.stringify(pic));
      });
    });
  },
  data() {
    return {
      isIndeterminate: true,
      supportsAll: supportOptions, //所有选项
      dialogImageUrl: "",
      dialogVisible: false,
      supports: [], //选中的值
      form: {},
      piclist: []
    };
  },
  methods: {
    //移除图片时触发
    handleRemove(file) {
      // console.log(file.uid);
      this.piclist = this.piclist.filter(item => item.uid != file.uid);
      // console.log(this.piclist)
    },
    //点击放大图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //保存修改
    save() {
      this.updatePic();
      Shop_edit_api(
        this.form.id,
        this.form.name,
        this.form.bulletin,
        this.form.avatar,
        this.form.deliveryPrice,
        this.form.deliveryTime,
        this.form.description,
        this.form.score,
        this.form.sellCount,
        JSON.stringify(this.supports),
        JSON.stringify(this.form.date),
        JSON.stringify(this.updatePic())
      ).then(res => {
        if (res.data.code == 0) {
          this.$message({
            showClose: true,
            message: "电铺信息保存成功,即将刷新",
            type: "success"
          });
        } else {
          this.$message({
            showClose: true,
            message: "商品修改失败",
            type: "error"
          });
        }
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    //时间转换
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
    },
    //头像上传成功
    handleAvatarSuccess(res) {
      this.form.avatar = res.imgUrl;
    },
    //图片上传成功
    handlePicSuccess(res) {
      this.piclist.push({
        url: "http://127.0.0.1:5000/upload/shop/" + res.imgUrl
      });
    },
    //照片列表转换数组
    updatePic() {
      let arr = [];
      arr = this.piclist.map(item =>
        item.url.slice(item.url.lastIndexOf("/") + 1)
      );
      // console.log(arr)
      return arr;
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
}
.content {
  .el-textarea__inner {
    min-height: 160px;
  }
}
</style>