<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="订单号">
        <el-input @change="issearch=true" v-model="orderNo" placeholder="订单号"></el-input>
      </el-form-item>
      <el-form-item label="收货人">
        <el-input @change="issearch=true" v-model="consignee" placeholder="收货人"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input @change="issearch=true" v-model="phone" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select @change="issearch=true" v-model="orderState" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-date-picker
        @change="issearch=true"
        v-model="timearea"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <el-form-item>
        <el-button @click="search" style="margin-left:10px" type="primary">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" height="450">
      <el-table-column fixed="left" prop="orderNo" label="订单号" width="150"></el-table-column>
      <el-table-column prop="orderTime" label="下单时间" width="200"></el-table-column>
      <el-table-column prop="phone" label="电话" width="120"></el-table-column>
      <el-table-column prop="consignee" label="收货人" width="80"></el-table-column>
      <el-table-column prop="deliverAddress" label="配送地址" width="150"></el-table-column>
      <el-table-column prop="deliveryTime" label="送达时间" width="200"></el-table-column>
      <el-table-column prop="remarks" label="用户备注" width="80"></el-table-column>
      <el-table-column prop="orderAmount" label="订单金额" width="80"></el-table-column>
      <el-table-column prop="orderState" label="订单状态" width="100"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row.id)" type="text" size="small">查看</el-button>
          <el-button @click="handleEdit(scope.row.id)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 详情 -->
    <el-dialog title="订单详情" :visible.sync="dialogFormVisible">
      <el-form :model="formData">
        <el-form-item label="订单号" :label-width="formLabelWidth">
          <el-input disabled v-model="formData.orderNo" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="下单时间" :label-width="formLabelWidth">
          <el-input disabled v-model="formData.orderTime" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth">
          <el-input :disabled="isedit" v-model="formData.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="收货人" :label-width="formLabelWidth">
          <el-input :disabled="isedit" v-model="formData.consignee" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="送货地址" :label-width="formLabelWidth">
          <el-input :disabled="isedit" v-model="formData.deliverAddress" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="送达时间" :label-width="formLabelWidth">
          <el-input disabled v-model="formData.deliveryTime" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input :disabled="isedit" v-model="formData.remarks" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="订单金额" :label-width="formLabelWidth">
          <el-input disabled v-model="formData.orderAmount" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="订单状态" :label-width="formLabelWidth">
          <el-select :disabled="isedit" v-model="formData.orderState" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="savedata">确定</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <div style="display:flex;justify-content: center;align-items: center;margin-top:20px">
      <el-pagination
        @current-change="updateList($event,pageSize)"
        @size-change="updateList(currentPage,$event)"
        :current-page="currentPage"
        :page-sizes="[10, 15, 20, 25]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import {
  Order_list,
  Search_list,
  Detail_api,
  Order_edit_api
} from "@/api/apis.js";
export default {
  //发送请求获取默认页码和数据条数的数据
  created() {
    Order_list(this.currentPage, this.pageSize).then(res => {
      // for(let item in res.data.data){
      // item.orderTime=this.date(item.orderTime);
      // item.deliveryTime=this.date(item.deliveryTime);
      // }
      let table = res.data.data;
      for (let i in table) {
        table[i].deliveryTime = this.date(table[i].deliveryTime);
        table[i].orderTime = this.date(table[i].orderTime);
      }
      this.tableData = table;
      this.total = res.data.total;
    });
  },
  //数据存放
  data() {
    return {
      options: [
        { value: "已完成", label: "已完成" },
        { value: "已受理", label: "已受理" },
        { value: "派送中", label: "派送中" }
      ],//订单状态的可选项
      isedit: true, //是否可编辑
      dialogFormVisible: false,//控制模态框的显示与隐藏
      formLabelWidth: "120px",//组件的label的宽度
      issearch: true,//是否发送查询请求的标杆值
      orderNo: "", //订单号
      phone: "", //电话
      consignee: "", //收获人
      orderState: "", //订单状态
      timearea: [],
      tableData: [
        // {
        //   id: 14,
        //   orderNo: "14014",
        //   orderTime: "2020-04-06T10:24:57.000Z",
        //   phone: "18181358998",
        //   consignee: "小王",
        //   deliverAddress: "天府新谷",
        //   deliveryTime: "",
        //   remarks: "微辣",
        //   orderAmount: 59.88,
        //   orderState: "已受理"
        // }
      ], //表格数据
      total: 0, //数据总条数
      currentPage: 1,//当前页码
      pageSize: 10,//每页显示的数据条数
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },//日期选择器
      value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],//保存选取的日期时间
      formData: {}//保存模态框内的数据显示
    };
  },
  //方法存放
  methods: {
    //查看订单详情
    handleClick(id) {
      Detail_api(id).then(res => {
        if (res) {
          res.data.data.deliveryTime = this.date(res.data.data.deliveryTime);
          res.data.data.orderTime = this.date(res.data.data.orderTime);
          this.formData = JSON.parse(JSON.stringify(res.data.data));
        }
      });
      this.dialogFormVisible = true;
      this.isedit = true;
    },
    //修改订单
    handleEdit(id) {
      this.handleClick(id);
      this.isedit = false;
    },
    //保存数据的修改
    savedata() {
      //判断数据是查看还是编辑
      if (this.isedit) {
        this.dialogFormVisible = false;
      } else {
        let data = JSON.parse(JSON.stringify(this.formData));
        Order_edit_api(
          data.id, //订单id
          data.orderNo, //订单号
          data.orderTime, //下单时间
          data.phone, //电话
          data.consignee, //收获人
          data.deliverAddress, //送货地址
          data.deliveryTime, //送达时间
          data.remarks, //备注
          data.orderAmount, //订单金额
          data.orderState //订单装态
        ).then(res => {
          if (res.data.code == 0) {
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: "success"
            });
            this.updateList(this.currentPage, this.pageSize);
          } else {
            this.$message({
              showClose: true,
              message: "修改失败",
              type: "error"
            });
          }
        });
      }
      this.dialogFormVisible = false;
    },
    //点击分页选项更新页面数据
    updateList(currentPage, pageSize) {
      Order_list(currentPage, pageSize).then(res => {
        this.total = res.data.total;
        let table = res.data.data;
        for (let i in table) {
          table[i].deliveryTime = this.date(table[i].deliveryTime);
          table[i].orderTime = this.date(table[i].orderTime);
        }
        this.tableData = table;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
      });
    },
    //查询订单
    search() {
      // console.log(this.timearea) [Tue Jun 09 2020 00:01:00 GMT+0800 (中国标准时间), Sat Jun 13 2020 00:02:00 GMT+0800 (中国标准时间), __ob__: Observer]
      if (this.issearch) {
        Search_list(
          1,
          this.pageSize,
          this.orderNo,
          this.consignee,
          this.phone,
          this.orderState,
          JSON.stringify(this.date(this.timearea))
        ).then(res => {
          if (res) {
            this.issearch = false;
            let table = res.data.data;
            for (let i in table) {
              table[i].deliveryTime = this.date(table[i].deliveryTime);
              table[i].orderTime = this.date(table[i].orderTime);
            }
            this.tableData = table;
            this.total = res.data.total;
            this.currentPage = 1;
          } else {
            this.$message({
              showClose: true,
              message: "搜索失败",
              type: "error"
            });
          }
        });
      } else {
        this.$message({
          showClose: true,
          message: "搜索内容已经展示,您无需重复搜索",
          type: "error"
        });
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
.el-form-item {
  height: 30px;
}
</style>