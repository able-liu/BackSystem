<template>
  <div>
    <div class="top">
      <span>账号列表</span>
    </div>
    <div class="content">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="账号" width="120">
          <template slot-scope="scope">{{ scope.row.account }}</template>
        </el-table-column>
        <el-table-column prop="userGroup" label="用户组" width="120"></el-table-column>
        <el-table-column prop="ctime" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row.id,scope.row.account,scope.row.userGroup)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 嵌套的表单编辑账号 -->
      <el-dialog title="账号编辑" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="账号" :label-width="formLabelWidth">
            <el-input v-model="form.account" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户组" :label-width="formLabelWidth">
            <el-select v-model="form.userGroup" placeholder="请选择账号分组">
              <el-option label="超级管理员" value="超级管理员"></el-option>
              <el-option label="普通管理员" value="普通管理员"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </div>
      </el-dialog>
      <div style="display:flex;justify-content: center;align-items: center;margin-top:20px">
        <el-pagination
          @current-change="updateList($event,pageSize)"
          @size-change="updateList(currentPage,$event)"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 25]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <div>
        <el-button type="danger" @click="deletemany">批量删除</el-button>
        <el-button type="primary" @click="toggleSelection()">取消全选</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Acclist_api } from "../../../api/apis.js";
import { Deleteacc_api } from "../../../api/apis.js";
import { Batchdel_api } from "../../../api/apis.js";
import { Edit_api } from "../../../api/apis.js";
export default {
  //页面加载时发送请求获取数据
  created() {
    Acclist_api(this.currentPage, this.pageSize).then(res => {
      this.total = res.data.total;
      
      this.tableData = res.data.data;
    });
  },
  data() {
    return {
      nodata: true,
      total: 0, //总条数
      currentPage: 1, //当前页码
      pageSize: 5, //当前页显示条数
      tableData: [
        //表格数据结构
        // {
        //   id: 93,
        //   ctime: "2020-06-05T11:41:45.000Z",
        //   account: "2432432432",
        //   userGroup: "超级管理员",
        //   imgUrl: "default.jpg"
        // }
      ],
      multipleSelection: [], //保存选中数据的id
      dialogFormVisible: false, //隐藏的编辑表单
      form: {
        //表单数据
        id:'',
        account: "",
        userGroup: ""
        // date1: '',
        // date2: '',
        // delivery: false,
        // type: [],
        // resource: '',
        // desc: ''
      },
      formLabelWidth: "120px" //表单宽度
    };
  },
  methods: {
    //取消全选
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    //获取当前选中的对象
    handleSelectionChange(val) {
      let arr = [];
      for (let item of val) {
        arr.push(item.id);
      }
      this.multipleSelection = arr;
      // console.log(this.multipleSelection);
      //this.multipleSelection=arr.map(item)=>{
        //  return item.id
     // }
    },
    //批量删除
    deletemany() {
      if (this.multipleSelection.length == 0) {
        if (this.nodata) {
          this.nodata = false;
          this.$message({
            showClose: true,
            message: "当前未选中任何数据",
            type: "error"
          });
          setTimeout(() => {
            this.nodata = true;
          }, 3000);
        }
      } else if (confirm("是否批量移除该账户信息？")) {
        Batchdel_api(JSON.stringify(this.multipleSelection)).then(res => {
          if (res.data.code == 0) {
            this.$message({
              showClose: true,
              message: "批量删除成功",
              type: "success"
            });
            this.updateList(this.currentPage, this.pageSize);
          } else {
            this.$message({
              showClose: true,
              message: "批量删除失败,请稍后重试或登陆更高权限",
              type: "error"
            });
          }
        });
      }
    },
    //获取编辑并保存到表单数据
    handleEdit(id,account,userGroup) {
      this.dialogFormVisible = true
      this.form.id=id;
      this.form.account=account;
      this.form.userGroup=userGroup;
      // console.log(window.sessionStorage.getItem('Edit'))
      //跳转
      // if(confirm('确认需要修改该账号的信息吗？')) this.$router.push('/index/AccUpdate')
    },
    //保存编辑
    saveEdit() {
      this.dialogFormVisible = false
      Edit_api(this.form.id,this.form.account,this.form.userGroup).then(res=>{
        if(res.data.code==0){
          this.$message({
            showClose: true,
            message: "账号修改成功",
            type: "success"
          });
          this.updateList(this.currentPage, this.pageSize);
        }else{
          this.$message({
          showClose: true,
          message: '账号编辑失败,请稍后再试',
          type: 'error'
        });
        }
      });
    },
    //删除单个账号
    handleDelete(id) {
      if (confirm("是否确定移除该账户信息？")) {
        Deleteacc_api(id).then(res => {
          if (res.data.code == 0) {
            this.$message({
              showClose: true,
              message: "账号已经成功从列表移除",
              type: "success"
            });
            this.updateList(this.currentPage, this.pageSize);
          } else {
            this.$message({
              showClose: true,
              message: "很抱歉,账户移除失败,请稍后重试或登陆更高权限",
              type: "error"
            });
          }
        });
      }
    },
    //点击分页选项更新页面数据
    updateList(currentPage, pageSize) {
      Acclist_api(currentPage, pageSize).then(res => {
        this.total = res.data.total;
        this.tableData = res.data.data;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
      });
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