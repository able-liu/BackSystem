<template>
  <div>
    <div class="top">
      <span>商品列表</span>
    </div>
    <div class="content">
      <el-table
        :data="tableData"
        style="width: 100%"
        @expand-change="expandChange"
        :expand-row-keys="expands"
        :row-key="getrowkeys"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="商品 ID">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="商品名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="所属分类">
                <span>{{ props.row.category }}</span>
              </el-form-item>
              <el-form-item label="商品价格">
                <span>{{ props.row.price }}</span>
              </el-form-item>
              <el-form-item label="商品图片">
                <el-avatar :size="60">
                  <img :src="'http://127.0.0.1:5000/upload/imgs/goods_img/'+props.row.imgUrl" />
                </el-avatar>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ date(props.row.ctime) }}</span>
              </el-form-item>
              <el-form-item label="商品评价">
                <span>{{ props.row.rating }}</span>
              </el-form-item>
              <el-form-item label="商品销量">
                <span>{{ props.row.sellCount }}</span>
              </el-form-item>
              <el-form-item label="商品描述">
                <span>{{ props.row.goodsDesc }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="name"></el-table-column>
        <el-table-column label="所属分类" prop="category"></el-table-column>
        <el-table-column label="商品价格" prop="price"></el-table-column>
        <el-table-column label="商品图片">
          <template slot-scope="props">
            <el-avatar :size="60">
              <img :src="'http://127.0.0.1:5000/upload/imgs/goods_img/'+props.row.imgUrl" />
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column label="商品描述" prop="goodsDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 嵌套的表单编辑商品 -->
      <el-dialog title="商品编辑" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="商品名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" :label-width="formLabelWidth">
            <!-- <el-input v-model="form.category" autocomplete="off"></el-input> -->
            <template>
              <el-select v-model="form.category" filterable placeholder="请选择">
                <el-option
                  v-for="(item,index) in categories"
                  :key="index"
                  :label="item.cateName"
                  :value="item.cateName"
                ></el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="商品价格" :label-width="formLabelWidth">
            <el-input v-model="form.price" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品图片地址" :label-width="formLabelWidth">
            <el-input style="margin-bottom:10px" v-model="form.imgUrl" autocomplete="off"></el-input>
            <el-avatar :size="60">
              <img :src="'http://127.0.0.1:5000/upload/imgs/goods_img/'+form.imgUrl" />
            </el-avatar>
          </el-form-item>
          <el-form-item label="商品描述" :label-width="formLabelWidth">
            <el-input v-model="form.goodsDesc" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </div>
      </el-dialog>

      <div style="display:flex;justify-content: center;align-items: center;margin-top:20px">
        <el-pagination
          background
          @current-change="updateList($event,pageSize)"
          @size-change="updateList(currentPage,$event)"
          :current-page="currentPage"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { List_api } from "../../../api/apis.js";
import { Delgoods_api } from "../../../api/apis.js";
import { Editgoods_api, Categories_api } from "../../../api/apis.js";
export default {
  created() {
    List_api(this.currentPage, this.pageSize).then(res => {
      this.total = res.data.total;
      this.tableData = res.data.data;
    });
    Categories_api().then(res => {
      this.categories = res.data.categories;
    });
  },
  data() {
    return {
      expands: [], //只展开当前行
      getrowkeys(row) {
        return row.id;
      },
      currentPage: 1,
      total: 0,
      pageSize: 5,
      categories: [], //所有分类
      tableData: [
        // {
        //   id: 46,
        //   ctime: "2020-05-06T13:45:31.000Z",
        //   name: "aa",
        //   category: "热销榜",
        //   price: 11,
        //   imgUrl: "1588772722276.jpg",
        //   goodsDesc: "不错的商品",
        //   rating: 100,
        //   sellCount: 288
        // }
      ],
      dialogFormVisible: false, //隐藏的编辑表单
      form: {
        //表单数据
        name: "",
        category: "",
        price: "",
        imgUrl: "",
        goodsDesc: "",
        id: ""
      },
      formLabelWidth: "120px"
    };
  },
  methods: {
    //点击分页选项更新页面数据
    updateList(currentPage, pageSize) {
      List_api(currentPage, pageSize).then(res => {
        this.total = res.data.total;
        this.tableData = res.data.data;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
      });
    },
    //删除商品
    handleDelete(id) {
      if (confirm("是否确定移除该商品信息？")) {
        Delgoods_api(id).then(res => {
          if (res.data.code == 0) {
            this.$message({
              showClose: true,
              message: "商品已经成功从列表移除",
              type: "success"
            });
            this.updateList(this.currentPage, this.pageSize);
          } else {
            this.$message({
              showClose: true,
              message: "很抱歉,商品移除失败,请稍后重试或登陆更高权限",
              type: "error"
            });
          }
        });
      }
    },
    //获取编辑并保存到表单数据
    handleEdit(obj) {
      this.dialogFormVisible = true;
      this.form = JSON.parse(JSON.stringify(obj));
      // console.log(window.sessionStorage.getItem('Edit'))
      //跳转
      // if(confirm('确认需要修改该账号的信息吗？')) this.$router.push('/index/AccUpdate')
    },
    //保存编辑
    saveEdit() {
      this.dialogFormVisible = false;
      Editgoods_api(
        this.form.name,
        this.form.category,
        this.form.price,
        this.form.imgUrl,
        this.form.goodsDesc,
        this.form.id
      ).then(res => {
        if (res.data.code == 0) {
          this.$message({
            showClose: true,
            message: "商品修改成功",
            type: "success"
          });
          this.updateList(this.currentPage, this.pageSize);
        } else {
          this.$message({
            showClose: true,
            message: "商品编辑失败,请稍后再试",
            type: "error"
          });
        }
      });
    },
    //只展开一行列表
    expandChange(row, expandedRows) {
      let that = this;
      //只展开一行
      if (expandedRows.length) {
        //说明展开了
        that.expands = [];
        if (row) {
          that.expands.push(row.id); //只展开当前行id
        }
      } else {
        //说明收起了
        that.expands = [];
      }
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
    }
  }
};
</script>

<style lang="less" scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>